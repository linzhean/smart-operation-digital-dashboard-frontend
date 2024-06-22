// src/pages/Home/Home.tsx
import React, { useState } from "react";
import { defaults } from "chart.js/auto";
import InfiniteScroll from "react-infinite-scroll-component";
import LineChart from "../../component/Chart/LineChart";
import BarChart from "../../component/Chart/BarChart";
import DoughnutChart from "../../component/Chart/DoughnutChart";
import "../../styles/Home.css"; // 更新引用位置

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

const Home: React.FC = () => {
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
              {chartType === "line" && <LineChart />}
              {chartType === "bar" && <BarChart />}
              {chartType === "doughnut" && <DoughnutChart />}
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Home;
