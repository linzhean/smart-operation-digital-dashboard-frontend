// src\services\GroupApi.ts

import { Group, User } from './types/userManagement';
import { Response } from './types/Request.type';
import apiClient from './axiosConfig';

const API_URL = '/group';

export const fetchGroups = async (): Promise<Group[]> => {
  try {
    const response = await apiClient.get<Response<Group[]>>(API_URL);
    return response.data.data || [];
  } catch (error: any) {
    throw new Error('Failed to fetch groups: ' + error.message);
  }
};

export const fetchUsersByGroupId = async (groupId: number): Promise<User[]> => {
  try {
    const response = await apiClient.get<Response<User[]>>(`${API_URL}/${groupId}/users`);
    return response.data.data || [];
  } catch (error: any) {
    throw new Error('Failed to fetch users for group: ' + error.message);
  }
};

export const addGroup = async (group: Omit<Group, 'id'>): Promise<Group> => {
  try {
    const response = await apiClient.post<Response<Group>>(API_URL, group);
    return response.data.data!;
  } catch (error: any) {
    throw new Error('Failed to add group: ' + error.message);
  }
};

export const deleteGroup = async (groupId: number): Promise<void> => {
  try {
    await apiClient.delete<Response<void>>(`${API_URL}/${groupId}`);
  } catch (error: any) {
    throw new Error('Failed to delete group: ' + error.message);
  }
};


export const addUserToGroup = async (groupId: number, userId: number): Promise<void> => {
  try {
    await apiClient.post<Response<void>>(`${API_URL}/user`, { groupId, userId });
  } catch (error: any) { // Explicitly define the type of 'error' as 'any'
    throw new Error('Failed to add user to group: ' + error.message);
  }
};

export const removeUserFromGroup = async (groupId: number, userId: number): Promise<void> => {
  try {
    await apiClient.delete<Response<void>>(`${API_URL}/user`, { data: { groupId, userId } });
  } catch (error: any) { // Explicitly define the type of 'error' as 'any'
    throw new Error('Failed to remove user from group: ' + error.message);
  }
};

export const fetchGroupById = async (groupId: number): Promise<Group> => {
  try {
    const response = await apiClient.get<Response<Group>>(`${API_URL}/${groupId}`);
    return response.data.data!;
  } catch (error: any) { // Explicitly define the type of 'error' as 'any'
    throw new Error('Failed to fetch group by id: ' + error.message);
  }
};
