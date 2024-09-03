//src\services\GroupApi.ts
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
    const response = await apiClient.get<Response<User[]>>(`${API_URL}/user/${groupId}`);
    return response.data.data || [];
  } catch (error: any) {
    console.error('获取用户列表失败:', error);
    throw error;
  }
};

// 新增群组
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
    const response = await apiClient.post<Response<{ result: boolean }>>(
      `${API_URL}/user`,
      null,
      {
        params: { userId, groupId },
      }
    );
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
export const removeUserFromGroup = async (
userGroupId: number, userId?: number, userName?: string): Promise<{ result: boolean; message?: string }> => {
  try {
    const response = await apiClient.delete<Response<{ result: boolean; message?: string }>>(
      `${API_URL}/user`,
      {
        params: { userGroupId },
      }
    );
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

// 更新群组的图表权限
export const updateGroupChartPermissions = async (
  groupId: number,
  chartId: number,
  newState: boolean
): Promise<void> => {
  try {
    await apiClient.post<void>(`${API_URL}/chart`, null, {
      params: { groupId, chartId },
      data: { enabled: newState },
    });
  } catch (error: any) {
    console.error('更新图表权限失败:', error);
    throw error;
  }
};

// 根据群组 ID 获取图表
export const fetchChartsByGroupId = async (groupId: number): Promise<
  {
    [x: string]: any; id: number; name: string; chartGroupId: number 
}[]
> => {
  try {
    const response = await apiClient.get<Response<{ id: number; name: string; chartGroupId: number }[]>>(
      `${API_URL}/chart/${groupId}`
    );

    // 確認數據格式
    const data = response.data.data;
    
    // 打印數據以調試
    console.log('Fetched charts data:', data);

    // 如果 `data` 是物件而不是陣列，打印數據以調試
    if (!Array.isArray(data)) {
      console.error('Expected an array, but got:', data);
      return []; // 返回空陣列以避免錯誤
    }
    
    return data;
  } catch (error: any) {
    console.error('Error fetching charts by group ID:', error.message);
    throw error;
  }
};

// 从群组中移除图表
// Remove chart from group
export const removeChartFromGroup = async (chartGroupId: number, chartId: number): Promise<void> => {
  try {
    await apiClient.delete<void>(`${API_URL}/chart`, {
      params: { userGroupId: chartGroupId, chartId },
    });
  } catch (error: any) {
    console.error('移除图表失败:', error.message);
    throw error;
  }
};

