// src/components/Charts/DoughnutChart.tsx
import React from "react";
import { Doughnut } from "react-chartjs-2";
import sourceData from "../../data/sourceData.json";

const DoughnutChart: React.FC = () => {
  return (
    <div className="categoryCard">
      <Doughnut
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
              borderColor: [
                "rgba(43, 63, 229, 0.8)",
                "rgba(250, 192, 19, 0.8)",
                "rgba(253, 135, 135, 0.8)",
              ],
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

export default DoughnutChart;
