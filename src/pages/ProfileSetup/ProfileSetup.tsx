import React, { useState } from 'react';
import styles from './ProfileSetup.module.css';
import logo from '../../assets/icon/Logo-GIF-crop.gif';
import { addUser } from '../../services/userManagementServices';
import { UpdateUserData } from '../../services/types/userManagement';

const ProfileSetup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    department: '',
    jobTitle: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const newUser: UpdateUserData = {
      userId: formData.employeeId,
      userName: formData.name,
      departmentId: '', // Add actual department ID if applicable
      departmentName: formData.department,
      googleId: '', // Add actual Google ID if applicable
      gmail: formData.email,
      identity: 'NO_PERMISSION',
      position: formData.jobTitle,
      available: false,
      createId: '', // Add actual creator ID if applicable
      createDate: new Date().toISOString(),
      modifyId: '',
      modifyDate: new Date().toISOString()
    };

    try {
      await addUser(newUser);
      window.location.href = '/awaiting-approval';
    } catch (error) {
      console.error('Failed to add user:', error);
      // Handle error appropriately, e.g., show a user-friendly message
    }
  };

  return (
    <div className='profileSetupBody'>
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
            <label htmlFor="employee-id">員工編號</label>
            <input type="text" id="employee-id" name="employee-id" required />
    <div className={styles.container}>
      <div className={styles.formHeader}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h1>填寫基本資料完成註冊</h1>
      </div>
      <form onSubmit={handleSubmit} className={styles.setupForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name">姓名</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="employee-id">工號</label>
          <input
            type="text"
            id="employee-id"
            name="employee-id"
            required
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            readOnly
            placeholder="登入自帶@gmail.com放到這裡"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className={styles.theForms}>
          <div className={styles.formGroup}>
            <label htmlFor="department">所屬部門</label>
            <select
              id="department"
              name="department"
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              <option value="">您的所屬部門</option>
              <option value="sales">銷售部門</option>
              <option value="finance">財務部門</option>
              <option value="production">生產部門</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="job-title">職稱</label>
            <select
              id="job-title"
              name="jobTitle"
              required
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            >
              <option value="">您目前的職稱</option>
              <option value="manager">經理</option>
              <option value="supervisor">主管</option>
              <option value="staff">員工</option>
              <option value="intern">實習生</option>
            </select>
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
      </div></div>
  );
};

export default ProfileSetup;
