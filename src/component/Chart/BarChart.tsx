import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import ChartService from '../../services/ChartService';
import '../../config/chartConfig';  // Import chart configuration

const BarChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: 'Count',
        data: [],
        backgroundColor: [
          'rgba(43, 63, 229, 0.8)',
          'rgba(250, 192, 19, 0.8)',
          'rgba(253, 135, 135, 0.8)',
        ],
        borderRadius: 5,
        barThickness: 10,
      },
    ],
  });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await ChartService.getAllCharts();

        setChartData({
          ...chartData,
          labels: data.map((item: any) => item.label),
          datasets: [
            {
              ...chartData.datasets[0],
              data: data.map((item: any) => item.value),
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, []);

  const options = {
    plugins: {
      title: {
        text: 'Revenue Source',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="customerCard">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
