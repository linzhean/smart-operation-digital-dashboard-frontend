import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const LineChart = () => {
  const chartContainer = useRef(null);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const ctx = chartContainer.current.getContext('2d');
      if (ctx) {
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
              label: 'My First Dataset',
              data: [65, 59, 80, 81, 56, 55, 40],
              borderColor: 'rgb(0, 201, 252)',
              tension: 0.1
            }]
          }
        });
      }
    }
  }, []);

  return (
    <div>
      <canvas ref={chartContainer}></canvas>
    </div>
  );
};

export default LineChart;
