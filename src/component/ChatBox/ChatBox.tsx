// src/components/ChatBox/ChatBox.js
import React from 'react';
import "../../styles/chatBox.css";

const ChatBox: React.FC = () => {
  return (
    <div className="chatContainer">
      <div className="mailTitle">
        <h5 className="caption">廢品率高於20%</h5>
        <h6 className="assignor">發起人:林哲安</h6>
        <i className="fa-solid fa-circle-chevron-down"></i>
      </div>
      <div className="chatBox custom-scrollbar">
        {/* Future chat messages will go here */}
      </div>
      <div className="input-container">
        <textarea className="mailContent" placeholder="請輸入訊息"></textarea>
        <i className="fa-solid fa-paper-plane arrow-icon"></i>
      </div>
    </div>
  );
};

export default ChatBox;
