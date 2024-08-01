import apiClient from './axiosConfig';
import { Response } from './types/Request.type';

export interface Email {
    id: number;
    assignedTaskId: number;
    chartId: number;
    name: string;
    status: string;
    publisher: string;
    receiver: string;
    emailSendTime: string;
    available: boolean;
    createId: string;
    createDate: string;
    modifyId: string;
    modifyDate: string;
    firstMessage: EmailMessage;
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

const handleApiResponse = <T>(response: Response<T>): T => {
    if (response.result) {
        return response.data as T;
    } else {
        throw new Error(response.message || 'API Error');
    }
};

// Get email list based on status
export const getEmails = async (statuses: string[]): Promise<Email[]> => {
    const statusValues = statuses.join(',');
    const response = await apiClient.get('/mail', { params: { status: statusValues } });
    return handleApiResponse<Email[]>(response.data);
};

// Get email details by ID
export const getEmailDetails = async (id: number): Promise<Email> => {
    const response = await apiClient.get(`/mail/${id}`);
    return handleApiResponse<Email>(response.data);
};

// Create a new email
export const createEmail = async (email: Omit<Email, 'id'>): Promise<void> => {
    const response = await apiClient.post('/mail', email);
    handleApiResponse<void>(response.data);
};

// Update an existing email
export const updateEmail = async (id: number, email: Partial<Omit<Email, 'id'>>): Promise<void> => {
    const response = await apiClient.patch(`/mail/${id}`, email);
    handleApiResponse<void>(response.data);
};

// Delete an email
export const deleteEmail = async (id: number): Promise<void> => {
    const response = await apiClient.delete(`/mail/${id}`);
    handleApiResponse<void>(response.data);
};

// Send a chat message
export const sendChatMessage = async (emailId: number, message: Omit<EmailMessage, 'id' | 'messageId'>): Promise<EmailMessage> => {
    const response = await apiClient.post('/mail/message', { ...message, mailId: emailId });
    return handleApiResponse<EmailMessage>(response.data);
};
