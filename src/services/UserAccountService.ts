
import apiClient from './axiosConfig';
import { Response } from './types/Request.type';
import { UserAccountBean } from './types/userManagement';

// 获取用户列表
export const fetchUsers = async (
  nowPage: number = 1,
  departmentId?: string,
  name?: string,
  identity?: string
): Promise<UserAccountBean[]> => {
  try {
    const response = await apiClient.get<Response<UserAccountBean[]>>('/user-account/list', {
      params: {
        nowPage,
        departmentId,
        name,
        identity
      }
    });

    console.log('API Response:', response.data);

    if (response.data && response.data.result && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      throw new Error('API response format is incorrect');
    }
  } catch (error: any) {
    console.error('Error fetching users:', error);
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

export const admitUser = async (userId: string): Promise<void> => {
  try {
    await apiClient.patch<Response<void>>(`/user-account/admit?userId=${userId}&identity=NO_PERMISSION`);
  } catch (error: any) {
    throw new Error(`Error admitting user: ${error.message}`);
  }
};

export const removeUser = async (userId: string): Promise<void> => {
  try {
    await apiClient.patch<Response<void>>(`/user-account/able?userId=${userId}`);
  } catch (error: any) {
    throw new Error(`Error removing user: ${error.message}`);
  }
};

export const toggleUserStatus = async (userId: string): Promise<any> => {
  try {
    const response = await apiClient.patch<Response<any>>(`/user-account/able?userId=${userId}`);
    return response.data.message;
  } catch (error: any) {
    throw new Error(`切换用户状态时出错：${error.message}`);
  }
};