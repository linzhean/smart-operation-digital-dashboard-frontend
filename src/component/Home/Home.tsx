import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ChartComponent from "../Chart/ChartComponent";
import "./Home.css";

const generateApiEndpoint = (index: number) => {
  const endpoints = [
    "/api/bar-chart",
    "/api/circle-chart",
    "/api/revenue",
  ];
  return endpoints[index % endpoints.length];
};

export const Home = () => {
  const [chartItems, setChartItems] = useState(
    Array.from({ length: 3 }, (_, index) => generateApiEndpoint(index))
  );

  const fetchMoreCharts = () => {
    setTimeout(() => {
      setChartItems((prevState) => [
        ...prevState,
        ...Array.from({ length: 3 }, (_, index) => generateApiEndpoint(prevState.length + index)),
      ]);
    }, 1500);
  };

  console.log("Chart items:", chartItems); // 打印所有请求的端点

  return (
    <div className="Home">
      <div className="content">
        <div className="staticContent">
          <h2>Original Content</h2>
          <p>This is the original content that should not be affected by the infinite scroll.</p>
        </div>

        <InfiniteScroll
          dataLength={chartItems.length}
          next={fetchMoreCharts}
          hasMore={true}
          loader={<h4>Loading...</h4>}
          endMessage={<p style={{ textAlign: "center" }}><b>Yay! You have seen it all</b></p>}
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
