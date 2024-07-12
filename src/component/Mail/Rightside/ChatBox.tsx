import React, { useState, useEffect } from 'react';
import '../../../styles/chatBox.css';
import { getChatMessages, sendChatMessage, EmailMessage } from '../../../services/mailService';

interface ChatBoxProps {
  email: any;
}

const ChatBox: React.FC<ChatBoxProps> = ({ email }) => {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    if (email) {
      loadMessages(email.id);
    }
  }, [email]);

  const loadMessages = async (emailId: number) => {
    const fetchedMessages = await getChatMessages(emailId);
    setMessages(fetchedMessages);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const message = await sendChatMessage(email.id, email.publisher, newMessage);
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="chatBox">
      <div className="messageContainer">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <span>{message.createId}</span>: {message.content}
          </div>
        ))}
      </div>
      <div className="inputContainer">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
