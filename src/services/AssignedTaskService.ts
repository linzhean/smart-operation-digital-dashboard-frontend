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

export interface GetAssignedTaskSponsorsResponse {
  sponsorList: string[];
}

// Create a new assigned task
export const createAssignedTask = async (assignedTask: AssignedTask): Promise<Response<AssignedTask>> => {
  try {
    const response = await apiClient.post<Response<AssignedTask>>('/assigned-task', assignedTask);
    return response.data;
  } catch (error) {
    // Handle error appropriately
    console.error('Error creating assigned task', error);
    throw error;
  }
};

// Get assigned task sponsors by chart ID
export const getAssignedTaskSponsors = async (chartId: number): Promise<Response<GetAssignedTaskSponsorsResponse>> => {
  try {
    const response = await apiClient.get<Response<GetAssignedTaskSponsorsResponse>>('/assigned-task/sponsor', {
      params: { chartId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching assigned task sponsors', error);
    throw error;
  }
};

// Set assigned task sponsors for a specific chart ID
export const setAssignedTaskSponsors = async (
  chartId: number,
  data: { sponsorList: string[], exporterList: string[], dashboardCharts: number[] }
): Promise<Response<string>> => {
  try {
    const response = await apiClient.post<Response<string>>('/assigned-task/sponsor', data, {
      params: { chartId },
    });
    return response.data;
  } catch (error) {
    // Handle error appropriately
    console.error('Error setting assigned task sponsors', error);
    throw error;
  }
};

// Delete an assigned task by ID
export const deleteAssignedTask = async (id: number): Promise<Response<string>> => {
  try {
    const response = await apiClient.delete<Response<string>>(`/assigned-task/${id}`);
    return response.data;
  } catch (error) {
    // Handle error appropriately
    console.error('Error deleting assigned task', error);
    throw error;
  }
};

// Update an existing assigned task by ID
export const updateAssignedTask = async (id: number, assignedTask: AssignedTask): Promise<Response<AssignedTask>> => {
  try {
    const response = await apiClient.patch<Response<AssignedTask>>(`/assigned-task/${id}`, assignedTask);
    return response.data;
  } catch (error) {
    // Handle error appropriately
    console.error('Error updating assigned task', error);
    throw error;
  }
};

// Get all assigned tasks
export const getAllAssignedTasks = async (): Promise<Response<AssignedTask[]>> => {
  try {
    const response = await apiClient.get<Response<AssignedTask[]>>('/assigned-task');
    return response.data;
  } catch (error) {
    // Handle error appropriately
    console.error('Error fetching all assigned tasks', error);
    throw error;
  }
};

// Fetch all charts
export const fetchAllCharts = async (): Promise<Response<any>> => {
  try {
    const response = await apiClient.get<Response<any>>('/chart/all');
    return response.data;
  } catch (error) {
    // Handle error appropriately
    console.error('Error fetching all charts', error);
    throw error;
  }
};
