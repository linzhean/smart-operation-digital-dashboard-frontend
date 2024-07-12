import apiClient from './axiosConfig';
import { Response } from './types/Request.type';

export interface Email {
    id: number;
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

// Helper function for the response structure
const handleApiResponse = <T>(response: Response<T>): T => {
    if (response.result) {
        return response.data as T;
    } else {
        throw new Error(response.message || 'API Error');
    }
};

// API requests
export const getEmails = async (status: string): Promise<Email[]> => {
    const response = await apiClient.get(`/mail`, { params: { status } });
    return handleApiResponse<Email[]>(response.data);
};

export const getEmailDetails = async (id: number): Promise<Email> => {
    const response = await apiClient.get(`/mail/${id}`);
    return handleApiResponse<Email>(response.data);
};

export const createEmail = async (email: Email): Promise<void> => {
    const response = await apiClient.post('/mail', email);
    handleApiResponse<void>(response.data);
};

export const updateEmail = async (id: number, email: Email): Promise<void> => {
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

export const sendChatMessage = async (emailId: number, message: EmailMessage, newMessage: string): Promise<EmailMessage> => {
    const response = await apiClient.post('/mail/message', message);
    return handleApiResponse<EmailMessage>(response.data);
};