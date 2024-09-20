import React from 'react';
import styles from './mailBreif.module.css';
import MailItem from "./MailItem";
import { Email } from '../../../services/mailService';

interface MailBreifProps {
  onMailClick?: (id: number) => void;
  emails: Email[];
  onDeleteEmail?: (id: number) => void;
}

const MailBreif: React.FC<MailBreifProps> = ({ onMailClick, emails, onDeleteEmail }) => {
  return (
    <div className={styles.mailBreif}>
      {emails.map((email) => (
        <MailItem
          key={email.id}
          email={email}
          onClick={() => onMailClick && onMailClick(email.id)}
          onDelete={onDeleteEmail}
        />
      ))}
    </div>
  );
};

export default MailBreif;
