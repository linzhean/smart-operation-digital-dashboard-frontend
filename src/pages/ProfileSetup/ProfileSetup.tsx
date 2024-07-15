import React from 'react';
import styles from './ProfileSetup.module.css';
import logo from '../../assets/icon/Logo-GIF-crop.gif';

const ProfileSetup: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.formHeader}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h1>填寫基本資料完成註冊</h1>
      </div>
      <form action="your-action-url" method="post" className={styles.setupForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name">姓名</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="employee-id">工號</label>
          <input type="text" id="employee-id" name="employee-id" required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" readOnly placeholder="登入自帶@gmail.com放到這裡" />
        </div>
        <div className={styles.theForms}>
          <div className={styles.formGroup}>
            <label htmlFor="department">所屬部門</label>
            <select id="department" name="department" required>
              <option value="">您的所屬部門</option>
              <option value="sales">銷售部門</option>
              <option value="finance">財務部門</option>
              <option value="production">生產部門</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="job-title">職稱</label>
            <select id="job-title" name="job-title" required>
              <option value="">您目前的職稱</option>
              <option value="manager">經理</option>
              <option value="supervisor">主管</option>
              <option value="staff">員工</option>
              <option value="intern">實習生</option>
            </select>
          </div>
        </div>
        <button type="submit" className={styles.setupSubmit}>送出</button>
      </form>
    </div>
  );
};

export default ProfileSetup;
