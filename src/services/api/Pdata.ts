// src/services/api.ts
import axios from 'axios';

// 假設你的 API 根 URL 是這個
const API_BASE_URL = 'https://your-api-url.com';

export const fetchUserData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/user`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const updateUserData = async (userData: any) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/api/user`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};
