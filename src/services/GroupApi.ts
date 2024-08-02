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
    const response = await apiClient.get<Response<User[]>>(`/group/${groupId}`);
    return response.data.data || []; // Ensure this is always an array
  } catch (error) {
    console.error('獲取用戶列表失敗:', error);
    throw error;
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
export const addUserToGroup = async ({ userId, groupId }: AddUserToGroupRequest) => {
  try {
    const response = await apiClient.post(`${API_URL}/user`, null, {
      params: { userId, groupId }
    });
    if (!response.data.result) {
      throw new Error('添加用户失败');
    }
    return response.data;
  } catch (error: any) {
    console.error('将用户添加到群组失败:', error.message);
    throw error;
  }
};

// 从群组中移除用户
export const removeUserFromGroup = async (groupId: number, userId: string): Promise<void> => {
  try {
    await apiClient.delete<Response<void>>(`${API_URL}/user`, { data: { groupId, userId } });
  } catch (error: any) {
    throw new Error('Failed to remove user from group: ' + error.message);
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

export const updateGroupChartPermissions = async (groupId: number, chartId: number, newState: boolean): Promise<void> => {
  try {
    await apiClient.post(`/group/chart`, null, {
      params: {
        groupId,
        chartId
      },
      data: {
        enabled: newState
      }
    });
  } catch (error) {
    console.error('更新圖表權限失敗:', error);
    throw error;
  }
};

