import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import ChartService from '../../services/ChartService';
import '../../config/chartConfig';  // Import chart configuration

const LineChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: 'Revenue',
        data: [],
        backgroundColor: '#064FF0',
        borderColor: '#064FF0',
        pointRadius: 5,
      },
      {
        label: 'Cost',
        data: [],
        backgroundColor: '#FF3030',
        borderColor: '#FF3030',
      },
    ],
  });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await ChartService.getAllCharts(); // Use the correct service method

        setChartData({
          ...chartData,
          labels: data.map((item: any) => item.label),
          datasets: [
            {
              ...chartData.datasets[0],
              data: data.map((item: any) => item.revenue),
            },
            {
              ...chartData.datasets[1],
              data: data.map((item: any) => item.cost),
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
    elements: {
      line: {
        tension: 0.5,
      },
    },
    plugins: {
      title: {
        text: 'Monthly Revenue & Cost',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="revenueCard">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
