//src\services\AssignedTaskService.ts
import apiClient from './axiosConfig';
import { Response } from './types/Request.type';

export interface AssignedTask {
  id?: number;
  chartId: number;
  name: string;
  defaultProcessor: string;
  available: boolean;
  upperLimit?: number;  // New
  lowerLimit?: number;  // New
  createId?: string;
  createDate?: string;
  modifyId?: string;
  modifyDate?: string;
}

export interface GetAssignedTaskSponsorsResponse {
  [x: string]: any;
  sponsorList: string[];
}

// Create a new assigned task (仪表板页面用)
export const createAssignedTaskForDashboard = async (assignedTask: AssignedTask): Promise<Response<AssignedTask>> => {
  try {
    const response = await apiClient.post<Response<AssignedTask>>('/assigned-task/sponsor', assignedTask);
    return response.data;
  } catch (error) {
    console.error('Error creating assigned task', error);
    throw error;
  }
};

// Get assigned task sponsors by chart ID (仪表板页面用)
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

// Set assigned task sponsors for a specific chart ID (仪表板页面用)
export const setAssignedTaskSponsorsForDashboard = async (
  chartId: number, // Added chartId as a parameter
  data: { sponsorList: string[]; exporterList: string[]; dashboardCharts: number[] }
): Promise<Response<string>> => {
  try {
    // Log the data being sent to the backend to verify it
    console.log("Request data:", data);

    const response = await apiClient.post<Response<string>>('/assigned-task/sponsor', data, {
      params: { chartId } // Send chartId as a query parameter
    });
    return response.data;
  } catch (error) {
    console.error('Error setting assigned task sponsors', error);
    throw error;
  }
};


// Delete an assigned task by ID (仪表板页面用)
export const deleteAssignedTaskForDashboard = async (id: number): Promise<Response<string>> => {
  try {
    const response = await apiClient.delete<Response<string>>(`/assigned-task/sponsor/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting assigned task', error);
    throw error;
  }
};

// Update an existing assigned task by ID (仪表板页面用)
export const updateAssignedTaskForDashboard = async (id: number, assignedTask: AssignedTask): Promise<Response<AssignedTask>> => {
  try {
    const response = await apiClient.patch<Response<AssignedTask>>(`/assigned-task/${id}`, assignedTask);
    return response.data;
  } catch (error) {
    console.error('Error updating assigned task', error);
    throw error;
  }
};

// Get all assigned tasks (AssignTaskControl 后台用)
export const getAllAssignedTasks = async (chartId?: number): Promise<Response<AssignedTask[]>> => {
  try {
    const response = await apiClient.get<Response<AssignedTask[]>>('/assigned-task');
    return response.data;
  } catch (error) {
    console.error('Error fetching all assigned tasks', error);
    throw error;
  }
};

// 创建新交办任务
export const createAssignedTask = async (taskData: AssignedTask): Promise<Response<AssignedTask>> => {
  try {
    const { available, ...filteredTaskData } = taskData; // 濾除不需要的字段

    const response = await apiClient.post<Response<AssignedTask>>('/assigned-task', {
      ...filteredTaskData,
      upperLimit: taskData.upperLimit,
      lowerLimit: taskData.lowerLimit,
    });
    return response.data;  // 确保符合 Response<AssignedTask> 结构
  } catch (error) {
    console.error('Error creating assigned task', error);
    throw error;
  }
};

// 更新现有交办任务
export const updateAssignedTask = async (id: number, taskData: AssignedTask): Promise<Response<AssignedTask>> => {
  try {
    const response = await apiClient.patch<Response<AssignedTask>>(`/assigned-task/${id}`, {
      ...taskData,
      upperLimit: taskData.upperLimit,
      lowerLimit: taskData.lowerLimit,
    });
    return response.data;  // 确保符合 Response<AssignedTask> 结构
  } catch (error) {
    console.error('Error updating assigned task', error);
    throw error;
  }
};

// Fetch all charts
export const fetchAllCharts = async (): Promise<Response<any>> => {
  try {
    const response = await apiClient.get<Response<any>>('/chart/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all charts', error);
    throw error;
  }
};
