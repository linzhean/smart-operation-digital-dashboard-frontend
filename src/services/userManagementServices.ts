import axios from 'axios';
import { User } from './types/userManagement';
import { Response } from './types/Request.type';
import { getHeaders } from './apiHelper';

const API_BASE_URL = 'http://140.131.115.153:8080';

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<Response<User[]>>(`${API_BASE_URL}/user-account`, { headers: getHeaders() });
    if (response.data.result) {
      return response.data.data || [];
    } else {
      throw new Error(response.data.message || '獲取使用者失敗');
    }
  } catch (error: any) {
    throw new Error('獲取使用者失敗：' + error.message);
  }
};

export const addUser = async (user: User): Promise<string> => {
  try {
    const response = await axios.post<Response<null>>(`${API_BASE_URL}/user-account`, user, { headers: getHeaders() });
    if (response.data.result) {
      return response.data.message || '使用者添加成功';
    } else {
      throw new Error(response.data.message || '添加使用者失敗');
    }
  } catch (error: any) {
    throw new Error('添加使用者失敗：' + error.message);
  }
};

export const deleteUser = async (userId: string): Promise<string> => {
  try {
    const response = await axios.delete<Response<null>>(`${API_BASE_URL}/user-account/${userId}`, { headers: getHeaders() });
    if (response.data.result) {
      return response.data.message || '使用者刪除成功';
    } else {
      throw new Error(response.data.message || '刪除使用者失敗');
    }
  } catch (error: any) {
    throw new Error('刪除使用者失敗：' + error.message);
  }
};

export const admitUser = async (userId: string): Promise<string> => {
  try {
    const response = await axios.patch<Response<null>>(`${API_BASE_URL}/user-account/admit`, { userId }, { headers: getHeaders() });
    if (response.data.result) {
      return response.data.message || '使用者審核成功';
    } else {
      throw new Error(response.data.message || '審核使用者失敗');
    }
  } catch (error: any) {
    throw new Error('審核使用者失敗：' + error.message);
  }
};

export const getUsersByDepartmentAndName = async (department: string, name: string, page: number): Promise<User[]> => {
  try {
    const response = await axios.get<Response<User[]>>(`${API_BASE_URL}/user-account/require/list`, {
      params: { departmentId: department, name, nowPage: page },
      headers: getHeaders()
    });
    if (response.data.result) {
      return response.data.data || [];
    } else {
      throw new Error(response.data.message || '查詢使用者失敗');
    }
  } catch (error: any) {
    throw new Error('查詢使用者失敗：' + error.message);
  }
};
