import React from 'react';
import "../../../styles/mailItem.css";
import KPI from '../../../assets/icon/testKPI.svg';

interface MailItemProps {
  onClick?: () => void;
}

const MailItem: React.FC<MailItemProps> = ({ onClick }) => {
  return (
    <div className="leftmail" onClick={onClick}>
      <div className="kpi">
        <img src={KPI} alt="KPI" />
        <div className="kpiname">廢品率</div>
        <h5 className="caption">廢品率高於20%</h5>
        <h6 className="assignor">發起人:林哲安</h6>
        <h6 className="time">2024/04/03 16:06</h6>
      </div>
    </div>
  );
};

export default MailItem;
