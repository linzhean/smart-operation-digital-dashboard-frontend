import { User, Group } from './types/userManagement';
import { Response } from './types/Request.type';
import apiClient from './axiosConfig';

export const getGroups = async (): Promise<Group[]> => {
  try {
    const response = await apiClient.get<Response<Group[]>>('/group');
    return response.data.data || [];
  } catch (error: any) {
    throw new Error('Failed to fetch groups: ' + error.message);
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<Response<User[]>>('/user-account');
    return response.data.data || [];
  } catch (error: any) {
    throw new Error('無法獲取用戶: ' + error.message);
  }
};

export const addUser = async (user: User): Promise<void> => {
  try {
    await apiClient.post<Response<void>>('/user-account', user);
  } catch (error: any) {
    throw new Error('Failed to add user: ' + error.message);
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    await apiClient.delete<Response<void>>(`/user-account/${userId}`);
  } catch (error: any) {
    throw new Error('Failed to delete user: ' + error.message);
  }
};

export const admitUser = async (userId: string): Promise<void> => {
  try {
    await apiClient.patch<Response<void>>(`/user-account/${userId}`);
  } catch (error: any) {
    throw new Error('Failed to admit user: ' + error.message);
  }
};

export type { User };
   