import apiClient from './axiosConfig';
import { Response } from './types/Request.type';
import { User, UpdateUserData } from './types/userManagement';

// 获取用户列表
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

// 获取用户列表（另一种方式，假设 /user-account/list 是正确的）
export const getUserList = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<Response<User[]>>('/user-account/list');
    if (response.data.result && response.data.data) {
      return response.data.data;
    } else {
      throw new Error('获取用户列表失败: ' + response.data.message);
    }
  } catch (error: any) {
    console.error('获取用户列表失败: ', error.message);
    throw new Error('获取用户列表失败: ' + error.message);
  }
};

// 获取用户详细信息
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

// 添加用户
export const addUser = async (user: UpdateUserData): Promise<void> => {
  try {
    const response = await apiClient.post<Response<void>>('/user-account', user);
    if (!response.data.result) {
      throw new Error('添加用户失败: ' + response.data.message);
    }
  } catch (error: any) {
    console.error('添加用户失败: ', error.message);
    throw new Error('添加用户失败: ' + error.message);
  }
};

// 删除用户
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

// 批准用户
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

export type { User }; // 导出 User 类型
