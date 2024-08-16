import React, { useState, useEffect } from 'react';
import '../../../styles/chatBox.css';
import { Email, EmailMessage, getEmailDetails, sendMessage } from '../../../services/mailService';

interface ChatBoxProps {
  emailId: number;
  onDelete: () => void;
  onMessageChange?: (message: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ emailId, onDelete, onMessageChange }) => {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [email, setEmail] = useState<Email | null>(null);

  useEffect(() => {
    const loadEmail = async () => {
      try {
        const fetchedEmail = await getEmailDetails(emailId);
        setEmail(fetchedEmail);
        setMessages(fetchedEmail.messageList);
      } catch (error) {
        console.error('Error fetching email details:', error);
      }
    };

    loadEmail();
  }, [emailId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) { // Ensure message is not empty
      try {
        const newMessageId = Date.now(); // Generate a unique ID
        const newChatMessage = await sendMessage(emailId, {
          messageId: newMessageId,
          content: newMessage,
          available: 'true',
          createId: 'currentUser',
          createDate: new Date().toISOString(),
          modifyId: 'currentUser',
          modifyDate: new Date().toISOString(),
        });
        setMessages([...messages, newChatMessage]);
        setNewMessage('');
        if (onMessageChange) {
          onMessageChange(newMessage);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      console.error('Message content cannot be empty.');
    }
  };

  return (
    <div className="chatContainer">
      <div className="mailTitle">
        <button className="delete-buttonUnique" onClick={onDelete}>刪除</button>
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
          <p>No messages yet</p>
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
