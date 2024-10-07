
import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../ProfileSetup/AwaitingApproval.module.css'
import LOGO from '../../assets/icon/Logo-GIF-crop.gif'

const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>

      <div className={styles.stars}></div>
      <div className={styles.stars2}></div>
      <div className={styles.stars3}></div>
      <div className={styles.title}>
        <img src={LOGO} className={styles.LOGO} />
        <br />
        <span className={styles.theBig}>404</span>
        <span className={styles.theSmall}>抱歉 我們找不到您要的頁面</span>
        <div className={styles.BackHomeButton}>
          <Link to="/home" className={styles.BackHomeButtonLink}>
            <div className={styles.BackHomeText}>回首頁</div>
          </Link>
        </div>
      </div>

    </div>
  );
};

export default NotFound;

