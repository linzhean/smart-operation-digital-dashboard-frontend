import React from 'react';
import './Mail.css';
import KPI from '../../assets/icon/testKPI.svg'

const Mail: React.FC = () => {
  return (
    <main className="mainEmail">
      <div className="leftside">
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

        <div className="mailBrief">
          {Array(6).fill(0).map((_, index) => (
            <div className="leftmail" key={index}>
              <div className="kpi">
              <img src={KPI} alt="" />
                <div className="kpiname">廢品率</div>
                <h5 className="caption">廢品率高於20%</h5>
                <h6 className="assignor">發起人:林哲安</h6>
                <h6 className="time">2024/04/03 16:06</h6>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rightside">
        <div className="mailTitle">
          <h5 className="caption">廢品率高於20%</h5>
          <h6 className="assignor">發起人:林哲安</h6>
          <i className="fa-solid fa-circle-chevron-down"></i>
        </div>
        <div className="chatContainer">
          <div className="chatBox">
            {/* Future chat messages will go here */}
          </div>
          <textarea className="mailContent" placeholder="邮件内容..."></textarea>
        </div>
      </div>
    </main>
  );
};

export default Mail;

