//src\Hook\useEmails.ts
import { useState, useEffect } from 'react';
import { getEmails, getEmailDetails, createEmail, updateEmail, deleteEmail, sendChatMessage } from '../services/mailService';
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

    const getEmailChatMessages = async (emailId: number) => {
        setLoading(true);
        setError(null);
        try {
            // 获取聊天消息
            const response = await apiClient.get(`/mail/messages`);
            const messages: EmailMessage[] = handleApiResponse<EmailMessage[]>(response.data); // 确保 messages 是 EmailMessage[] 类型
            
            // 更新所选电子邮件的消息列表
            setSelectedEmail(prevEmail => 
                prevEmail ? { 
                    ...prevEmail, 
                    messageList: messages // 确保这里是正确的 EmailMessage 数组
                } : null
            );
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
            const message: Omit<EmailMessage, 'id' | 'messageId'> = {
                mailId: emailId,
                content,
                available: 'true',
                createId: 'currentUser', // 替换为实际用户ID
                createDate: new Date().toISOString(),
                modifyId: 'currentUser', // 替换为实际用户ID
                modifyDate: new Date().toISOString(),
            };
            await sendChatMessage(emailId, message);
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
