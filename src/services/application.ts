//src\services\application.ts
import apiClient from './axiosConfig';
import { Response } from './types/Request.type';
import { ApplicationData } from './types/userManagement';

// Define your API endpoints
const APPLICATION_API_BASE = '/application';

// Get applications with optional filters
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

// Create a new application
export const createApplication = async (
  applicationData: Partial<ApplicationData>,
  params?: { [key: string]: any } // Make params optional
): Promise<Response<ApplicationData>> => {
  try {
    const response = await apiClient.post<Response<ApplicationData>>(`${APPLICATION_API_BASE}`, applicationData, {
      params, // Include URL parameters if provided
    });
    return response.data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to create application: ${errorMsg}`);
  }
};

// Update an existing application
export const updateApplication = async (
  id: number,
  applicationData: Partial<ApplicationData>,
  params?: { [key: string]: any } // Added optional params
): Promise<Response<ApplicationData>> => {
  try {
    const response = await apiClient.patch<Response<ApplicationData>>(`${APPLICATION_API_BASE}/permit/${id}`, applicationData, {
      params, // Include URL parameters if needed
    });
    return response.data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to update application: ${errorMsg}`);
  }
};

// Delete an application
export const deleteApplication = async (
  id: number,
  params?: { [key: string]: any } // Added optional params
): Promise<Response<string>> => {
  try {
    const response = await apiClient.delete<Response<string>>(`${APPLICATION_API_BASE}/${id}`, {
      params, // Include URL parameters if needed
    });
    return response.data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to delete application: ${errorMsg}`);
  }
};
