import React, { useState, useEffect } from 'react';
import '../../../styles/chatBox.css';
import { Email, EmailMessage, getEmailDetails, sendChatMessage } from '../../../services/mailService';

interface ChatBoxProps {
  emailId: number;
  onDelete: () => void;
  onMessageChange?: (message: string) => void; // Add onMessageChange prop
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
        setMessages(fetchedEmail.messageList); // Assume `messageList` contains messages
      } catch (error) {
        console.error('Error fetching email details:', error);
      }
    };

    loadEmail();
  }, [emailId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const newChatMessage = await sendChatMessage(emailId, {
          mailId: emailId,
          content: newMessage,
          available: 'true',
          createId: 'user-id', // Replace with actual user ID
          createDate: new Date().toISOString(),
          modifyId: 'user-id', // Replace with actual user ID
          modifyDate: new Date().toISOString(),
        });
        setMessages([...messages, newChatMessage]);
        setNewMessage('');
        if (onMessageChange) {
          onMessageChange(newMessage); // Notify parent about the message change
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div className="chatContainer">
      <div className="mailTitle">
        <button className="delete-buttonUnique" onClick={onDelete}>刪除郵件</button>
        <i className="fa-solid fa-ellipsis"></i>
      </div>
      <div className="chatBox custom-scrollbar">
        {messages && messages.map((message) => (
          message && (
            <div key={message.id} className="chatMessage">
              <div className="messageContent">
                <span className="sender">{message.createId}</span>
                <span className="content">{message.content}</span>
              </div>
              <span className="timestamp">{new Date(message.createDate).toLocaleString()}</span>
            </div>
          )
        ))}
      </div>
      <div className="input-container">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="请输入"
        />
        <i className="fa fa-arrow-right arrow-icon" onClick={handleSendMessage}></i>
      </div>
    </div>
  );
};

export default ChatBox;
