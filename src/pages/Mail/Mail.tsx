import React, { useState } from 'react';
import '../../styles/mainEmail.css';
import Filter from '../../component/Mail/Leftside/Filter';
import MailBreif from '../../component/Mail/Leftside/MailBreif';
import ChatBox from '../../component/Mail/Rightside/ChatBox';
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
