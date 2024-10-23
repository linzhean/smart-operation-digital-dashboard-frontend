import React, { useState, useEffect, useCallback, useRef } from 'react';
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

  useEffect(() => {
    const interval = setInterval(() => {
      fetchEmailDetails();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchEmailDetails]);

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
          messages.map((message, index) => {
            const messageDate = new Date(message.createDate).toLocaleDateString();
            const isToday = messageDate === new Date().toLocaleDateString();

            const isFirstTodayMessage =
              isToday &&
              (index === 0 || new Date(messages[index - 1].createDate).toLocaleDateString() !== messageDate);

            return (
              <>
                {isFirstTodayMessage && <div className={styles.todayMsg}>今天</div>}
                <div key={message.messageId} className={`${styles.chatMessage} ${user?.id === message.createId ? styles.myMessage : ''}`}>
                  <div className={styles.messageContent}>
                    {user?.id !== message.createId && (
                      <span className={styles.sender}>{message.createId}</span>
                    )}
                    <span className={styles.content}>{message.content}</span>
                  </div>
                  <span className={styles.timestamp}>{resetTimestamp(message.createDate)}</span>
                </div>
              </>
            );
          })
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
