import axiosInstance from './axiosConfig';

const ChartService = {
  getAllCharts: async () => {
    const response = await axiosInstance.get('/chart/all');
    return response.data;
  },

  getAvailableCharts: async () => {
    const response = await axiosInstance.get('/chart/available');
    return response.data;
  },

  getDashboardCharts: async (dashboardId: number) => {
    const response = await axiosInstance.get('/chart/dashboard', {
      params: { dashboardId }
    });
    return response.data;
  },

  createChart: async (chartName: string, scriptFile: File | null, imageFile: File | null) => {
    const formData = new FormData();
    formData.append('name', chartName);

    if (scriptFile) {
      formData.append('scriptFile', scriptFile);
    }

    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    const response = await axiosInstance.post('/chart', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  },

  addChartsToDashboard: async (dashboardId: number, chartIds: number[]) => {
    const requestBody = {
      sponsorList: [], // 根据需要填充 sponsorList
      exporterList: [], // 根据需要填充 exporterList
      dashboardCharts: chartIds
    };

    const response = await axiosInstance.post('/chart/dashboard', requestBody, {
      params: { dashboardId } // 将 dashboardId 作为查询参数传递
    });

    return response.data;
  },

  getChartData: async (chartId: number) => {
    const response = await axiosInstance.get(`/chart/${chartId}`);
    return response.data;
  },

  getAIAnalysis: async (id: number, dashboardId: number) => {
    try {
      const response = await axiosInstance.get('/chart/ai', {
        params: { id, dashboardId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching AI analysis:', error);
      throw error;
    }
  },

  getCharts: async (available: boolean) => {
    try {
      const response = await axiosInstance.get('/chart', {
        params: { available }
      });
      return response.data; // 确保这个 `response.data` 是一个数组
    } catch (error) {
      console.error('Error fetching charts:', error);
      throw error;
    }
  },  

  updateChartAvailability: async (chartId: number, available: boolean) => {
    try {
      const response = await axiosInstance.patch(`/chart/${chartId}`, {
        available // 请求体中的数据
      });
      return response.data;
    } catch (error) {
      console.error('Error updating chart availability:', error);
      throw error;
    }
  }
};

export default ChartService;
