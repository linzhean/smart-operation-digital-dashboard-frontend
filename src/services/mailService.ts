// src/services/mailService.ts

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
  firstMessage: {
    content: string;
  };
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

// 定义 Chart 类型
export interface Chart {
  id: number;
  name: string;
  description: string;
  // 其他字段根据实际的 API 响应定义
}

// 根据状态和可选的 chartId 获取邮件列表
export const getEmails = async (status: string, chartId?: number): Promise<Email[]> => {
  console.log("Fetching emails with status:", status, "and chartId:", chartId);
  const response = await apiClient.get('/mail', {
    params: { status, chartId } // 确保正确传递 chartId
  });
  return handleApiResponse<Email[]>(response.data);
};

// 获取指定状态的第一个邮件的 chartId
export const getChartIdFromEmails = async (status: string): Promise<number | null> => {
  try {
    const emails = await getEmails(status);
    if (emails.length > 0) {
      return emails[0].chartId;
    } else {
      console.warn('No emails found for the given status.');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving chartId from emails:', error);
    return null;
  }
};

// 根据 dashboardId 获取图表列表
export const getChartsByDashboardId = async (dashboardId: number): Promise<Chart[]> => {
  try {
    const response = await apiClient.get('/chart', { params: { dashboardId } });
    return handleApiResponse<Chart[]>(response.data);
  } catch (error) {
    console.error('Error fetching charts:', error);
    throw error;
  }
};

// 获取指定状态的图表
export const getChartsForStatus = async (status: string): Promise<Chart[] | null> => {
  try {
    const chartId = await getChartIdFromEmails(status);
    if (chartId !== null) {
      return await getChartsByDashboardId(chartId);
    } else {
      console.warn('No valid chartId found.');
      return null;
    }
  } catch (error) {
    console.error('Error getting charts for status:', error);
    return null;
  }
};

// 根据 ID 获取邮件详情
export const getEmailDetails = async (id: number): Promise<Email> => {
  const response = await apiClient.get(`/mail/${id}`);
  try {
    return handleApiResponse<Email>(response.data);
  } catch (error: any) {
    if (error.message.includes('查無此圖表')) {
      throw new Error('該郵件關聯的圖表不存在，請檢查後重試。');
    } else if (error.message.includes('Unknown')) {
      throw new Error('後端出現未知錯誤，請聯繫支持團隊。');
    }
    throw error;
  }
};

// 创建新邮件
export const createEmail = async (email: Partial<Email>): Promise<Email> => {
  const response = await apiClient.post('/mail', email);
  return handleApiResponse<Email>(response.data);
};

// 更新现有邮件
export const updateEmail = async (id: number, email: Partial<Email>): Promise<void> => {
  const response = await apiClient.patch(`/mail/${id}`, email);
  handleApiResponse<void>(response.data);
};

// 删除邮件
export const deleteEmail = async (id: number): Promise<void> => {
  const response = await apiClient.delete(`/mail/${id}`);
  handleApiResponse<void>(response.data);
};

// 发送聊天消息
export const sendChatMessage = async (mailId: number, message: Partial<EmailMessage>): Promise<EmailMessage> => {
  const response = await apiClient.post(`/mail/message`, message, {
    params: { mailId }
  });
  return handleApiResponse<EmailMessage>(response.data);
};

function handleApiResponse<T>(data: any): T {
  if (data.result) {
    return data.data as T;
  } else {
    console.error("API Error Details:", data);  // 记录完整的错误信息
    throw new Error(data.message || 'API Error');
  }
}
