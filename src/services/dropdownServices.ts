// src/services/dropdownServices.ts
import apiClient from './axiosConfig';
import { Response } from './types/Request.type';

interface DropdownData {
  departments: { value: string; label: string }[];
  identities: { value: string; label: string }[];
}

export const fetchDropdownData = async (): Promise<DropdownData> => {
  try {
    const response = await apiClient.get<Response<DropdownData>>('/dropdown');
    if (response.data.result && response.data.data) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch dropdown data: ' + response.data.message);
    }
  } catch (error: any) {
    console.error('Failed to fetch dropdown data: ', error.message);
    throw new Error('Failed to fetch dropdown data: ' + error.message);
  }
};
