import React, { useState } from 'react';
import '../../styles/mainEmail.css';
import Filter from '../../component/Filter';
import MailBreif from '../../component/MailBreif/MailBreif';
import ChatBox from '../../component/ChatBox';
import "../../styles/content.css";

const Mail: React.FC = () => {
  const [showRightSide, setShowRightSide] = useState(false);

  const handleMailItemClick = () => {
    setShowRightSide(true);
  };

  const handleBackClick = () => {
    setShowRightSide(false);
  };

  return (
    <main className="mainEmail">
      <div className={`leftside ${showRightSide ? 'hidden' : ''}`}>
        <Filter />
        <MailBreif onMailClick={handleMailItemClick} />
      </div>
      <div className={`rightside ${showRightSide ? '' : 'hidden'}`}>
        <button className="toggle-button" onClick={handleBackClick}>
          返回
        </button>
        <ChatBox />
      </div>
    </main>
  );
};

export default Mail;
