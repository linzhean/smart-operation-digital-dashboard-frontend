//src\pages\ProfileSetup\AwaitingApproval.tsx
import React from 'react';
import styles from './AwaitingApproval.module.css';
import LOGO from '../../assets/icon/Logo-GIF-crop.gif'

const AwaitingApproval: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.stars}></div>
      <div className={styles.stars2}></div>
      <div className={styles.stars3}></div>

      <div className={styles.title}>
        <img src={LOGO} className={styles.LOGO} />
        <br />
        <span className={styles.theBig}>等待管理員審核</span>
        <span className={styles.theSmall}>您的資料已經提交，請等待管理員審核。</span>
        {/* <span className={styles.theBig}>智慧營運數位儀表板</span>
        <span className={styles.theSmall}>神秘數智揭露未來</span> */}
      </div>
    </div>
  );
};

export default AwaitingApproval;

