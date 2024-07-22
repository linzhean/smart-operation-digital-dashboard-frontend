import React from 'react';
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
    createNewEmail,
    deleteExistingEmail,
    sendSelectedEmail,
    fetchEmails,
  } = useEmails();

  const [showRightSide, setShowRightSide] = React.useState(false);
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>([]);

  React.useEffect(() => {
    const fetchFilteredEmails = async () => {
      await fetchEmails(selectedStatuses);
    };

    fetchFilteredEmails();
  }, [selectedStatuses]);

  const handleMailItemClick = async (id: number) => {
    await selectEmail(id);
    setShowRightSide(true);
  };

  const handleBackClick = () => {
    setShowRightSide(false);
  };

  const handleCreateEmailClick = async () => {
    await createNewEmail({});
  };

  const handleFilterChange = (statuses: string[]) => {
    setSelectedStatuses(statuses);
  };

  return (
    <main className="mainEmailUnique">
      <div className={`leftsideUnique ${showRightSide ? 'hiddenUnique' : ''}`}>
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        <Filter onFilterChange={handleFilterChange} />
        <MailBreif onMailClick={handleMailItemClick} emails={emails} />
        <button className="create-buttonUnique" onClick={handleCreateEmailClick}>創建郵件</button>
      </div>
      <div className={`rightsideUnique ${showRightSide ? '' : 'hiddenUnique'}`}>
        <button className="toggle-buttonUnique" onClick={handleBackClick}>返回</button>
        {selectedEmail && (
          <div>
            <ChatBox email={selectedEmail} />
            <button className="delete-buttonUnique" onClick={() => deleteExistingEmail(selectedEmail.id)}>刪除郵件</button>
            <button className="send-buttonUnique" onClick={sendSelectedEmail}>發送郵件</button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Mail;
