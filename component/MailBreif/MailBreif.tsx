// src/components/MailBreif/MailBreif.js
import React from 'react';
import '../../styles/mailBreif.css';
import MailItem from '../MailItem/MailItem';

const MailBreif: React.FC = () => {
  return (
    <div className="mailBreif">
      {Array(6).fill(0).map((_, index) => (
        <MailItem key={index} />
      ))}
    </div>
  );
};

export default MailBreif;
