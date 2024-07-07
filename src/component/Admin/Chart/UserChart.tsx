import React, { useState, useEffect } from 'react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

const UserChart: React.FC = () => {
  // 假資料 - 靜態資料
  const doughnutData = {
    labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'],
    datasets: [
      {
        label: 'Count',
        data: [20, 30, 10, 25, 15],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Label A', 'Label B', 'Label C', 'Label D', 'Label E'],
    datasets: [
      {
        label: 'Count',
        data: [15, 25, 30, 20, 10],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Revenue',
        data: [1000, 1500, 1200, 1800, 2000],
        backgroundColor: '#064FF0',
        borderColor: '#064FF0',
        pointRadius: 5,
      },
      {
        label: 'Cost',
        data: [800, 1000, 900, 1500, 1600],
        backgroundColor: '#FF3030',
        borderColor: '#FF3030',
      },
    ],
  };

  const fetchDataFromBackend = async () => {
    try {
      // 此處模擬從後端獲取數據
      // const response = await fetch('');
      // const data = await response.json();
      // console.log(data);

      // 假設獲取的數據結構與上面的圖表資料結構相似
      // 將獲取的數據設置到相應的狀態中
      // setDoughnutData(data.doughnutData);
      // setBarData(data.barData);
      // setLineData(data.lineData);

      // 這裏用假資料作示範
    } catch (error) {
      console.error( error);
    }
  };

  useEffect(() => {
    // 在這裏調用後端數據的處理函數
    fetchDataFromBackend();
  }, []); // 空的依賴數組表示僅在組件初次渲染時調用

  return (
    <div>
      <h2>假資料圖表示例</h2>
      <Doughnut data={doughnutData} />
      <h3>長條圖</h3>
      <Bar data={barData} />
      <h3>折線圖</h3>
      <Line data={lineData} />
    </div>
  );
};

export default UserChart;
