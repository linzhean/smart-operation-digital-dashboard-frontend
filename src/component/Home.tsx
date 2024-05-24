import React, { useState } from "react";
import { defaults } from "chart.js/auto";
import { Bar, Doughnut, Line, } from "react-chartjs-2";
import "./Home.css";

import revenueData from "./data/revenueData.json";
import sourceData from "./data/sourceData.json";



defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.color = "black";

export const Home = () => {
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <div className="Home">
      <div className="content">
        <div className="tabs">
          <div className="tab">
            <div className="fields">
              {/* ... rest of your code */}
            </div>
          </div>
        </div>

        <div className="dataCard revenueCard">
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

        <div className="dataCard customerCard">
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

        <div className="dataCard categoryCard">
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
                  // Adjust hole size for Doughnut Chart (0 for full circle)
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
      </div>
    </div>
  );
};

export default Home;
