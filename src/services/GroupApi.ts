import apiClient from './axiosConfig';
import { Response } from './types/Request.type';
import { User, Group, AddUserToGroupRequest } from './types/userManagement';

const API_URL = '/group';

// 获取所有群组
export const fetchGroups = async (): Promise<Group[]> => {
  try {
    const response = await apiClient.get<Response<Group[]>>(`${API_URL}`);
    return response.data.data || [];
  } catch (error: any) {
    throw new Error('获取群组信息失败: ' + error.message);
  }
};

// 根据群组 ID 获取用户
export const fetchUsersByGroupId = async (groupId: number): Promise<User[]> => {
  try {
    const response = await apiClient.get<Response<User[]>>(`${API_URL}/${groupId}`);
    if (Array.isArray(response.data.data)) {
      return response.data.data;
    } else {
      console.error('API 返回的不是用户数组:', response.data);
      return [];
    }
  } catch (error: any) {
    console.error('获取群组用户失败:', error);
    return [];
  }
};

export const addGroup = async (group: Omit<Group, 'id'>): Promise<Group> => {
  try {
    const response = await apiClient.post<Response<Group>>(API_URL, {
      ...group,
      available: true,
      createId: '',
      createDate: '',
      modifyId: '',
      modifyDate: null,
    });
    return response.data.data!;
  } catch (error: any) {
    throw new Error('新增群组失败: ' + error.message);
  }
};

// 根据 ID 删除群组
export const deleteGroup = async (groupId: number): Promise<void> => {
  try {
    await apiClient.delete<void>(`${API_URL}/${groupId}`);
  } catch (error: any) {
    throw new Error('删除群组失败: ' + error.message);
  }
};

// 将用户添加到群组
export const addUserToGroup = async (requestData: AddUserToGroupRequest): Promise<void> => {
  try {
    await apiClient.post('/group/user', requestData);
  } catch (error: any) {
    console.error('将用户添加到组失败: ', error.message);
    throw new Error('将用户添加到组失败: ' + error.message);
  }
};

// 从群组中移除用户
export const removeUserFromGroup = async (groupId: number, userId: number): Promise<void> => {
  try {
     await apiClient.delete<Response<void>>(`${API_URL}/user`, { data: { groupId, userId } });
  } catch (error: any) {
    throw new Error('将用户从群组移除失败: ' + error.message);
  }
};

// 根据 ID 更新群组名称
export const updateGroupName = async (groupId: number, newName: string): Promise<Group> => {
  try {
    const response = await apiClient.patch<Response<Group>>(`${API_URL}/${groupId}`, {
      name: newName,
    });
    return response.data.data!;
  } catch (error: any) {
    throw new Error('更新群组名称失败: ' + error.message);
  }
};