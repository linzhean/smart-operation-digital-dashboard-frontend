import apiClient from './axiosConfig';
import { Response } from './types/Request.type';
import { ApplicationData } from './types/userManagement';

const APPLICATION_API_BASE = '/application';

// 获取申请列表
export const getApplications = async (
  status: string,
  nowPage: number,
  startDate?: string,
  endDate?: string
): Promise<Response<ApplicationData[]>> => {
  try {
    const response = await apiClient.get<Response<ApplicationData[]>>(`${APPLICATION_API_BASE}`, {
      params: { status, nowPage, startDate, endDate },
    });
    return response.data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to fetch applications: ${errorMsg}`);
  }
};

// 创建申请
export const createApplication = async (
  applicationData: Partial<ApplicationData>
): Promise<Response<ApplicationData>> => {
  try {
    const response = await apiClient.post<Response<ApplicationData>>(`${APPLICATION_API_BASE}`, applicationData);
    return response.data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to create application: ${errorMsg}`);
  }
};

// 更新申请状态
export const updateApplication = async (
  id: number,
  applicationData: Partial<ApplicationData>,
  groupId: number
): Promise<Response<ApplicationData>> => {
  try {
    const response = await apiClient.patch<Response<ApplicationData>>(`${APPLICATION_API_BASE}/permit/${id}`, applicationData, {
      params: { groupId,id },
    });
    return response.data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to update application: ${errorMsg}`);
  }
};

// 关闭申请
export const closeApplication = async (
  id: number,
): Promise<Response<string>> => {
  try {
    const response = await apiClient.patch<Response<string>>(`${APPLICATION_API_BASE}/close/${id}`, undefined, {
      params: { id },
    });
    return response.data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to close application: ${errorMsg}`);
  }
};

// 删除申请
export const deleteApplication = async (
  id: number,

): Promise<Response<string>> => {
  try {
    const response = await apiClient.delete<Response<string>>(`${APPLICATION_API_BASE}/${id}`, {
      params: { id },
    });
    return response.data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to delete application: ${errorMsg}`);
  }
};