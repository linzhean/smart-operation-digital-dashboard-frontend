import React from 'react';
import styles from './mailItem.module.css';
import KPI from '../../../assets/icon/testKPI.svg';
import { Email, updateEmailStatus, deleteEmail } from '../../../services/mailService';
import trash from '../../../assets/icon/trashBin.png';

interface MailItemProps {
  email: Email;
  onClick?: () => void;
  onDelete?: (id: number) => void;
}

const MailItem: React.FC<MailItemProps> = ({ email, onClick, onDelete }) => {
  const handleCompleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (email.status === '已完成') {
      alert('此信件已經是已完成狀態');
      return;
    }

    try {
      const statusMapping: Record<string, number> = {
        "交辦": 0,
        "被交辦": 1,
        "待處理": 2,
        "已完成": 3,
      };

      const newStatus = statusMapping['已完成'];

      if (email.status !== '已完成') {
        await updateEmailStatus(email.id, newStatus);
        alert('狀態已更新為已完成');
      } else {
        alert('不可更改為相同的處理狀態');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('無法更新狀態，請稍後再試');
    }
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (window.confirm('確定要刪除此郵件嗎？')) {
      try {
        await deleteEmail(email.id);
        if (onDelete) {
          onDelete(email.id);
        }
      } catch (error) {
        console.error('Failed to delete email:', error);
        alert('無法刪除郵件，請稍後再試');
      }
    }
  };

  return (
    <div className={styles.leftmail} onClick={onClick}>
      <div className={styles.emailName}>{email.name}</div>
      <div className={styles.kpi}>
        <img src={KPI} alt="KPI" />
        <div className={styles.kpiDetails}>
          <div className={styles.assignorContainer}>
            <h6 className={styles.assignor}>發起人: {email.publisher}</h6>
            <button
              className={styles.completeButton}
              onClick={handleCompleteClick}
            >
              完成
            </button>
            <button
              className={styles.deleteButton}
              onClick={handleDeleteClick}
            >
              <img src={trash} alt="刪除" />
            </button>
          </div>
          <h6 className={styles.time}>{new Date(email.emailSendTime).toLocaleString()}</h6>
        </div>
      </div>
    </div>
  );
};

export default MailItem;
