import { useState, useEffect } from 'react';
import { getEmails, getEmailDetails, createEmail, updateEmail, deleteEmail, sendEmail, getChatMessages, sendChatMessage } from '../services/mailService';
import { Email, EmailMessage } from '../services/mailService';

export const useEmails = () => {
    const [emails, setEmails] = useState<Email[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const defaultStatus = '0'; // 默认值，或可以从其他地方传递

    useEffect(() => {
        fetchEmails([defaultStatus]);
    }, []);

    const fetchEmails = async (statuses: string[]) => {
        setLoading(true);
        setError(null);
        try {
            const fetchedEmails = await getEmails(statuses);
            setEmails(fetchedEmails);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const selectEmail = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const emailDetails = await getEmailDetails(id);
            setSelectedEmail(emailDetails);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const createNewEmail = async (email: Partial<Email>) => {
        setLoading(true);
        setError(null);
        try {
            const newEmail = { ...email, id: 0 };
            await createEmail(newEmail as Email);
            await fetchEmails([defaultStatus]);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateExistingEmail = async (id: number, email: Partial<Email>) => {
        setLoading(true);
        setError(null);
        try {
            const updatedEmail = { ...email, id };
            await updateEmail(id, updatedEmail as Email);
            await fetchEmails([defaultStatus]);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteExistingEmail = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await deleteEmail(id);
            await fetchEmails([defaultStatus]);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const sendSelectedEmail = async () => {
        if (selectedEmail) {
            setLoading(true);
            setError(null);
            try {
                await sendEmail(selectedEmail);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const getEmailChatMessages = async (emailId: number) => {
        setLoading(true);
        setError(null);
        try {
            const messages = await getChatMessages(emailId);
            setSelectedEmail(prevEmail => prevEmail ? { ...prevEmail, messageList: messages } : null);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const sendNewChatMessage = async (emailId: number, content: string) => {
        setLoading(true);
        setError(null);
        try {
            const message: EmailMessage = {
                id: 0,
                mailId: emailId,
                messageId: 0,
                content,
                available: 'true',
                createId: 'currentUser', // Replace with actual user ID
                createDate: new Date().toISOString(),
                modifyId: 'currentUser', // Replace with actual user ID
                modifyDate: new Date().toISOString(),
            };
            await sendChatMessage(emailId, message, content);
            await getEmailChatMessages(emailId);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        emails,
        selectedEmail,
        loading,
        error,
        selectEmail,
        createNewEmail,
        updateExistingEmail,
        deleteExistingEmail,
        sendSelectedEmail,
        fetchEmails,
        getEmailChatMessages,
        sendNewChatMessage,
    };
};
