import React from 'react';
import '../../../styles/mailItem.css';
import KPI from '../../../assets/icon/testKPI.svg';
import { Email, updateEmailStatus, deleteEmail } from '../../../services/mailService';
import trash from '../../../assets/icon/trashBin.png';

interface MailItemProps {
  email: Email;
  onClick?: () => void;
  onDelete?: (id: number) => void; // 传递删除的回调函数
}

const MailItem: React.FC<MailItemProps> = ({ email, onClick, onDelete }) => {
  const handleCompleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 防止觸發外部的 onClick 事件

    if (email.status === '已完成') {
      alert('此信件已經是已完成狀態');
      return;
    }

    try {
      // 定義狀態映射
      const statusMapping: Record<string, number> = {
        "交辦": 0,
        "被交辦": 1,
        "待處理": 2,
        "已完成": 3,
      };

      const newStatus = statusMapping['已完成'];

      // 檢查當前狀態是否與要更新的狀態相同
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
    e.stopPropagation(); // 防止觸發外部的 onClick 事件

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
    <div className="leftmail" onClick={onClick}>
      <div className="kpiname">{email.name}</div>
      <div className="kpi">
        <img src={KPI} alt="KPI" />
        <div className="kpi-details">
          <div className="assignor-container">
            <h6 className="assignor">發起人: {email.publisher}</h6>
            <button
              className="complete-btn"
              onClick={handleCompleteClick}
            >
              完成
            </button>
            <button
              className="delete-btn"
              onClick={handleDeleteClick}
            >
              <img src={trash} alt="刪除" />
            </button>
          </div>
          <h6 className="time">{new Date(email.emailSendTime).toLocaleString()}</h6>
        </div>
      </div>
    </div>
  );
};

export default MailItem;
