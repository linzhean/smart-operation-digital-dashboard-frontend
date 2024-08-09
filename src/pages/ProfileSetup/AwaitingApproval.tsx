
import React from 'react';
import styles from './AwaitingApproval.module.css';

const AwaitingApproval: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.stars}></div>
      <div className={styles.stars2}></div>
      <div className={styles.stars3}></div>
      <div className={styles.title}>
        <span className={styles.theBig}>等待管理員審核</span>
        <br />
        <span className={styles.theSmall}>您的資料已經提交，請等待管理員審核。</span>
      </div>
    </div>
  );
};

export default AwaitingApproval;
