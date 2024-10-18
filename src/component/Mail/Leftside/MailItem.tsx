import React, { useEffect, useState  } from 'react';
import styles from './mailItem.module.css';
import { Email, updateEmailStatus, deleteEmail, getEmailDetails, getEmails } from '../../../services/mailService';
import trash from '../../../assets/icon/trashBin.png';
import finishIcon from '../../../assets/icon/finish.png'
import { Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

interface MailItemProps {
  email: Email;
  onClick?: () => void;
  isSelected?: boolean;
  onDelete?: (id: number) => void;
}

const MailItem: React.FC<MailItemProps> = ({ email, isSelected, onClick, onDelete }) => {
  const [showcaseImage, setShowcaseImage] = useState<string>();

  const WhiteTooltip = styled(({ className, ...props }: any) => (
    <Tooltip {...props} classes={{ popper: className }} PopperProps={{
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, -12],
          },
        },
      ],
    }} />
  ))(() => ({
    [`& .MuiTooltip-tooltip`]: {
      backgroundColor: '#ffffff',
      color: '#000000',
      boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
      fontSize: '0.8rem',
      fontWeight: '700',
      border: '1px solid #000000',
    }
  }));

  useEffect(() => {
    const fetchShowcaseImage = async () => {
      try {
        const emails = await getEmails([]); 
        const matchedEmail = emails.find((e: Email) => e.id === email.id);
        if (matchedEmail) {
          setShowcaseImage(matchedEmail.showcaseImage); 
        }
      } catch (error) {
        console.error('Failed to fetch showcase image:', error);
      }
    };

    fetchShowcaseImage();
  }, [email]);

  const handleCompleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (email.status === '已完成') {
      alert('此信件已經是已完成狀態');
      return;
    }

    const confirmUpdate = window.confirm('確定要將此郵件標記為已完成嗎？');

    if (!confirmUpdate) {
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


  const refreshEmailStatus = async (id: number) => {
    const emailDetails = await getEmailDetails(id);
    return emailDetails.status;
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const currentStatus = await refreshEmailStatus(email.id);

    if (currentStatus !== '已完成') {
      alert('郵件非已完成狀態，無法刪除');
      return;
    }

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
  const theStatusStyle = email.status === '待處理' ? styles.statusPending : styles.statusComplete;

  return (
    <>

      {/* 整個區域 */}
      < div className={`${styles.eachMailBriefSection} ${isSelected ? styles.eachMailBriefSectionSelected : ''}`} onClick={onClick} >

        {/* 示意圖 */}
        <img src={showcaseImage} className={styles.KPI} alt="KPI" />
        {/* 信件標頭 */}
        < div className={styles.mailHeader} >

          <div className={styles.topArea}>
            <h6 className={styles.assignor}>{email.publisher}</h6>
            <h6 className={styles.time}>
              {(() => {
                const date = new Date(email.emailSendTime);
                const currentYear = new Date().getFullYear();
                const formattedDate = date.toLocaleString('zh-TW', {
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                }).replace(/\//g, '/').replace(/,/g, '');

                if (date.getFullYear() !== currentYear) {
                  return `${date.getFullYear()}/${formattedDate}`;
                }

                return formattedDate;
              })()}
            </h6>
          </div>

          {/* 信件狀態 */}
          <div className={styles.centerArea}>
            <div className={`${styles.eachEmailStatus} ${theStatusStyle}`}>{email.status}</div>
          </div>

          <div className={styles.bottomArea} >
            {/* 標題 */}
            <div className={styles.emailTitle}>{email.name}</div>
            {/* 按鈕組 */}
            <div className={`${styles.buttonGroup} ${isSelected ? styles.buttonGroupSelected : ''}`}>

              {/* 完成按鈕 */}
              <WhiteTooltip title="將此任務標記為已完成" enterDelay={700} leaveDelay={100} >
                <button
                  className={styles.completeButton}
                  onClick={handleCompleteClick}
                >
                  <img src={finishIcon} className={styles.completeIcon} alt='完成' />
                </button>
              </WhiteTooltip>

              {/* 刪除按鈕 */}
              <WhiteTooltip title="刪除已完成的郵件" enterDelay={700} leaveDelay={100} >
                <button
                  className={styles.deleteButton}
                  onClick={handleDeleteClick}
                >
                  <img src={trash} className={styles.deleteIcon} alt="刪除" />
                </button>
              </WhiteTooltip>

            </div>

          </div>
        </div >
      </div >

    </>



  );
};

export default MailItem;