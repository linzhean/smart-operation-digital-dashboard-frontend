import React from 'react';
import ChartComponent from './ChartComponent';

const Project: React.FC = () => {
  return (
    <div className="project">
      <h1>Project 页面</h1>
      <ChartComponent apiEndpoint={''} />
    </div>
  );
};

export default Project;