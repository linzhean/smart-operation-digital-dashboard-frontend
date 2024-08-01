//src\services\AssignedTaskService.ts
import apiClient from './axiosConfig';
import { Response } from './types/Request.type';

export interface AssignedTask {
  id?: number;
  chartId: number;
  name: string;
  defaultProcessor: string;
  available: boolean;
  createId?: string;
  createDate?: string;
  modifyId?: string;
  modifyDate?: string;
}

export const createAssignedTask = async (assignedTask: AssignedTask): Promise<Response<AssignedTask>> => {
  const response = await apiClient.post<Response<AssignedTask>>('/assigned-task', assignedTask);
  return response.data;
};

export const getAssignedTaskSponsors = async (chartId: number): Promise<Response<string[]>> => {
  const response = await apiClient.get<Response<string[]>>('/assigned-task/sponsor', {
    params: { chartId },
  });
  return response.data;
};

export const setAssignedTaskSponsors = async (chartId: number, data: {sponsorList: string[], exporterList: string[], dashboardCharts: number[]}): Promise<Response<string>> => {
  const response = await apiClient.post<Response<string>>('/assigned-task/sponsor', data, {
    params: { chartId },
  });
  return response.data;
};

export const deleteAssignedTask = async (id: number): Promise<Response<string>> => {
  const response = await apiClient.delete<Response<string>>(`/assigned-task/${id}`);
  return response.data;
};

export const updateAssignedTask = async (id: number, assignedTask: AssignedTask): Promise<Response<AssignedTask>> => {
  const response = await apiClient.patch<Response<AssignedTask>>(`/assigned-task/${id}`, assignedTask);
  return response.data;
};

export const getAllAssignedTasks = async (): Promise<Response<AssignedTask[]>> => {
  const response = await apiClient.get<Response<AssignedTask[]>>('/assigned-task');
  return response.data;
};
