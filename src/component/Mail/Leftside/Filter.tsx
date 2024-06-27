import React from 'react';
import "../../../styles/filter.css";

const Filter: React.FC = () => {
  return (
    <div className="filter">
      <div className="options">
        <input type="checkbox" name="taskStatus" id="assign" value="assign" />
        <label htmlFor="assign">交辦</label>
      </div>
      <div className="options">
        <input type="checkbox" name="taskStatus" id="assigned" value="assigned" />
        <label htmlFor="assigned">被交辦</label>
      </div>
      <div className="options">
        <input type="checkbox" name="taskStatus" id="finished" value="finished" />
        <label htmlFor="finished">已完成</label>
      </div>
      <div className="options">
        <input type="checkbox" name="taskStatus" id="unfinished" value="unfinished" />
        <label htmlFor="unfinished">未完成</label>
      </div>
    </div>
  );
};

export default Filter;