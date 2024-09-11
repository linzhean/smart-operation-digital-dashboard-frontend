import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import ChartService from '../../services/ChartService';
import '../../config/chartConfig';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    pointRadius?: number;
  }[];
}

interface LineChartProps {
  data: ChartData | null;
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const [chartData, setChartData] = useState<ChartData | null>(data);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await ChartService.getDashboardCharts(1); // Assuming dashboardId is 1
        setChartData(response);
      } catch (error) {
        console.error('Failed to fetch line chart data:', error);
      }
    };

    if (!data) {
      fetchChartData();
    } else {
      setChartData(data);
    }
  }, [data]);

  if (!chartData || !chartData.datasets) return <div className={`loadingMsg`}></div>;

  return <Line data={chartData} />;
};

export default LineChart;
