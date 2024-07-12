import React from 'react';
import '../../../styles/mailBreif.css';
import MailItem from "./MailItem";
import { Email } from '../../../services/mailService';

interface MailBreifProps {
  onMailClick?: (id: number) => void;
  emails: Email[];
}

const MailBreif: React.FC<MailBreifProps> = ({ onMailClick, emails }) => {
  return (
    <div className="mailBreif">
      {emails.map((email) => (
        <MailItem key={email.id} email={email} onClick={() => onMailClick && onMailClick(email.id)} />
      ))}
    </div>
  );
};

export default MailBreif;
