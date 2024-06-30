// src/components/Charts/BarChart.tsx
import React from "react";
import { Bar } from "react-chartjs-2";
import sourceData from "../../data/sourceData.json";

const BarChart: React.FC = () => {
  return (
    <div className="customerCard">
      <Bar
        data={{
          labels: sourceData.map((data) => data.label),
          datasets: [
            {
              label: "Count",
              data: sourceData.map((data) => data.value),
              backgroundColor: [
                "rgba(43, 63, 229, 0.8)",
                "rgba(250, 192, 19, 0.8)",
                "rgba(253, 135, 135, 0.8)",
              ],
              borderRadius: 5,
              barThickness: 10, // Set bar thickness for Bar Chart
            },
          ],
        }}
        options={{
          plugins: {
            title: {
              text: "Revenue Source",
            },
          },
        }}
      />
    </div>
  );
};

export default BarChart;
