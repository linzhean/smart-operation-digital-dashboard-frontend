import React, { useState, useEffect, useCallback } from 'react';
import styles from './Mail.module.css'
import Filter from '../../component/Mail/Leftside/Filter';
import MailBreif from '../../component/Mail/Leftside/MailBreif';
import ChatBox from '../../component/Mail/Rightside/ChatBox';
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

    const handleSendMessage = useCallback(async () => {
        if (selectedEmail) {
            if (chatMessage.trim()) {
                await sendNewChatMessage(selectedEmail.id, chatMessage);
                setChatMessage('');
            } else {
                console.error('Cannot send empty message');
            }
        }
    }, [selectedEmail, chatMessage, sendNewChatMessage]);

    return (
        <main className={styles.mainEmailUnique}>
            <div className={`${styles.leftsideUnique} ${showRightSide ? styles.hiddenUnique : ''}`}>
                {error && <p className={styles.errorMsg}>{error}</p>}
                {loading && <div className={`loadingMsg`}></div>}
                <Filter onFilterChange={handleFilterChange} />
                <MailBreif onMailClick={handleMailItemClick} emails={emails} />
            </div>

            <div className={`${styles.rightsideUnique} ${showRightSide ? '' : styles.hiddenUnique}`}>
                <button className={styles.toggleButtonUnique} onClick={handleBackClick}>返回</button>
                {selectedEmail && (
                    <div className={styles.chatContainerUnique}>
                        <ChatBox
                            emailId={selectedEmail.id}
                            onDelete={() => deleteExistingEmail(selectedEmail.id)}
                            onMessageChange={setChatMessage}
                        />
                        <button className={styles.sendButtonUnique} onClick={handleSendMessage}>發送</button>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Mail;
