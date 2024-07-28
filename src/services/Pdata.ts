import apiClient from './axiosConfig';
import { ApiUserData, UpdateUserData } from './types/userManagement';
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
        available: false, // 默认值
        createId: '',
        createDate: '',
        modifyId: '',
        modifyDate: ''
      };
    } else {
      console.error('获取用户数据失败:', message);
      throw new Error(`获取用户数据失败: ${message}`);
    }
  } catch (error) {
    console.error('获取用户数据时发生错误:', error);
    throw new Error('获取用户数据时发生错误');
  }
};

// 更新用户数据
export const updateUserData = async (userData: UpdateUserData): Promise<void> => {
  try {
    const response = await apiClient.patch<Response<null>>('/user-account', userData);
    const { result, errorCode, message } = response.data;

    if (!result) {
      console.error('更新用户数据失败:', message);
      throw new Error(`更新用户数据失败: ${message}`);
    }
  } catch (error) {
    console.error('更新用户数据时发生错误:', error);
    throw new Error('更新用户数据时发生错误');
  }
};

