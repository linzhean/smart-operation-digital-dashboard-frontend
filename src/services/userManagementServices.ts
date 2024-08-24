import apiClient from './axiosConfig';
import { Response } from './types/Request.type';
import { UpdateUserData, User, UserData } from './types/userManagement';

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<Response<User[]>>('/user-account');
    if (response.data.result && response.data.data) {
      return response.data.data;
    } else {
      throw new Error('获取用户信息失败: ' + response.data.message);
    }
  } catch (error: any) {
    console.error('获取用户信息失败: ', error.message);
    throw new Error('获取用户信息失败: ' + error.message);
  }
};

export const getUserList = async (
  departmentId?: string,
  name?: string,
  identity?: string,
  nowPage?: number
): Promise<User[]> => {
  try {
    const params: { [key: string]: any } = {};
    if (departmentId) params.departmentId = departmentId;
    if (name) params.name = name;
    if (identity) params.identity = identity;
    if (nowPage !== undefined) params.nowPage = nowPage;

    const response = await apiClient.get<Response<User[]>>('/user-account/list', { params });
    if (response.data.result && response.data.data) {
      return response.data.data;
    } else {
      throw new Error('Failed to get user list: ' + response.data.message);
    }
  } catch (error: any) {
    console.error('Failed to get user list: ', error.message);
    throw new Error('Failed to get user list: ' + error.message);
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get('/user-account/all');
    if (response.data.result && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch users');
    }
  } catch (error: any) {
    console.error('Unable to fetch users:', error.message);
    throw error;
  }
};

export const getUserDetails = async (userId: number): Promise<User> => {
  try {
    const response = await apiClient.get<Response<User>>(`/user-account/${userId}`);
    if (response.data.result && response.data.data !== undefined) {
      return response.data.data;
    } else {
      throw new Error(`未找到用户 ${userId} 的详细信息: ${response.data.message}`);
    }
  } catch (error: any) {
    console.error(`获取用户 ${userId} 的详细信息失败: `, error.message);
    throw new Error(`获取用户 ${userId} 的详细信息失败: ` + error.message);
  }
};

export const updateUser = async (jobNumber: string, userData: UserData): Promise<void> => {
  const { userName, departmentId, departmentName, position } = userData;

  try {
    const response = await apiClient.patch<Response<void>>('/user-account', {
      userId: jobNumber,  // 使用 jobNumber 作为 userId
      userName,
      departmentId,
      departmentName,
      position
    });
    if (!response.data.result) {
      console.error('Update failed:', response.data.message);
      throw new Error('更新用户失败: ' + response.data.message);
    }
  } catch (error: any) {
    console.error('更新用户失败: ', error.message);
    throw new Error('更新用户失败: ' + error.message);
  }
};

export const deleteUser = async (userId: number): Promise<void> => {
  try {
    const response = await apiClient.delete<Response<void>>(`/user-account/${userId}`);
    if (!response.data.result) {
      throw new Error('删除用户失败: ' + response.data.message);
    }
  } catch (error: any) {
    console.error('删除用户失败: ', error.message);
    throw new Error('删除用户失败: ' + error.message);
  }
};

export const admitUser = async (userId: number): Promise<void> => {
  try {
    const response = await apiClient.patch<Response<void>>(`/user-account/admit`, { userId });
    if (!response.data.result) {
      throw new Error('批准用户失败: ' + response.data.message);
    }
  } catch (error: any) {
    console.error('批准用户失败: ', error.message);
    throw new Error('批准用户失败: ' + error.message);
  }
};

export const toggleUserAvailability = async (userId: number, available: boolean): Promise<void> => {
  try {
    const response = await apiClient.patch<Response<void>>(`/user-account/able`, { userId, available });
    if (!response.data.result) {
      throw new Error('Failed to toggle user availability: ' + response.data.message);
    }
  } catch (error: any) {
    console.error('Failed to toggle user availability: ', error.message);
    throw new Error('Failed to toggle user availability: ' + error.message);
  }
};
