import apiClient from './axiosConfig';
import { UpdateUserData } from './types/userManagement';

export const fetchUserData = async () => {
  const response = await apiClient.get('/user-account');
  return response.data;
};

export const updateUserData = async (userData: UpdateUserData) => {
  const response = await apiClient.patch('/user-account', userData);
  return response.data;
};
