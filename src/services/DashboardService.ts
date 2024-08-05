// src/services/DashboardService.ts

import axiosInstance from './axiosConfig';
import { Dashboard } from './types/dashboard';

const DashboardService = {
  getAllDashboards: async (): Promise<Dashboard[]> => {
    const response = await axiosInstance.get('/dashboard');
    return response.data.data; // 確保返回 data 字段
  },

  getDashboardById: async (id: string): Promise<Dashboard> => {
    const response = await axiosInstance.get(`/dashboard/${id}`);
    return response.data.data; // 提取 response.data.data
  },

  createDashboard: async (dashboardData: any): Promise<Dashboard> => {
    const response = await axiosInstance.post('/dashboard', dashboardData);
    return response.data.data; // 提取 response.data.data
  },

  updateDashboard: async (id: string, dashboardData: any): Promise<Dashboard> => {
    const response = await axiosInstance.put(`/dashboard/${id}`, dashboardData);
    return response.data.data; // 提取 response.data.data
  },

  patchDashboard: async (id: string, dashboardData: any): Promise<Dashboard> => {
    const response = await axiosInstance.patch(`/dashboard/${id}`, dashboardData);
    return response.data.data; // 提取 response.data.data
  },

  deleteDashboard: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/dashboard/${id}`);
  },
};

export default DashboardService;
