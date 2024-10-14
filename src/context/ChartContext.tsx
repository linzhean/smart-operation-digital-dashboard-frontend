import React, { createContext, useState, useContext, ReactNode } from 'react';

// 定義 ChartData 的類型
interface ChartData {
  barData: { label: string; value: number; }[];
  doughnutData: { label: string; value: number; }[];
  lineData: { label: string; revenue: number; cost: number; }[];
}

// 定義 ChartContext 的類型
interface ChartContextType {
  chartData: ChartData;
  fetchChartData: () => void;
}

// 創建默認值
const defaultChartData: ChartData = {
  barData: [],
  doughnutData: [],
  lineData: [],
};

const ChartContext = createContext<ChartContextType>({
  chartData: defaultChartData,
  fetchChartData: () => {},
});

export const useChartContext = () => {
  return useContext(ChartContext);
};

export const ChartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chartData, setChartData] = useState<ChartData>(defaultChartData);

  const fetchChartData = async () => {
    // 模擬從API獲取數據
    const fetchedData: ChartData = {
      lineData: [],
      barData: [],
      doughnutData: []
    };
    setChartData(fetchedData);
  };

  return (
    <ChartContext.Provider value={{ chartData, fetchChartData }}>
      {children}
    </ChartContext.Provider>
  );
};