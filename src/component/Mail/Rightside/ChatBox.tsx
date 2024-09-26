import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './chatBox.module.css';
import { Email, EmailMessage, getEmailDetails, sendMessage } from '../../../services/mailService';
import SockJS from 'sockjs-client';
import { Client, Stomp } from '@stomp/stompjs';

interface ChatBoxProps {
  emailId: number;
  onMessageChange?: (message: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ emailId, onMessageChange }) => {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [email, setEmail] = useState<Email | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  
  const stompClientRef = useRef<Client | null>(null); // Reference to STOMP client

  const fetchEmailDetails = useCallback(async () => {
    try {
      const fetchedEmail = await getEmailDetails(emailId);
      setEmail(fetchedEmail);
      setMessages(fetchedEmail.messageList);
    } catch (error) {
      console.error('Error fetching email details:', error);
    }
  }, [emailId]);

  useEffect(() => {
    fetchEmailDetails();
  }, [fetchEmailDetails]);

  const handleSendMessage = useCallback(async () => {
    if (newMessage.trim() && !isSending) {
      const tempMessageId = Date.now(); // 使用临时ID
      const newChatMessage: EmailMessage = {
        id: tempMessageId, // 添加id属性
        messageId: tempMessageId,
        mailId: emailId,
        content: newMessage,
        available: 'true',
        createId: 'currentUser',
        createDate: new Date().toISOString(),
        modifyId: 'currentUser',
        modifyDate: new Date().toISOString(),
      };
  
      // 立即更新状态，显示临时消息
      setMessages((prevMessages) => [...prevMessages, newChatMessage]);
      setNewMessage('');
      setIsSending(true);
  
      try {
        // 发送消息到服务器
        const sentMessage = await sendMessage(emailId, {
          messageId: tempMessageId,
          content: newMessage,
          available: 'true',
          createId: 'currentUser',
          createDate: new Date().toISOString(),
          modifyId: 'currentUser',
          modifyDate: new Date().toISOString(),
        });
  
        // 更新状态，使用服务器返回的消息替换临时消息
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.messageId === tempMessageId ? sentMessage : msg
          )
        );
      } catch (error) {
        console.error('Error sending message:', error);
  
        // 发送失败时，移除临时消息
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.messageId !== tempMessageId)
        );
      } finally {
        setIsSending(false);
      }
  
      if (onMessageChange) {
        onMessageChange(newMessage);
      }
    }
  }, [emailId, newMessage, onMessageChange, isSending]);
 

  return (
    <div className={styles.chatContainer}>
      <div className={styles.mailTitle}>
        <i className={`${styles.faSolid} fa-solid fa-ellipsis`}></i>
      </div>
      <div className={`${styles.chatBox} custom-scrollbar`}>
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.messageId} className={styles.chatMessage}>
              <div className={styles.messageContent}>
                <span className={styles.sender}>{message.createId}</span>
                <span className={styles.content}>{message.content}</span>
              </div>
              <span className={styles.timestamp}>{new Date(message.createDate).toLocaleString()}</span>
            </div>
          ))
        ) : (
          <p>沒有訊息了</p>
        )}
      </div>
      <div className={styles.inputContainer}>
        <textarea
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            if (onMessageChange) {
              onMessageChange(e.target.value);
            }
          }}
          placeholder="輸入你的内容..."
        />
        <i className={`fa fa-arrow-right arrow-icon ${styles.arrowIcon}`} onClick={handleSendMessage}></i>
      </div>
    </div>
  );
};

export default ChatBox;

 // const connectWebSocket = useCallback(() => {
  //   const socket = new SockJS('/webSocket'); 
  //   const client = Stomp.over(socket);

  //   client.connect({}, () => {
  //     client.subscribe(`"/webSocket/newMessage${emailId}`, (message: { body: string }) => {
  //       const newMessage = JSON.parse(message.body);
  //       setMessages((prevMessages) => [...prevMessages, newMessage]);
  //     });
  //   });

  //   stompClientRef.current = client;
  // }, [emailId]);

  // const fetchEmailDetails = useCallback(async () => {
  //   try {
  //     const fetchedEmail = await getEmailDetails(emailId);
  //     setEmail(fetchedEmail);
  //     setMessages(fetchedEmail.messageList);
  //   } catch (error) {
  //     console.error('Error fetching email details:', error);
  //   }
  // }, [emailId]);

  // useEffect(() => {
  //   fetchEmailDetails();
  //   connectWebSocket(); 

  //   // 清理连接
  //   return () => {
  //     if (stompClientRef.current) {
  //       stompClientRef.current.deactivate(); // Changed to deactivate()
  //     }
  //   };
  // }, [fetchEmailDetails, connectWebSocket]);

  // const handleSendMessage = useCallback(async () => {
  //   if (newMessage.trim() && !isSending) {
  //     const tempMessageId = Date.now(); 
  //     const newChatMessage: EmailMessage = {
  //       id: tempMessageId,
  //       messageId: tempMessageId,
  //       mailId: emailId,
  //       content: newMessage,
  //       available: 'true',
  //       createId: 'currentUser',
  //       createDate: new Date().toISOString(),
  //       modifyId: 'currentUser',
  //       modifyDate: new Date().toISOString(),
  //     };

  //     // 立即更新状态，显示临时消息
  //     setMessages((prevMessages) => [...prevMessages, newChatMessage]);
  //     setNewMessage('');
  //     setIsSending(true);

  //     try {
  //       // 发送消息到服务器
  //       await sendMessage(emailId, {
  //         messageId: tempMessageId,
  //         content: newMessage,
  //         available: 'true',
  //         createId: 'currentUser',
  //         createDate: new Date().toISOString(),
  //         modifyId: 'currentUser',
  //         modifyDate: new Date().toISOString(),
  //       });
  //     } catch (error) {
  //       console.error('Error sending message:', error);
  //       // 处理发送失败的情况
  //       setMessages((prevMessages) =>
  //         prevMessages.filter((msg) => msg.messageId !== tempMessageId)
  //       );
  //     } finally {
  //       setIsSending(false);
  //     }

  //     if (onMessageChange) {
  //       onMessageChange(newMessage);
  //     }
  //   }
  // }, [emailId, newMessage, onMessageChange, isSending]);