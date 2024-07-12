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
  } = useEmails();

  const [showRightSide, setShowRightSide] = React.useState(false);

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

  return (
    <main className="mainEmailUnique">
      <div className={`leftsideUnique ${showRightSide ? 'hiddenUnique' : ''}`}>
        {loading && <p>加载中...</p>}
        {error && <p className="error">{error}</p>}
        <Filter />
        <MailBreif onMailClick={handleMailItemClick} emails={emails} />
        <button className="create-buttonUnique" onClick={handleCreateEmailClick}>创建邮件</button>
      </div>
      <div className={`rightsideUnique ${showRightSide ? '' : 'hiddenUnique'}`}>
        <button className="toggle-buttonUnique" onClick={handleBackClick}>
          返回
        </button>
        {selectedEmail && (
          <div>
            <ChatBox email={selectedEmail} />
            <button className="delete-buttonUnique" onClick={() => deleteExistingEmail(selectedEmail.id)}>删除邮件</button>
            <button className="send-buttonUnique" onClick={sendSelectedEmail}>发送邮件</button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Mail;
