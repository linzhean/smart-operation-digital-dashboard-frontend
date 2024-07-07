import axios from 'axios';

const API_BASE_URL = 'http://140.131.115.153:8080';

const ChartService = {
  getAllCharts: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chart/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all charts:', error);
      throw error;
    }
  },

  getAvailableCharts: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chart/available`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available charts:', error);
      throw error;
    }
  },

  getDashboardCharts: async (dashboardId: number) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chart`, {
        params: { dashboardId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard charts:', error);
      throw error;
    }
  }
};

export default ChartService;
