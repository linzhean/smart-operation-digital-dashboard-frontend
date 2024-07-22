import React, { useState, useEffect } from 'react';
import '../../../styles/chatBox.css';
import { EmailMessage, getChatMessages, sendChatMessage } from '../../../services/mailService'; // 确保导入了函数

interface ChatBoxProps {
  email: any; // 可以替换为更具体的类型定义
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
    try {
      const fetchedMessages = await getChatMessages(emailId);
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const newChatMessage = await sendChatMessage(email.id, {
          mailId: email.id,
          content: newMessage,
          available: 'true', // 假设默认为 'true'
          createId: 'user-id', // 这里你需要根据实际情况提供用户 ID
          createDate: new Date().toISOString(), // 当前时间作为创建时间
          modifyId: 'user-id',
          modifyDate: new Date().toISOString()
        });
        setMessages([...messages, newChatMessage]);
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
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
