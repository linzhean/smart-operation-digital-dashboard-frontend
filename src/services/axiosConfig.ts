//src\services\axiosConfig.ts
import axios from 'axios';

const API_BASE_URL = 'http://140.131.115.153:8080'; // 後端 API 基本 URL

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加請求攔截器
apiClient.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 添加響應攔截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { errorCode, message } = error.response.data;
      if (errorCode === 'User - AccessDenied') {
        alert(message);
        localStorage.removeItem('authToken');
        window.location.href = '/login'; // 導向登錄頁面
      } else {
        alert(message || '發生錯誤，請稍後再試!');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
