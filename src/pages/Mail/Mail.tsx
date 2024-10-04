// import React, { useState, useEffect, useCallback } from 'react';
// import styles from './Mail.module.css';
// import Filter from '../../component/Mail/Leftside/Filter';
// import MailBreif from '../../component/Mail/Leftside/MailBreif';
// import ChatBox from '../../component/Mail/Rightside/ChatBox';
// import { useEmails } from '../../Hook/useEmails';
// import backIcon from '../../assets/icon/mailBack.png'

// const Mail: React.FC = () => {
//   const {
//     emails,
//     selectedEmail,
//     loading,
//     error,
//     selectEmail,
//     deleteExistingEmail,
//     fetchEmails,
//     sendNewChatMessage,
//   } = useEmails();

//   const [showRightSide, setShowRightSide] = useState(false);
//   const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
//   const [chatMessage, setChatMessage] = useState('');

//   useEffect(() => {
//     fetchEmails(selectedStatuses);
//   }, [selectedStatuses, fetchEmails]);

//   const handleMailItemClick = useCallback(async (id: number) => {
//     await selectEmail(id);
//     setShowRightSide(true);
//   }, [selectEmail]);

//   const handleBackClick = useCallback(() => {
//     setShowRightSide(false);
//   }, []);

//   const handleFilterChange = useCallback((statuses: string[]) => {
//     setSelectedStatuses(statuses);
//   }, []);

//   const handleSendMessage = useCallback(async () => {
//     if (selectedEmail) {
//       if (chatMessage.trim()) {
//         await sendNewChatMessage(selectedEmail.id, chatMessage);
//         setChatMessage('');
//       } else {
//         console.error('請勿傳送空訊息');
//       }
//     }
//   }, [selectedEmail, chatMessage, sendNewChatMessage]);

//   const handleDeleteEmail = useCallback(async (id: number) => {
//     await deleteExistingEmail(id);
//     fetchEmails(selectedStatuses);
//   }, [deleteExistingEmail, fetchEmails, selectedStatuses]);

//   return (
//     <main className={styles.theEmailBox}>
//       <div className={`${styles.LeftMail} ${showRightSide ? styles.theMailHidden : ''}`}>
//         <Filter onFilterChange={handleFilterChange} />
//         <MailBreif
//           onMailClick={handleMailItemClick}
//           emails={emails}
//           onDeleteEmail={handleDeleteEmail}
//         />
//         {loading && <div className={`loadingMsg`}></div>}
//         {error && <p className={styles.errorMsg}>{error}</p>}

//       </div>

//       <div className={`${styles.RightMail} ${showRightSide ? '' : styles.theMailHidden}`}>
//         <button className={styles.backButton} onClick={handleBackClick}>
//           <img src={backIcon} className={styles.backIcon} />
//         </button>
//         {selectedEmail && (
//           <div className={styles.chatboxContainer}>
//             <ChatBox
//               emailId={selectedEmail.id}
//               onMessageChange={setChatMessage}
//               emailName={selectedEmail?.name}
//             />
//             <button className={styles.sendButton} onClick={handleSendMessage}>發送</button>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// };

// export default Mail;

import React, { useState, useEffect, useCallback } from 'react';
import styles from './Mail.module.css';
import Filter from '../../component/Mail/Leftside/Filter';
import MailBreif from '../../component/Mail/Leftside/MailBreif';
import ChatBox from '../../component/Mail/Rightside/ChatBox';
import { useEmails } from '../../Hook/useEmails';
import backIcon from '../../assets/icon/mailBack.png'

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

  useEffect(() => {
    fetchEmails(selectedStatuses);
  }, [selectedStatuses, fetchEmails]);

  const handleMailItemClick = useCallback(async (id: number) => {
    await selectEmail(id);
    setShowRightSide(true);
  }, [selectEmail]);

  const handleBackClick = useCallback(() => {
    setShowRightSide(false);
  }, []);

  const handleFilterChange = useCallback((statuses: string[]) => {
    setSelectedStatuses(statuses);
  }, []);

  const handleDeleteEmail = useCallback(async (id: number) => {
    await deleteExistingEmail(id);
    fetchEmails(selectedStatuses);
  }, [deleteExistingEmail, fetchEmails, selectedStatuses]);

  return (
    <main className={styles.theEmailBox}>
      <div className={`${styles.LeftMail} ${showRightSide ? styles.theMailHidden : ''}`}>
        <Filter onFilterChange={handleFilterChange} />
        <MailBreif
          onMailClick={handleMailItemClick}
          emails={emails}
          onDeleteEmail={handleDeleteEmail}
        />
        {loading && <div className={`loadingMsg`}></div>}
        {error && <p className={styles.errorMsg}>{error}</p>}
      </div>

      <div className={`${styles.RightMail} ${showRightSide ? '' : styles.theMailHidden}`}>
        <button className={styles.backButton} onClick={handleBackClick}>
          <img src={backIcon} className={styles.backIcon} alt="返回" />
        </button>
        {selectedEmail && (
          <ChatBox
            emailId={selectedEmail.id}
            emailName={selectedEmail.name}
            sendNewChatMessage={sendNewChatMessage}
          />
        )}
      </div>
    </main>
  );
};

export default Mail;