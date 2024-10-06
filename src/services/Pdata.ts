//src\services\Pdata.ts
import apiClient from './axiosConfig';
import { ApiUserData, UpdateUserData } from './types/userManagement';
import { Response } from './types/Request.type';

// 获取用户数据
// 確保 userId 被傳遞到更新的資料裡
export const fetchUserData = async (): Promise<UpdateUserData> => {
  try {
    const userResponse = await apiClient.get<Response<ApiUserData>>('/user-account');
    const { result: userResult, data: userData } = userResponse.data;

    if (!userResult || !userData?.id) {
      throw new Error('獲取用戶資料失敗: 無法獲取用戶 ID');
    }

    const detailedResponse = await apiClient.get<Response<ApiUserData>>(`/user-account/${userData.id}`);
    const { result: detailedResult, data: detailedData } = detailedResponse.data;

    if (!detailedResult || !detailedData) {
      throw new Error('獲取用戶詳細失敗');
    }

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
      jobNumber: detailedData.jobNumber || '',
    };
  } catch (error) {
    console.error('獲取用戶資料時發生錯誤:', error);
    throw error;
  }
};


// 更新用户数据
export const updateUserData = async (updatedData: UpdateUserData): Promise<void> => {
  try {
    const { available, googleId, createId, createDate, modifyId, modifyDate, identity,gmail, ...filteredData } = updatedData;

    // 这里保留 userId，并确保 PATCH 请求发送 userId
    const response = await apiClient.patch<Response<null>>('/user-account', { 
      ...filteredData, 
      userId: updatedData.userId   // 確保這裡的 userId 是正確傳遞的
    });
    
    const { result, message } = response.data;

    if (!result) {
      throw new Error(`更新用户数据失败: ${message}`);
    }
  } catch (error) {
    throw error;
  }
};
