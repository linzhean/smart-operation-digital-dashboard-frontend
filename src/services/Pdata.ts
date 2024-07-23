import apiClient from './axiosConfig';
import { ApiUserData,UpdateUserData } from './types/userManagement';
import { Response } from './types/Request.type';

// 获取用户数据
export const fetchUserData = async (): Promise<UpdateUserData> => {
  try {
    const response = await apiClient.get<Response<ApiUserData>>('/user-account');
    const { result, errorCode, message, data } = response.data;

    if (result) {
      // 将 API 响应映射到 UpdateUserData
      return {
        userId: data?.id || '',
        userName: data?.name || '',
        departmentId: '', // 如果 API 未提供，可以设置默认值或留空
        departmentName: '',
        googleId: '',
        gmail: '',
        identity: 'NO_PERMISSION', // 设置默认值或根据需要映射
        position: '', // 设置默认值或根据需要映射
        available: false, // 设置默认值或根据需要映射
        createId: '',
        createDate: '',
        modifyId: '',
        modifyDate: ''
      };
    } else {
      throw new Error(`错误代码: ${errorCode}, 消息: ${message}`);
    }
  } catch (error) {
    console.error('获取用户数据时出错：', error);
    throw new Error('无法获取用户数据，请稍后再试。');
  }
};

// 更新用户数据
export const updateUserData = async (userData: UpdateUserData): Promise<void> => {
  try {
    const response = await apiClient.patch<Response<void>>('/user-account', userData);
    const { result, errorCode, message } = response.data;

    if (result) {
      return;
    } else {
      throw new Error(`错误代码: ${errorCode}, 消息: ${message}`);
    }
  } catch (error) {
    console.error('更新用户数据时出错：', error);
    throw new Error('无法更新用户数据，请稍后再试。');
  }
};
