import React from 'react';
import '../../../styles/mailBreif.css';
import MailItem from "./MailItem";
import { Email } from '../../../services/mailService';
import KPI from '../../../assets/icon/testKPI.svg';

interface MailBreifProps {
  onMailClick?: (id: number) => void;
  emails: Email[];
  onDeleteEmail?: (id: number) => void; // 新增删除回调
}

const MailBreif: React.FC<MailBreifProps> = ({ onMailClick, emails, onDeleteEmail }) => {
  return (
    <div className="mailBreif">
      {emails.map((email) => (
        <MailItem
          key={email.id}
          email={email}
          onClick={() => onMailClick && onMailClick(email.id)}
          onDelete={onDeleteEmail} // 传递删除回调
        />
      ))}
    </div>
  );
};

export default MailBreif;
