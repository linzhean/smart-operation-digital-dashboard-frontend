import React, { useState, useEffect } from 'react';
import '../../styles/mainEmail.css';
import Filter from '../../component/Mail/Leftside/Filter';
import MailBreif from '../../component/Mail/Leftside/MailBreif';
import ChatBox from '../../component/Mail/Rightside/ChatBox';
import "../../styles/content.css";
import { useEmails } from '../../Hook/useEmails';

const Mail: React.FC = () => {
  const {
      emails,
      selectedEmail,
      loading,
      error,
      selectEmail,
      deleteExistingEmail,
      fetchEmails,
      sendNewChatMessage,
  } = useEmails();

  const [showRightSide, setShowRightSide] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [chatMessage, setChatMessage] = useState('');

  useEffect(() => {
      fetchEmails(selectedStatuses);
  }, [selectedStatuses]);

  const handleMailItemClick = async (id: number) => {
      await selectEmail(id);
      setShowRightSide(true);
  };

  const handleBackClick = () => {
      setShowRightSide(false);
  };

  const handleFilterChange = (statuses: string[]) => {
      setSelectedStatuses(statuses);
  };

  const handleSendMessage = async () => {
      if (selectedEmail) {
          if (chatMessage.trim()) { // Check if chatMessage is not empty
              await sendNewChatMessage(selectedEmail.id, chatMessage);
              setChatMessage('');
          } else {
              console.error('Cannot send empty message');
          }
      }
  };

  return (
      <main className="mainEmailUnique">
          <div className={`leftsideUnique ${showRightSide ? 'hiddenUnique' : ''}`}>
              {loading && <p>Loading...</p>}
              {error && <p className="error">{error}</p>}
              <Filter onFilterChange={handleFilterChange} />
              <MailBreif onMailClick={handleMailItemClick} emails={emails} />
          </div>
          <div className={`rightsideUnique ${showRightSide ? '' : 'hiddenUnique'}`}>
              <button className="toggle-buttonUnique" onClick={handleBackClick}>返回</button>
              {selectedEmail && (
                  <div className="chat-containerUnique">
                      <ChatBox 
                          emailId={selectedEmail.id} 
                          onDelete={() => deleteExistingEmail(selectedEmail.id)}
                          onMessageChange={setChatMessage} 
                      />
                      <button className="send-buttonUnique" onClick={handleSendMessage}>發送</button>
                  </div>
              )}
          </div>
      </main>
  );
};

export default Mail;
