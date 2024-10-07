import React, { useState, useEffect, useCallback, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import styles from './chatBox.module.css';
import { Email, EmailMessage, getEmailDetails } from '../../../services/mailService';
import sendIcon from '../../../assets/icon/send.png';
import { useUserContext } from '../../../context/UserContext';

interface ChatBoxProps {
  emailId: number;
  emailName: string;
  sendNewChatMessage: (emailId: number, message: string) => Promise<void>;
}

const ChatBox: React.FC<ChatBoxProps> = ({ emailId, emailName, sendNewChatMessage }) => {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [email, setEmail] = useState<Email | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const { user } = useUserContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // const stompClient = useRef<Client | null>(null); // Declare stompClient as a ref

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const fetchEmailDetails = useCallback(async () => {
    try {
      const fetchedEmail = await getEmailDetails(emailId);
      setEmail(fetchedEmail);
      setMessages(fetchedEmail.messageList);
    } catch (error) {
      console.error('獲取郵件詳細資訊時發生錯誤:', error);
    }
  }, [emailId]);

  useEffect(() => {
    fetchEmailDetails();
  }, [fetchEmailDetails]);

  // // WebSocket 初始化
  useEffect(() => {
    const socket = new SockJS('http://140.131.115.153:8080/webSocket');
    const stompClient = new Client({
      webSocketFactory: () => socket as any,  // SockJS 使用
      debug: (str) => console.log(str),       // 用於調試，您可以移除
    });

    stompClient.onConnect = () => {
      // 訂閱服務器上的主題，接收新消息
      stompClient.subscribe('/topic/newMessage', (message) => {
        const receivedMessage = JSON.parse(message.body) as EmailMessage;
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate(); // 組件卸載時關閉 WebSocket 連接
    };
  }, [emailId]);

  // 處理發送訊息
  const handleSendMessage = useCallback(async () => {
    if (newMessage.trim() && !isSending) {
      const tempMessageId = Date.now();
      const newChatMessage: EmailMessage = {
        id: tempMessageId,
        messageId: tempMessageId,
        mailId: emailId,
        content: newMessage,
        available: 'true',
        createId: user!.id,
        createDate: new Date().toISOString(),
        modifyId: 'currentUser',
        modifyDate: new Date().toISOString(),
      };

      // 立即更新状态，显示临时消息
      setMessages((prevMessages) => [...prevMessages, newChatMessage]);
      setNewMessage('');
      setIsSending(true);

      try {
        await sendNewChatMessage(emailId, newMessage);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.messageId === tempMessageId
              ? { ...msg, available: 'true', modifyDate: new Date().toISOString() }
              : msg
          )
        );
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.messageId !== tempMessageId)
        );
      } finally {
        setIsSending(false);
      }
    }
  }, [emailId, newMessage, sendNewChatMessage, user]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetTimestamp = (createDate: string) => {
    const messageDate = new Date(createDate);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const formattedTime = messageDate.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const isToday = messageDate.toLocaleDateString() === currentDate.toLocaleDateString();
    const isCurrentYear = messageDate.getFullYear() === currentYear;

    if (!isToday) {
      if (!isCurrentYear) {
        return `${messageDate.toLocaleDateString()} ${formattedTime}`;
      }
      return `${messageDate.toLocaleDateString(undefined, {
        month: '2-digit',
        day: '2-digit',
      })} ${formattedTime}`;
    }
    return formattedTime;
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.mailTitle}>
        {emailName && <h2 className={styles.theTitle}>{emailName}</h2>}
      </div>

      <div className={styles.chatBox}>
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.messageId}
              className={`${styles.chatMessage} ${user?.id === message.createId ? styles.myMessage : ''
                }`}
            >
              <div className={styles.messageContent}>
                {user?.id !== message.createId && (
                  <span className={styles.sender}>{message.createId}</span>
                )}
                <span className={styles.content}>{message.content}</span>
              </div>
              <span className={styles.timestamp}>{resetTimestamp(message.createDate)}</span>
            </div>
          ))
        ) : (
          <p className={styles.emptyAlert}>尚無訊息</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <textarea
          ref={textareaRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="輸入你的内容..."
        />
        <button
          className={styles.sendButton}
          onClick={handleSendMessage}
          disabled={isSending}
        >
          <img src={sendIcon} className={styles.sendIcon} alt="發送" />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
