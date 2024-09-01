//src\services\ChartService.ts
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

  createChart: async (chartData: {
    name: string;
    scriptFile: string;
    scriptPath: string;
    imageFile: string;
    showcaseImage: string;
    chartImage: string;
    chartHTML: string;
    canAssign: boolean;
    observable: boolean;
    available: boolean;
    createId: string;
    createDate: string;
    modifyId: string;
    modifyDate: string;
    chartGroupId: number;
  }) => {
    const response = await axiosInstance.post('/chart', chartData);
    return response.data;
  },

// ChartService.js
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
};

export default ChartService;
