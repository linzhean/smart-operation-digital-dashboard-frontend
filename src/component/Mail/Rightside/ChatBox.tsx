import React, { useState, useEffect, useCallback } from 'react';
import styles from './chatBox.module.css';
import { Email, EmailMessage, getEmailDetails, sendMessage } from '../../../services/mailService';
import sendIcon from '../../../assets/icon/send.png'
import { useUserContext } from '../../../context/UserContext';

interface ChatBoxProps {
  emailId: number;
  emailName: string; 
  sendNewChatMessage: (emailId: number, message: string) => Promise<void>;
}

const ChatBox: React.FC<ChatBoxProps> = ({ emailId, emailName,sendNewChatMessage }) => {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [email, setEmail] = useState<Email | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const { user } = useUserContext();

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
  }, [emailId, newMessage, sendNewChatMessage]);

  console.log(`!!!!!!!!!!!!!!!!`+user?.id)
  
 
  return (
    <div className={styles.chatContainer}>
      <div className={styles.mailTitle}>
      {emailName && <h2 className={styles.theTitle}>{emailName}</h2>}
      </div>
{/* 
      <div className={styles.chatBox}>
  {messages.length > 0 ? (
    messages.map((message) => (
      <div 
        key={message.messageId} 
        className={`${styles.chatMessage} ${user?.id === message.createId ? styles.myMessage : ''}`}
      >
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
</div> */}
<div className={styles.chatBox}>
  {messages.length > 0 ? (
    messages.map((message) => (
      <div 
        key={message.messageId} 
        className={`${styles.chatMessage} ${user?.id === message.createId ? styles.myMessage : ''}`}
      >
        <div className={styles.messageContent}>
          {user?.id !== message.createId && (
            <span className={styles.sender}>{message.createId}</span>
          )}
          <span className={styles.content}>{message.content}</span>
        </div>
        {/* <span className={styles.timestamp}>{new Date(message.createDate).toLocaleString()}</span> */}
        <span className={styles.timestamp}>
           {new Date(message.createDate).toLocaleDateString() !== new Date().toLocaleDateString() ? (
           <>
             {new Date(message.createDate).toLocaleDateString()}<br />
           </>
           ) : null}
          {new Date(message.createDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
</span>
        
      </div>
    ))
  ) : (
    <p>沒有訊息了</p>
  )}
</div>
      <div className={styles.inputContainer}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="輸入你的内容..."
        />
        <button  
        className={`${styles.sendButton}`}
         onClick={() => {
          handleSendMessage();
        }}
          disabled={isSending}>
     <img src={sendIcon}  className={styles.sendIcon} alt="發送" />
  </button>
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