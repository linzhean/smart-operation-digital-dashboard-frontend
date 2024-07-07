import React from 'react';
import '../../../styles/mailItem.css';
import KPI from '../../../assets/icon/testKPI.svg';

interface MailItemProps {
  email: any;
  onClick?: () => void;
}

const MailItem: React.FC<MailItemProps> = ({ email, onClick }) => {
  return (
    <div className="leftmail" onClick={onClick}>
      <div className="kpi">
        <img src={KPI} alt="KPI" />
        <div className="kpiname">{email.subject}</div>
        <h5 className="caption">{email.content}</h5>
        <h6 className="assignor">发起人: {email.sender}</h6>
        <h6 className="time">{email.date}</h6>
      </div>
    </div>
  );
};

export default MailItem;
