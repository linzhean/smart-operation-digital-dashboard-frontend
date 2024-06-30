import React from 'react';
import '../../../styles/mailBreif.css';
import MailItem from "./MailItem";

interface MailBreifProps {
  onMailClick?: () => void;
}

const MailBreif: React.FC<MailBreifProps> = ({ onMailClick }) => {
  return (
    <div className="mailBreif">
      {Array(6).fill(0).map((_, index) => (
        <MailItem key={index} onClick={onMailClick} />
      ))}
    </div>
  );
};

export default MailBreif;
