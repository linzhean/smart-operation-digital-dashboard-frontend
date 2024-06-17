// src/pages/Mail/Mail.js
import React from 'react';
import '../../styles/mainEmail.css';
import Filter from '../../component/Filter/Filter';
import MailBreif from '../../component/MailBreif/MailBreif';
import ChatBox from '../../component/ChatBox/ChatBox';

const Mail: React.FC = () => {
  return (
    <main className="mainEmail">
      <div className="leftside">
        <Filter />
        <MailBreif />
      </div>
      <div className="rightside">
        <ChatBox />
      </div>
    </main>
  );
};

export default Mail;
