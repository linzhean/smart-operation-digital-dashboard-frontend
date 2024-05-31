import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ChartComponent from "../Chart/ChartComponent";
import "./Home.css";

// 生成API端点函数
const generateApiEndpoint = (index: number) => {
  const endpoints = [
    "/api/bar-chart",
    "/api/circle-chart",
    "/api/revenue",
  ];
  return endpoints[index % endpoints.length];
};

export const Home: React.FC = () => {
  const [chartItems, setChartItems] = useState(
    Array.from({ length: 3 }, (_, index) => generateApiEndpoint(index))
  );

  // 加载更多图表的函数
  const fetchMoreCharts = () => {
    setTimeout(() => {
      setChartItems((prevState) => [
        ...prevState,
        ...Array.from({ length: 3 }, (_, index) => generateApiEndpoint(prevState.length + index)),
      ]);
    }, 1500);
  };

  console.log("图表项:", chartItems); // 打印所有请求的端点

  return (
    <div className="Home">
      <div className="content">
        <div className="staticContent">
          {/* 这里可以放一些静态内容 */}
        </div>

        <InfiniteScroll
          dataLength={chartItems.length}
          next={fetchMoreCharts}
          hasMore={true}
          loader={<h4>加载中...</h4>}
          endMessage={<p style={{ textAlign: "center" }}><b>已全部加载完毕</b></p>}
        >
          {chartItems.map((endpoint, index) => (
            <div className="dataCard" key={index}>
              <ChartComponent apiEndpoint={endpoint} />
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Home;
