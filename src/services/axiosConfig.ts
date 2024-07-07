import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://140.131.115.153:8080',
});

// 添加请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从localStorage中获取token
    const authToken = localStorage.getItem('authToken');
    
    if (authToken) {
      // 如果存在token，则将其添加到请求头中
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    if (error.response) {
      const { errorCode, message } = error.response.data;
      if (errorCode === "User - AccessDenied") {
        // 如果是权限不足错误，提示用户重新登录
        alert(message);
        // 这里可以添加逻辑，例如跳转到登录页面或登出用户
        localStorage.removeItem('authToken');
        window.location.href = '/login'; // 假设有一个登录页面
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
