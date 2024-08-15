// src/pages/Mail/Mail.tsx
import React from 'react';
import '../../styles/mainEmail.css';
import Filter from '../../component/Mail/Leftside/Filter';
import MailBreif from '../../component/Mail/Leftside/MailBreif';
import ChatBox from '../../component/Mail/Rightside/ChatBox';
import "../../styles/content.css";
import { useEmails } from '../../Hook/useEmails';

const Mail: React.FC = () => {
  const chartId = 1; // Replace with the actual chart ID you need
  const {
    emails,
    selectedEmail,
    loading,
    error,
    selectEmail,
    deleteExistingEmail,
    fetchEmails,
    sendNewChatMessage,
  } = useEmails(chartId);

  const [showRightSide, setShowRightSide] = React.useState(false);
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>(['0']); // Default to '0' status
  const [chatMessage, setChatMessage] = React.useState('');

  // Use the first status from selectedStatuses or a default value
  const currentStatus = selectedStatuses.length > 0 ? selectedStatuses[0] : '0';

  React.useEffect(() => {
    fetchEmails(currentStatus, chartId);
  }, [currentStatus, chartId]); // Fetch emails when `currentStatus` or `chartId` changes

  const handleMailItemClick = async (id: number) => {
    await selectEmail(id);
    setShowRightSide(true);
  };

  const handleBackClick = () => {
    setShowRightSide(false);
  };

  const handleFilterChange = (statuses: string[]) => {
    setSelectedStatuses(statuses.length > 0 ? statuses : ['0']);  // Default value '0' if no statuses are selected
  };

  const handleSendMessage = async () => {
    if (selectedEmail) {
      await sendNewChatMessage(selectedEmail.id, chatMessage);
      setChatMessage(''); // Clear message input
    }
  };

  return (
    <main className="mainEmailUnique">
        <div className={`leftsideUnique ${showRightSide ? 'hiddenUnique' : ''}`}>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && emails.length === 0 && <p>No emails found for the selected status.</p>}
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
                    <button className="send-buttonUnique" onClick={handleSendMessage}>發送消息</button>
                </div>
            )}
        </div>
    </main>
  );
};

export default Mail;