//src\component\Mail\Leftside\MailItem.tsx
import React from 'react';
import '../../../styles/mailItem.css';
import KPI from '../../../assets/icon/testKPI.svg';
import { Email } from '../../../services/mailService';

interface MailItemProps {
  email: Email;
  onClick?: () => void;
}

const MailItem: React.FC<MailItemProps> = ({ email, onClick }) => {
  return (
    <div className="leftmail" onClick={onClick}>
      <div className="kpi">
        <img src={KPI} alt="KPI" />
        <div className="kpi-details">
          <div className="kpiname">{email.name}</div>
          <h5 className="caption">{email.firstMessage?.content || 'No content available'}</h5>
          <h6 className="assignor">发起人: {email.publisher}</h6>
          <h6 className="time">{new Date(email.createDate).toLocaleString()}</h6>
        </div>
      </div>
    </div>
  );
};

export default MailItem;
