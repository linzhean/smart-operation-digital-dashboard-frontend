//src\services\Pdata.ts
import apiClient from './axiosConfig';
import { ApiUserData, UpdateUserData } from './types/userManagement';
import { Response } from './types/Request.type';

// 获取用户数据
export const fetchUserData = async (): Promise<UpdateUserData> => {
  try {
    // 第一次请求 /user-account 获取基本数据
    const userResponse = await apiClient.get<Response<ApiUserData>>('/user-account');
    const { result: userResult, data: userData } = userResponse.data;

    if (!userResult || !userData?.id) {
      throw new Error('获取用户数据失败: 无法获取用户 ID');
    }

    // 第二次请求 /user-account/{userId} 获取详细数据
    const detailedResponse = await apiClient.get<Response<ApiUserData>>(`/user-account/${userData.id}`);
    const { result: detailedResult, data: detailedData } = detailedResponse.data;

    if (!detailedResult || !detailedData) {
      throw new Error('获取用户详情失败');
    }

    // 返回获取的用户详情数据
    return {
      userId: detailedData.id || '',
      userName: detailedData.name || '',
      departmentId: detailedData.departmentId || '',
      departmentName: detailedData.departmentName || '',
      googleId: detailedData.googleId || '',
      gmail: detailedData.gmail || '',
      identity: detailedData.identity || '',
      position: detailedData.position || '',
      available: detailedData.available || false,
      createId: detailedData.createId || '',
      createDate: detailedData.createDate || '',
      modifyId: detailedData.modifyId || '',
      modifyDate: detailedData.modifyDate || '',
      jobNumber: detailedData.jobNumber || '',  // 确保从详细数据中获取 jobNumber
    };
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
