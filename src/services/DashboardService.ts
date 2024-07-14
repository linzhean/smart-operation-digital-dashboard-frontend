// src/services/DashboardService.ts

import axiosInstance from './axiosConfig';
import { Dashboard } from './types/dashboard'; // Import the Dashboard interface

const DashboardService = {
  getAllDashboards: async (): Promise<Dashboard[]> => {
    const response = await axiosInstance.get('/dashboard/all');
    return response.data || [];
  },

  getDashboardById: async (id: string): Promise<Dashboard> => {
    const response = await axiosInstance.get(`/dashboard/${id}`);
    return response.data;
  },

  getAvailableDashboards: async (): Promise<Dashboard[]> => {
    const response = await axiosInstance.get('/dashboard/available');
    return response.data;
  },

  createDashboard: async (dashboardData: any): Promise<Dashboard> => {
    const response = await axiosInstance.post('/dashboard', dashboardData);
    return response.data;
  },

  updateDashboard: async (id: string, dashboardData: any): Promise<Dashboard> => {
    const response = await axiosInstance.put(`/dashboard/${id}`, dashboardData);
    return response.data;
  },

  deleteDashboard: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/dashboard/${id}`);
  },
};

export default DashboardService;
