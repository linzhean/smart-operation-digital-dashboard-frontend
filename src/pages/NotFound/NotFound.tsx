
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../ProfileSetup/AwaitingApproval.module.css'

const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>

      <div className={styles.stars}></div>
      <div className={styles.stars2}></div>
      <div className={styles.stars3}></div>
      <div className={styles.title}>
        <span className={styles.theBig}>404</span>
        <br />
        <span className={styles.theSmall}>抱歉 我們找不到您要的頁面</span>
      </div>

      <div className={styles.BackHomeButton}>
        <Link to="/home" className={styles.BackHomeButtonLink}>回首頁</Link>
      </div>


    </div>
  );
};

export default NotFound;

