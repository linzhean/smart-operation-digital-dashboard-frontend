import React from 'react';
import '../../../styles/mailBreif.css';
import MailItem from "./MailItem";

interface MailBreifProps {
  onMailClick?: (id: string) => void;
  emails: any[];
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
