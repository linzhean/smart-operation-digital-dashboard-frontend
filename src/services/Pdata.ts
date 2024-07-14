// src\services\Pdata.ts

import apiClient from './axiosConfig';

export const fetchUserData = async () => {
  const response = await apiClient.get('/user-account');
  return response.data;
};

export const updateUserData = async (userData: { userId: string; userName: string; departmentId: string; departmentName: string; googleId: string; gmail: string; identity: string; position: string; available: boolean; createId: string; createDate: string; modifyId: string; modifyDate: string; }) => {
  const response = await apiClient.patch('/user-account', userData);
  return response.data;
};
