import axios from 'axios';

const API_BASE_URL = 'http://140.131.115.153:8080'; // 根据实际情况更新基础 URL

const DashboardService = {
  // 获取所有仪表板数据
  getAllDashboards: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chart/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboards:', error);
      throw new Error('Failed to fetch dashboards');
    }
  },

  // 获取特定仪表板数据
  getDashboardById: async (id: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chart/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching dashboard ${id}:`, error);
      throw new Error(`Failed to fetch dashboard ${id}`);
    }
  },

  // 获取可用的仪表板列表
  getAvailableDashboards: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chart/available`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available dashboards:', error);
      throw new Error('Failed to fetch available dashboards');
    }
  },

  // 创建新的仪表板
  createDashboard: async (dashboardData: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/chart/dashboard`, dashboardData);
      return response.data;
    } catch (error) {
      console.error('Error creating dashboard:', error);
      throw new Error('Failed to create dashboard');
    }
  },

  // 更新仪表板数据
  updateDashboard: async (id: string, dashboardData: any) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/chart/${id}`, dashboardData);
      return response.data;
    } catch (error) {
      console.error(`Error updating dashboard ${id}:`, error);
      throw new Error(`Failed to update dashboard ${id}`);
    }
  },

  // 删除仪表板
  deleteDashboard: async (id: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/chart/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting dashboard ${id}:`, error);
      throw new Error(`Failed to delete dashboard ${id}`);
    }
  },
};

export default DashboardService;
