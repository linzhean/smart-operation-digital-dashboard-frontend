// src\services\UserAccountService.ts

import apiClient from './axiosConfig';
import { Response } from './types/Request.type';
import { EmployeeData } from './types/userManagement';

export const fetchUsers = async (): Promise<EmployeeData[]> => {
  try {
    const response = await apiClient.get<Response<EmployeeData[]>>('/user-account');
    return response.data.data ?? [];
  } catch (error: any) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

export const updateUser = async (userId: string, userData: any): Promise<any> => {
  try {
    const response = await apiClient.patch<Response<any>>(`/user-account`, { ...userData, userId });
    return response.data.message;
  } catch (error: any) {
    throw new Error(`Error updating user: ${error.message}`);
  }
};

export const admitUser = async (userId: string): Promise<any> => {
  try {
    const response = await apiClient.patch<Response<any>>(`/user-account/admit?userId=${userId}&identity=NO_PERMISSION`);
    return response.data.message;
  } catch (error: any) {
    throw new Error(`Error admitting user: ${error.message}`);
  }
};

export const toggleUserStatus = async (userId: string): Promise<any> => {
  try {
    const response = await apiClient.patch<Response<any>>(`/user-account/able`, { userId });
    return response.data.message;
  } catch (error: any) {
    throw new Error(`Error toggling user status: ${error.message}`);
  }
};
