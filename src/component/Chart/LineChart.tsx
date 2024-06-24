// src/components/Charts/LineChart.tsx
import React from "react";
import { Line } from "react-chartjs-2";
import revenueData from "../../data/revenueData.json";

const LineChart: React.FC = () => {
  return (
    <div className="revenueCard">
      <Line
        data={{
          labels: revenueData.map((data) => data.label),
          datasets: [
            {
              label: "Revenue",
              data: revenueData.map((data) => data.revenue),
              backgroundColor: "#064FF0",
              borderColor: "#064FF0",
              pointRadius: 5, // Set point size for Line Chart
            },
            {
              label: "Cost",
              data: revenueData.map((data) => data.cost),
              backgroundColor: "#FF3030",
              borderColor: "#FF3030",
            },
          ],
        }}
        options={{
          elements: {
            line: {
              tension: 0.5,
            },
          },
          plugins: {
            title: {
              text: "Monthly Revenue & Cost",
            },
          },
        }}
      />
    </div>
  );
};

export default LineChart;
