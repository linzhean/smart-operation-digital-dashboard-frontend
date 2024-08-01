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
    const response = await axiosInstance.get('/chart', {
      params: { dashboardId }
    });
    return response.data;
  },

  createChart: async (dashboardId: number, sponsorList: string[], exporterList: string[], dashboardCharts: number[]) => {
    const response = await axiosInstance.post('/chart/dashboard', {
      sponsorList,
      exporterList,
      dashboardCharts
    }, {
      params: { dashboardId }
    });
    return response.data;
  },

  updateChart: async (id: string, chart: any) => {
    const response = await axiosInstance.put(`/chart/${id}`, chart);
    return response.data;
  },

  deleteChart: async (id: string) => {
    const response = await axiosInstance.delete(`/chart/${id}`);
    return response.data;
  },

  getChartData: async (chartId: number) => {
    const response = await axiosInstance.get(`/chart/${chartId}`);
    return response.data;
  }
};

export default ChartService;
