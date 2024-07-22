import apiClient from './axiosConfig';
import { Response } from './types/Request.type';

export interface Email {
    id: number;
    subject: string;
    body: string;
    assignedTaskId: number;
    chartId: number;
    name: string;
    status: string;
    content: string;
    publisher: string;
    receiver: string;
    emailSendTime: string;
    available: boolean;
    createId: string;
    createDate: string;
    modifyId: string;
    modifyDate: string;
    messageList: EmailMessage[];
}

export interface EmailMessage {
    id: number;
    mailId: number;
    messageId: number;
    content: string;
    available: string;
    createId: string;
    createDate: string;
    modifyId: string;
    modifyDate: string;
}

const statusMapping: Record<string, string> = {
    "交辦": "0",
    "被交辦": "1",
    "待處理": "2",
    "已完成": "3",
};

// Helper function for the response structure
const handleApiResponse = <T>(response: Response<T>): T => {
    if (response.result) {
        return response.data as T;
    } else {
        throw new Error(response.message || 'API Error');
    }
};

// API requests
export const getEmails = async (statuses: string[]): Promise<Email[]> => {
    const statusValues = statuses.map(st => statusMapping[st] || st).join(',');
    const response = await apiClient.get(`/mail`, { params: { status: statusValues } });
    return handleApiResponse<Email[]>(response.data);
};

export const getEmailDetails = async (id: number): Promise<Email> => {
    const response = await apiClient.get(`/mail/${id}`);
    return handleApiResponse<Email>(response.data);
};

export const createEmail = async (email: Omit<Email, 'id'>): Promise<void> => {
    const response = await apiClient.post('/mail', email);
    handleApiResponse<void>(response.data);
};

export const updateEmail = async (id: number, email: Partial<Omit<Email, 'id'>>): Promise<void> => {
    const response = await apiClient.patch(`/mail/${id}`, email);
    handleApiResponse<void>(response.data);
};

export const deleteEmail = async (id: number): Promise<void> => {
    const response = await apiClient.delete(`/mail/${id}`);
    handleApiResponse<void>(response.data);
};

export const sendEmail = async (email: Email): Promise<void> => {
    const response = await apiClient.post('/mail/send', email);
    handleApiResponse<void>(response.data);
};

export const getChatMessages = async (emailId: number): Promise<EmailMessage[]> => {
    const response = await apiClient.get(`/mail/${emailId}/messages`);
    return handleApiResponse<EmailMessage[]>(response.data);
};

export const sendChatMessage = async (emailId: number, message: Omit<EmailMessage, 'id' | 'messageId'>, content?: string): Promise<EmailMessage> => {
    const response = await apiClient.post(`/mail/${emailId}/messages`, message);
    return handleApiResponse<EmailMessage>(response.data);
};
