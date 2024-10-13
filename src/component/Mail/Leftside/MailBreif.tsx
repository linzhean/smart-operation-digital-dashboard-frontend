import React, { useState } from 'react';
import styles from './mailBreif.module.css';
import MailItem from "./MailItem";
import { Email } from '../../../services/mailService';

interface MailBreifProps {
  onMailClick?: (id: number) => void;
  emails: Email[];
  onDeleteEmail?: (id: number) => void;
}

const MailBreif: React.FC<MailBreifProps> = ({ onMailClick, emails, onDeleteEmail }) => {
  const [selectedEmailId, setSelectedEmailId] = useState<number | null>(null);

  const handleMailItemClick = (id: number) => {
    setSelectedEmailId(id);
    if (onMailClick) onMailClick(id);
  };

  return (
    <div className={styles.mailBreif}>
      {emails.map((email) => (
        <MailItem
          key={email.id}
          email={email}
          isSelected={selectedEmailId === email.id}
          onClick={() => handleMailItemClick(email.id)}
          onDelete={onDeleteEmail}
        />
      ))}
    </div>
  );
};

export default MailBreif;