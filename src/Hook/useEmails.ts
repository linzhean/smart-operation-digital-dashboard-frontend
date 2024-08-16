// src/Hook/useEmails.ts
import { useState, useEffect } from 'react';
import { getEmails, getEmailDetails, createEmail, updateEmail, deleteEmail, sendMessage } from '../services/mailService';
import { Email, EmailMessage } from '../services/mailService';
import apiClient from '../services/axiosConfig';

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
            // 从 email 对象中删除 createDate
            const { createDate, ...emailWithoutCreateDate } = email;
            const newEmail = { ...emailWithoutCreateDate, id: 0 };
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

    const getEmailChatMessages = async (emailId: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get(`/mail/${emailId}`);
            const messages: EmailMessage[] = handleApiResponse<EmailMessage[]>(response.data);

            setSelectedEmail(prevEmail =>
                prevEmail ? {
                    ...prevEmail,
                    messageList: messages
                } : null
            );
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date): string => {
        const yyyy = date.getFullYear();
        const MM = (`0${date.getMonth() + 1}`).slice(-2);
        const dd = (`0${date.getDate()}`).slice(-2);
        const HH = (`0${date.getHours()}`).slice(-2);
        const mm = (`0${date.getMinutes()}`).slice(-2);
        const ss = (`0${date.getSeconds()}`).slice(-2);
        return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
    };

    const sendNewChatMessage = async (emailId: number, content: string) => {
        if (!content.trim()) {
            console.error('Message content cannot be empty.');
            return;
        }
    
        setLoading(true);
        setError(null);
        try {
            // Fetch email details to get the existing message list
            const emailDetails = await getEmailDetails(emailId);
            const messages = emailDetails.messageList;
    
            // Determine the messageId for the new message (use id of the last message in the list or default to 0)
            const lastMessage = messages[messages.length - 1];
            const newMessageId = lastMessage ? lastMessage.id : 0; // Use 0 as the default value
    
            // Create the new message object
            const newMessage: Omit<EmailMessage, 'id'> = {
                messageId: newMessageId,
                content,
                available: 'true',
                createId: 'currentUser',
                createDate: formatDate(new Date()),
                modifyId: 'currentUser',
                modifyDate: formatDate(new Date()),
                mailId: emailId
            };
    
            // Send the new message
            await sendMessage(emailId, newMessage);
    
            // Refresh the chat messages
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
        fetchEmails,
        getEmailChatMessages,
        sendNewChatMessage,
    };
};

function handleApiResponse<T>(data: any): T {
    if (data.result) {
        return data.data as T;
    } else {
        throw new Error(data.message || 'API Error');
    }
}
