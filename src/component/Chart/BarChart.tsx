import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import ChartService from '../../services/ChartService';
import '../../config/chartConfig';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth?: number;
  }[];
}

interface BarChartProps {
  data: ChartData | null;
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const [chartData, setChartData] = useState<ChartData | null>(data);

  useEffect(() => {
    if (!data) {
      const fetchChartData = async () => {
        try {
          const response = await ChartService.getDashboardCharts(1); // Assuming dashboardId is 1
          setChartData(response);
        } catch (error) {
          console.error('Failed to fetch bar chart data:', error);
        }
      };

      fetchChartData();
    }
  }, [data]);

  if (!chartData || !chartData.datasets) return <div className={`loadingMsg`}></div>;

  return <Bar data={chartData} />;
};

export default BarChart;
