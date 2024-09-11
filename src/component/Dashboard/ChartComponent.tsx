import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartComponentProps {
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor?: string;
      backgroundColor?: string;
    }[];
  } | undefined;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ chartData }) => {
  if (!chartData) {
    return <p>沒有圖表數據可以使用</p>;
  }

  const data = {
    labels: chartData.labels,
    datasets: chartData.datasets.map(dataset => ({
      ...dataset,
      borderColor: dataset.borderColor || 'rgba(75, 192, 192, 1)',
      backgroundColor: dataset.backgroundColor || 'rgba(75, 192, 192, 0.2)',
    })),
  };

  return <Line data={data} />;
};

export default ChartComponent;
