import apiClient from './axiosConfig';
import { Response } from './types/Request.type';

function isAxiosError(error: any): error is { response: { data: { errorCode: string } }, message: string } {
  return error.response && error.response.data && typeof error.response.data.errorCode === 'string' && typeof error.message === 'string';
}

// GET /export
export const getExportPermission = async (chartId: number): Promise<Response<any>> => {
  try {
    const response = await apiClient.get(`/export`, {
      params: { chartId },
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        result: false,
        errorCode: error.response.data.errorCode || 'UnknownError',
        message: error.message,
        data: null,
      };
    } else {
      return {
        result: false,
        errorCode: 'UnknownError',
        message: 'An unknown error occurred',
        data: null,
      };
    }
  }
};

// POST /export
export const setExportPermission = async (chartId: number, { sponsorList, exporterList, dashboardCharts }: { sponsorList: string[], exporterList: string[], dashboardCharts: number[] }): Promise<Response<any>> => {
  try {
    const response = await apiClient.post(`/export`, { sponsorList, exporterList, dashboardCharts }, {
      params: { chartId },
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        result: false,
        errorCode: error.response.data.errorCode || 'UnknownError',
        message: error.message,
        data: null,
      };
    } else {
      return {
        result: false,
        errorCode: 'UnknownError',
        message: 'An unknown error occurred',
        data: null,
      };
    }
  }
};

// POST /export/export
export const exportData = async (chartId: number, requestData: { exporterList: string[], dashboardCharts: number[] }): Promise<Response<any>> => {
  try {
    const response = await apiClient.post(`/export/export`, requestData, {
      params: { chartId },
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        result: false,
        errorCode: error.response.data.errorCode || 'UnknownError',
        message: error.message,
        data: null,
      };
    } else {
      return {
        result: false,
        errorCode: 'UnknownError',
        message: 'An unknown error occurred',
        data: null,
      };
    }
  }
};
