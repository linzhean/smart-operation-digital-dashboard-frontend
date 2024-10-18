import apiClient from './axiosConfig';
import { Response } from './types/Request.type';
import { UserAccountBean } from './types/userManagement';

export const fetchAllUsers = async (): Promise<UserAccountBean[]> => {
  try {
    const response = await apiClient.get<Response<UserAccountBean[]>>('/user-account/all');
    console.log('API Response:', response.data);

    if (response.data?.result && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      throw new Error('API response format is incorrect');
    }
  } catch (error: any) {
    console.error('Error fetching users:', error);
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

export const fetchUsers = async (
  nowPage: number = 1,
  departmentId?: string,
  name?: string,
  identity?: string,
  keyword?: string 
): Promise<UserAccountBean[]> => {
  try {
    // 准备查询参数
    const params: any = {
      nowPage,
      departmentId,
      name,
      keyword
    };

    // 处理 identity 参数
    if (identity !== undefined && identity !== '3') {
      params.identity = identity;
    } else if (identity === '3') {
      params.identity = undefined;
    }

    // 发起 API 请求
    const response = await apiClient.get<Response<UserAccountBean[]>>('/user-account/list', {
      params
    });

    console.log('API Response:', response.data);

    // 处理 API 响应
    if (response.data?.result && Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      throw new Error('API 响应格式不正确');
    }
  } catch (error: any) {
    console.error('获取用户时出错:', error);
    throw new Error(`获取用户时出错: ${error.message}`);
  }
};

export const admitUser = async (userId: string): Promise<void> => {
  try {
    const response = await apiClient.patch<Response<void>>('/user-account/admit', null, {
      params: {
        userId
      }
    });

    console.log('Admit User Response:', response.data);

    if (!response.data.result) {
      throw new Error(response.data.message || 'Error admitting user');
    }
  } catch (error: any) {
    console.error('Error admitting user:', error.response?.data || error);
    throw new Error(`Error admitting user: ${error.message}`);
  }
};



export const removeUser = async (userId: string): Promise<void> => {
  try {
    const response = await apiClient.delete<Response<void>>(`/user-account/${userId}`);

    if (!response.data.result) {
      throw new Error(response.data.message || 'Error removing user');
    }
  } catch (error: any) {
    console.error('Error removing user:', error.response?.data || error); // 打印详细错误信息
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

export const fetchTotalPages = async (): Promise<number> => {
  try {
    const response = await apiClient.get<Response<{ totalPages: number }>>(`/user-account/pages`);
    // Use optional chaining and nullish coalescing
    return response.data?.data?.totalPages ?? 1; // Default to 1 if data or totalPages is undefined
  } catch (error: any) {
    throw new Error(`Error fetching total pages: ${error.message}`);
  }
};
