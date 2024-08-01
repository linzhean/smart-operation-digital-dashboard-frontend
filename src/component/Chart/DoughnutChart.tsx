import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import ChartService from '../../services/ChartService';
import '../../config/chartConfig';

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
  }[];
}

interface DoughnutChartProps {
  data: ChartData | null;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {
  const [chartData, setChartData] = useState<ChartData | null>(data);

  useEffect(() => {
    if (!data) {
      const fetchChartData = async () => {
        try {
          const response = await ChartService.getDashboardCharts(1); // Assuming dashboardId is 1
          setChartData(response);
        } catch (error) {
          console.error('Failed to fetch doughnut chart data:', error);
        }
      };

      fetchChartData();
    }
  }, [data]);

  if (!chartData || !chartData.datasets) return <div>Loading...</div>;

  return <Doughnut data={chartData} />;
};

export default DoughnutChart;
