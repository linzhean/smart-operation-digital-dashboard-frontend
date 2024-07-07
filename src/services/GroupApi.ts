import axios from 'axios';
import { Group, User } from './types/userManagement';

const API_BASE_URL = 'http://140.131.115.153:8080';

// 獲取所有群組列表
export const getGroups = async (): Promise<Group[]> => {
  const response = await axios.get<Group[]>(`${API_BASE_URL}/group`);
  return response.data;
};

// 添加新群組
export const addGroup = async (group: Omit<Group, 'id'>): Promise<string> => {
  const response = await axios.post<string>(`${API_BASE_URL}/group`, group);
  return response.data;
};

// 刪除群組
export const deleteGroup = async (groupId: number): Promise<string> => {
  const response = await axios.delete<string>(`${API_BASE_URL}/group/${groupId}`);
  return response.data;
};

// 編輯群組
export const editGroup = async (group: Group): Promise<string> => {
  const response = await axios.patch<string>(`${API_BASE_URL}/group/${group.id}`, group);
  return response.data;
};

// 獲取指定群組的用戶列表
export const getUsersByGroupId = async (groupId: number, filters: { userName?: string, department?: string, position?: string }): Promise<User[]> => {
  const { userName, department, position } = filters;
  const response = await axios.get<User[]>(`${API_BASE_URL}/group/${groupId}`, { params: { userName, department, position } });
  return response.data;
};

// 將用戶添加到群組
export const addUserToGroup = async (userId: string, groupId: number): Promise<string> => {
  const response = await axios.post<string>(`${API_BASE_URL}/group/user`, null, { params: { userId, groupId } });
  return response.data;
};

// 從群組中移除用戶
export const removeUserFromGroup = async (userId: string, groupId: number): Promise<string> => {
  const response = await axios.delete<string>(`${API_BASE_URL}/group/user`, { params: { userId, groupId } });
  return response.data;
};
