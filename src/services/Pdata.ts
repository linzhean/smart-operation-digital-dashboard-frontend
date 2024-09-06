//src\services\Pdata.ts
import apiClient from './axiosConfig';
import { ApiUserData, UpdateUserData } from './types/userManagement';
import { Response } from './types/Request.type';

// 获取用户数据
export const fetchUserData = async (): Promise<UpdateUserData> => {
  try {
    const response = await apiClient.get<Response<ApiUserData>>('/user-account');
    const { result, errorCode, message, data } = response.data;

    if (result) {
      return {
        userId: data?.id || '',
        userName: data?.name || '',
        departmentId: '',
        departmentName: '',
        googleId: '',
        gmail: '',
        identity: '',
        position: '',
        available: false,
        createId: '',
        createDate: '',
        modifyId: '',
        modifyDate: '',
        jobNumber: data?.jobNumber || '',  // Add this line
      };
    } else {
      console.error('获取用户数据失败:', message);
      throw new Error(`获取用户数据失败: ${message}`);
    }
  } catch (error) {
    console.error('获取用户数据时发生错误:', error);
    throw error;
  }
};


// 更新用户数据
export const updateUserData = async (updatedData: UpdateUserData): Promise<void> => {
  try {
    const { available, googleId, createId, createDate, modifyId, modifyDate, identity,gmail, ...filteredData } = updatedData;

    // 这里保留 userId，并确保 PATCH 请求发送 userId
    const response = await apiClient.patch<Response<null>>('/user-account', { ...filteredData, userId: updatedData.userId });
    const { result, message } = response.data;

    if (!result) {
      throw new Error(`更新用户数据失败: ${message}`);
    }
  } catch (error) {
    throw error;
  }
};
