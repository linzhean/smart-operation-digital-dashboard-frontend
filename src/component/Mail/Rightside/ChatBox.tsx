import React, { useState, useEffect, useCallback } from 'react';
import '../../../styles/chatBox.css';
import { Email, EmailMessage, getEmailDetails, sendMessage, deleteEmail } from '../../../services/mailService';

interface ChatBoxProps {
  emailId: number;
  onDelete: () => void;
  onMessageChange?: (message: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ emailId, onDelete, onMessageChange }) => {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [email, setEmail] = useState<Email | null>(null);

  // Fetch email details
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

  // Handle sending a new message
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

  // Handle deleting the email
  const handleDelete = async () => {
    try {
      await deleteEmail(emailId);
      onDelete(); // Notify parent component
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  return (
    <div className="chatContainer">
      <div className="mailTitle">
        <button className="delete-buttonUnique" onClick={handleDelete}>刪除</button>
        <i className="fa-solid fa-ellipsis"></i>
      </div>
      <div className="chatBox custom-scrollbar">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.messageId} className="chatMessage">
              <div className="messageContent">
                <span className="sender">{message.createId}</span>
                <span className="content">{message.content}</span>
              </div>
              <span className="timestamp">{new Date(message.createDate).toLocaleString()}</span>
            </div>
          ))
        ) : (
          <p>沒有訊息了</p>
        )}
      </div>
      <div className="input-container">
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
        <i className="fa fa-arrow-right arrow-icon" onClick={handleSendMessage}></i>
      </div>
    </div>
  );
};

export default ChatBox;
