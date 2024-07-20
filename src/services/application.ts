import apiClient from './axiosConfig';
import { Response } from './types/Request.type';
import { ApplicationData } from './types/userManagement';

// Define your API endpoints
const APPLICATION_API_BASE = '/application';

export const getApplications = async (status: string, nowPage: number, startDate?: string, endDate?: string): Promise<Response<ApplicationData[]>> => {
    try {
      const response = await apiClient.get(`${APPLICATION_API_BASE}`, {
        params: { status, nowPage, startDate, endDate },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch applications');
    }
  };  

export const createApplication = async (applicationData: Partial<ApplicationData>): Promise<Response<ApplicationData>> => {
  try {
    const response = await apiClient.post(`${APPLICATION_API_BASE}`, applicationData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create application');
  }
};

export const updateApplication = async (id: number, applicationData: Partial<ApplicationData>): Promise<Response<ApplicationData>> => {
  try {
    const response = await apiClient.patch(`${APPLICATION_API_BASE}/permit/${id}`, applicationData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update application');
  }
};

export const deleteApplication = async (id: number): Promise<Response<string>> => {
  try {
    const response = await apiClient.delete(`${APPLICATION_API_BASE}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to delete application');
  }
};
