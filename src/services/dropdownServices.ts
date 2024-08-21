import apiClient from './axiosConfig';
import { Response } from './types/Request.type';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownData {
  departmentList?: { key: string; value: string }[];
  identityList?: { key: string; value: string }[];
}

// 获取下拉选项数据
export const fetchDropdownData = async (type: 'identity' | 'department'): Promise<DropdownOption[]> => {
  try {
    const response = await apiClient.get<Response<DropdownData>>('/dropdown', {
      params: { type }
    });

    if (response.data.result && response.data.data) {
      if (type === 'department') {
        return response.data.data.departmentList?.map(dept => ({
          value: dept.key,
          label: dept.value
        })) || [];
      } else if (type === 'identity') {
        return response.data.data.identityList?.map(id => ({
          value: id.key,
          label: id.value
        })) || [];
      }
    }

    throw new Error('获取下拉选项数据失败: ' + response.data.message);
  } catch (error: any) {
    console.error('获取下拉选项数据失败: ', error.message);
    return [];
  }
};
