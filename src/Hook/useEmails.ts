import { useState, useEffect } from 'react';
import {
    getEmails,
    getEmailDetails,
    createEmail,
    updateEmail,
    deleteEmail,
    sendChatMessage,
    getChartsForStatus
} from '../services/mailService';
import { Email, EmailMessage } from '../services/mailService';
import { Chart } from '../services/mailService'; // 确保 Chart 类型已正确导入
import apiClient from '../services/axiosConfig';

// 自定义 Hook: 获取和管理邮件
export const useEmails = (chartId: number) => {
    const [emails, setEmails] = useState<Email[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [charts, setCharts] = useState<Chart[]>([]); // 添加状态用于保存图表数据
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const defaultStatus = '0'; // 默认状态

    useEffect(() => {
        if (chartId) {
            fetchEmails(defaultStatus, chartId);
            fetchChartsForStatus(defaultStatus); // 通过状态获取图表
        }
    }, [chartId]); // 当 chartId 改变时重新获取邮件和图表

    const fetchEmails = async (status: string, chartId: number) => {
        setLoading(true);
        setError(null);
        try {
            const fetchedEmails = await getEmails(status, chartId);

            if (fetchedEmails.length === 0) {
                console.warn("No emails found for status:", status);
            }

            setEmails(fetchedEmails);
        } catch (error: any) {
            console.error("Fetch Emails Error:", error);
            if (error.message.includes("查無此圖表")) {
                setError("未找到与所选状态匹配的图表。请检查图表数据。");
            } else {
                setError(`获取邮件时出错: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchChartsForStatus = async (status: string) => {
        setLoading(true);
        setError(null);
        try {
            const fetchedCharts = await getChartsForStatus(status);
            if (fetchedCharts) {
                setCharts(fetchedCharts);
            } else {
                console.warn('No charts found for status:', status);
            }
        } catch (error: any) {
            console.error('Fetch Charts Error:', error);
            setError(`获取图表时出错: ${error.message}`);
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
            if (error.message.includes('該郵件關聯的圖表不存在')) {
                setError('該郵件關聯的圖表不存在，無法顯示詳細信息。');
            } else {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };
    

    const createNewEmail = async (email: Partial<Email>) => {
        setLoading(true);
        setError(null);
        try {
            await createEmail({ ...email, chartId } as Email);
            await fetchEmails(defaultStatus, chartId);
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
            await updateEmail(id, { ...email, chartId } as Email);
            await fetchEmails(defaultStatus, chartId);
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
            await fetchEmails(defaultStatus, chartId);
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
            const response = await apiClient.get(`/mail/messages/${emailId}`);
            const messages: EmailMessage[] = handleApiResponse<EmailMessage[]>(response.data);

            setSelectedEmail(prevEmail =>
                prevEmail ? { ...prevEmail, messageList: messages } : null
            );
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        const hours = (`0${date.getHours()}`).slice(-2);
        const minutes = (`0${date.getMinutes()}`).slice(-2);
        const seconds = (`0${date.getSeconds()}`).slice(-2);
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const sendNewChatMessage = async (emailId: number, content: string) => {
        setLoading(true);
        setError(null);
        try {
            const message: Omit<EmailMessage, 'id' | 'messageId'> = {
                mailId: emailId,
                content,
                available: 'true',
                createId: 'currentUserId', // 替换为实际的用户 ID
                createDate: formatDate(new Date()),
                modifyId: 'currentUserId',
                modifyDate: formatDate(new Date()),
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
        charts, // 返回图表数据
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
        console.error("API Error Details:", data);  // 记录完整的错误信息
        throw new Error(data.message || 'API Error');
    }
}