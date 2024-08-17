import apiClient from './axiosConfig';
import { Response } from './types/Request.type';
import { User, Group, AddUserToGroupRequest } from './types/userManagement';

const API_URL = '/group';

// 获取所有群组
export const fetchGroups = async (): Promise<Group[]> => {
  try {
    const response = await apiClient.get<Response<Group[]>>(`${API_URL}/user`);
    return response.data.data || [];
  } catch (error: any) {
    throw new Error('获取群组信息失败: ' + error.message);
  }
};

// 根据群组 ID 获取用户
export const fetchUsersByGroupId = async (groupId: number): Promise<User[]> => {
  try {
    const response = await apiClient.get<Response<User[]>>(`/group/user/${groupId}`);
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
// 从群组中移除用户
export const removeUserFromGroup = async (userGroupId: number, userId?: number): Promise<{ result: boolean; message?: string }> => {
  try {
    const response = await apiClient.delete<{ result: boolean; message?: string }>(`${API_URL}/user`, {
      params: { userGroupId }
    });
    return response.data;
  } catch (error: any) {
    console.error('移除用户失败:', error.message);
    throw error;
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

export const fetchChartsByGroupId = async (groupId: number): Promise<{ id: number; name: string }[]> => {
  try {
    // 构造 URL，将 groupId 作为路径参数
    const url = `/group/chart/${groupId}`;

    // 发起 GET 请求
    const response = await apiClient.get<Response<{ id: number; name: string }[]>>(url);

    // 返回数据，如果没有数据则返回空数组
    return response.data.data || [];
  } catch (error) {
    console.error('获取群组图表失败:', error);
    throw error;
  }
};

// 在 GroupApi.ts 里增加这个方法
export const removeChartFromGroup = async (groupId: number, chartId: number): Promise<void> => {
  try {
    await apiClient.delete<void>(`${API_URL}/chart`, {
      params: { groupId, chartId }
    });
  } catch (error: any) {
    console.error('移除图表失败:', error.message);
    throw error;
  }
};


