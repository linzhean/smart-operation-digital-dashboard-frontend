import React, { useState } from 'react';
import styles from './ProfileSetup.module.css';
import logo from '../../assets/icon/Logo-GIF-crop.gif';
import { addUser } from '../../services/userManagementServices';
import { UpdateUserData } from '../../services/types/userManagement';
import { useNavigate } from 'react-router-dom';

// 个人资料设置组件
const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
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
      departmentId: '',
      departmentName: formData.department,
      googleId: '',
      gmail: formData.email,
      identity: 'NO_PERMISSION',
      position: formData.jobTitle,
      available: false,
      createId: '',
      createDate: new Date().toISOString(),
      modifyId: '',
      modifyDate: new Date().toISOString()
    };
  
    try {
      await addUser(newUser);
      navigate('/awaiting-approval');
    } catch (error) {
      console.error('添加用户失败:', error);
    }
  };

  return (
    <div className={styles.profileSetupBody}>
      <div className={styles.container}>
        <div className={styles.formHeader}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <h1>填写基本资料完成注册</h1>
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
            <label htmlFor="employee-id">员工编号</label>
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
              placeholder="登录自带@gmail.com放到这里"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="department">所属部门</label>
            <select
              id="department"
              name="department"
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              <option value="">您的所属部门</option>
              <option value="department1">部门1</option>
              <option value="department2">部门2</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="job-title">职位</label>
            <input
              type="text"
              id="job-title"
              name="job-title"
              required
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            />
          </div>
          <button type="submit" className={styles.submitButton}>提交</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
