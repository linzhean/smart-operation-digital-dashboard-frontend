import React from 'react';
import styles from '../../styles/AwaitingApproval.module.css';

const AwaitingApproval: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1>等待管理員審核</h1>
      <p>您的資料已經提交，請等待管理員審核。審核通過後，您將能夠使用系統。</p>
    </div>
  );
};

export default AwaitingApproval;
