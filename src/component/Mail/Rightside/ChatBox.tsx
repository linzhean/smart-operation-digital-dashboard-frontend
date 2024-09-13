import React, { useState, useEffect, useCallback } from 'react';
import styles from './chatBox.module.css';
import { Email, EmailMessage, getEmailDetails, sendMessage } from '../../../services/mailService';

interface ChatBoxProps {
  emailId: number;
  onMessageChange?: (message: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ emailId, onMessageChange }) => {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [email, setEmail] = useState<Email | null>(null);

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
    if (newMessage.trim()) {
      try {
        const newMessageId = Date.now();
        const newChatMessage = await sendMessage(emailId, {
          messageId: newMessageId,
          content: newMessage,
          available: 'true',
          createId: 'currentUser',
          createDate: new Date().toISOString(),
          modifyId: 'currentUser',
          modifyDate: new Date().toISOString(),
        });
        setMessages(prevMessages => [...prevMessages, newChatMessage]);
        setNewMessage('');
        if (onMessageChange) {
          onMessageChange(newMessage);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }, [emailId, newMessage, onMessageChange]);

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
                <span className={styles.content}> {message.content}</span>
              </div>
              <span className={styles.timestamp}> {new Date(message.createDate).toLocaleString()} </span>
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
