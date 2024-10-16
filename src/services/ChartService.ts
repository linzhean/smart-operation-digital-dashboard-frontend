//src\services\ChartService.ts
import axiosInstance from './axiosConfig';

const ChartService = {
  getAllCharts: async () => {
    const response = await axiosInstance.get('/chart/all');
    return response.data;
  },

  getAvailableCharts: async (dashboardId?: number) => {
    const response = await axiosInstance.get('/chart/available', {
      params: { dashboardId }
    });
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

  getAIAnalysis: async (chartId: number, dashboardId: number) => {
    try {
      const response = await axiosInstance.get('/ai', {
        params: { chartId, dashboardId }
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
  },
  deleteAIAnalysis: async (chartId: number) => {
    try {
      const response = await axiosInstance.delete('/ai', {
        params: { chartId }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting AI analysis:', error);
      throw error;
    }
  },

  getAISuggestion: async (chartId: number, dashboardId: number) => {
    try {
      const response = await axiosInstance.get('/ai/suggestion', {
        params: { chartId, dashboardId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching AI suggestion:', error);
      throw error;
    }
  },
  getSyncTime: async () => {
    const response = await axiosInstance.get('/dashboard/sync-time');
    return response.data;
  },
  
  sendMessage: async (data: { chartId: number; content: string; messageId: number }) => {
    try {
      const response = await axiosInstance.post('/ai/chat', {
        chartId: data.chartId,
        content: data.content,
        messageId: data.messageId,
      });
      return response;
    } catch (error) {
      console.error('Error sending message to AI:', error);
      throw error;
    }
  },
};

export default ChartService;
