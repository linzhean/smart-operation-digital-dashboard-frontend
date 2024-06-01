import React, { useState } from "react";
import { defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import InfiniteScroll from "react-infinite-scroll-component";
import "./Home.css";

import revenueData from "../data/revenueData.json";
import sourceData from "../data/sourceData.json";

// 设置 Chart.js 默认参数
defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.color = "black";

// 模拟生成图表类型函数
const generateChartType = (index: number) => {
  const chartTypes = ["line", "bar", "doughnut"];
  return chartTypes[index % chartTypes.length];
};

const Home = () => {
  const [chartItems, setChartItems] = useState(
    Array.from({ length: 3 }, (_, index) => generateChartType(index))
  );

  // 加载更多图表的函数
  const fetchMoreCharts = () => {
    setTimeout(() => {
      setChartItems((prevState) => [
        ...prevState,
        ...Array.from(
          { length: 3 },
          (_, index) => generateChartType(prevState.length + index)
        ),
      ]);
    }, 1500);
  };

  return (
    <div className="Home">
      <div className="content">
        <InfiniteScroll
          dataLength={chartItems.length}
          next={fetchMoreCharts}
          hasMore={true}
          loader={<h4>加载中...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>已全部加载完毕</b>
            </p>
          }
        >
          {chartItems.map((chartType, index) => (
            <div className="dataCard" key={index}>
              {chartType === "line" && (
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
              )}
              {chartType === "bar" && (
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
              )}
              {chartType === "doughnut" && (
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
              )}
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Home;
