import React, { useState, useEffect } from 'react';
import '../../../styles/chatBox.css';
import { getChatMessages, sendChatMessage } from '../../../services/chatService';

interface ChatBoxProps {
  email: any;
}

interface ChatMessage {
  id: string;
  emailId: string;
  sender: string;
  content: string;
  timestamp: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ email }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    loadMessages();
  }, [email]);

  const loadMessages = async () => {
    const chatMessages = await getChatMessages(email.id);
    setMessages(chatMessages);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const sentMessage = await sendChatMessage(email.id, 'Current User', newMessage.trim());
      setMessages([...messages, sentMessage]);
      setNewMessage('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatContainer">
      <div className="mailTitle">
        <h5 className="caption">{email.subject}</h5>
        <h6 className="assignor">发起人: {email.sender}</h6>
        <i className="fa-solid fa-circle-chevron-down"></i>
      </div>
      <div className="chatBox custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className="chatMessage">
            <p><strong>{msg.sender}:</strong> {msg.content}</p>
          </div>
        ))}
      </div>
      <div className="input-container">
        <textarea
          className="mailContent"
          placeholder="请输入消息"
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        ></textarea>
        <i className="fa-solid fa-paper-plane arrow-icon" onClick={handleSendMessage}></i>
      </div>
    </div>
  );
};

export default ChatBox;
