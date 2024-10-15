// src/services/mailService.ts
import apiClient from './axiosConfig';
import { Response } from './types/Request.type';

export interface Email {
  id: number; // Add this line
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
  firstMessage: {
    content: string;
  };
  messageList: EmailMessage[];
  message?: string;
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
    console.error('API Error:', response.message || 'Unknown error');
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
export const createEmail = async (email: {
  chartId: number;
  name: string;
  receiver: string;
  firstMessage: {
    content: string;
  };
}): Promise<Email> => {
  const response = await apiClient.post('/mail', email);
  return handleApiResponse<Email>(response.data); 
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
export const sendChatMessage = async (emailId: number, message: {
  mailId?: number; // Mark as optional
  messageId: number | null; // Allow messageId to be null for new messages
  content: string;
  available: string;
  createId: string;
  createDate: string;
  modifyId: string;
  modifyDate: string;
}): Promise<EmailMessage> => {
  // Create a request body with optional mailId
  const requestBody: {
    mailId?: number;
    messageId: number | null;
    content: string;
    available: string;
    createId: string;
    createDate: string;
    modifyId: string;
    modifyDate: string;
  } = {
    messageId: message.messageId,
    content: message.content,
    available: message.available,
    createId: message.createId,
    createDate: message.createDate,
    modifyId: message.modifyId,
    modifyDate: message.modifyDate,
  };

  if (message.mailId !== undefined) { // Only include mailId if it's defined
    requestBody.mailId = message.mailId;
  }

  try {
    const response = await apiClient.post('/mail/message', requestBody, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        mailId: message.mailId // Ensure mailId is passed as a query parameter if needed
      }
    });
    return handleApiResponse<EmailMessage>(response.data);
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

export const sendMessage = async (emailId: number, message: {
  mailId?: number;
  messageId: number | null;
  content: string;
  available: string;
  createId: string;
  createDate: string;
  modifyId: string;
  modifyDate: string;
}): Promise<EmailMessage> => {
  const requestBody: {
    messageId: number | null;
    content: string;
  } = {
    messageId: message.messageId,
    content: message.content,
  };

  try {
    const response = await apiClient.post('/mail/message', requestBody, {
      headers: {
        'Content-Type': 'application/json'
      },
      params: {
        mailId: message.mailId // Ensure mailId is passed as a query parameter
      }
    });
    return handleApiResponse<EmailMessage>(response.data);
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateEmailStatus = async (id: number, status: number): Promise<void> => {
  try {
    const response = await apiClient.patch(`/mail/message/status/${id}`, null, {
      params: { status },
    });
    handleApiResponse<void>(response.data);
  } catch (error: any) {
    console.error(`Failed to update email status: ${error.response?.data || error.message}`);
    throw error;
  }
};
