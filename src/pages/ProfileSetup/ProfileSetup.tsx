import React, { useEffect, useState } from 'react';
import styles from './ProfileSetup.module.css';
import logo from '../../assets/icon/Logo-GIF-crop.gif';
import { updateUser } from '../../services/userManagementServices';
import { fetchDropdownData } from '../../services/dropdownServices';
import { UpdateUserData } from '../../services/types/userManagement';
import { useNavigate } from 'react-router-dom';

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    email: '',
    department: '',
    jobTitle: '',
    identity: ''
  });
  const [departments, setDepartments] = useState<{ value: string; label: string }[]>([]);
  const [identities, setIdentities] = useState<{ value: string; label: string }[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const dropdownData = await fetchDropdownData();
        setDepartments(dropdownData.departments || []);
        setIdentities(dropdownData.identities || []);
      } catch (error) {
        console.error('Failed to load dropdown data:', error);
      }
    };

    loadDropdownData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newUser: UpdateUserData = {
      userId: formData.employeeId,
      userName: formData.name,
      departmentId: '',
      departmentName: formData.department,
      googleId: '',
      gmail: formData.email,
      identity: formData.identity,
      position: formData.jobTitle,
      available: false,
      createId: '',
      createDate: new Date().toISOString(),
      modifyId: '',
      modifyDate: new Date().toISOString()
    };

    try {
      await updateUser('', newUser);
      navigate('/awaiting-approval');
    } catch (error) {
      console.error('Failed to add user:', error);
      setError('Submission failed, please try again.');
    }
  };

  return (
    <div className={styles.profileSetupBody}>
      <div className={styles.container}>
        <div className={styles.formHeader}>
          <img src={logo} alt="Logo" className={styles.logo} />
          <h1>填寫資料以完成註冊</h1>
        </div>
        <form onSubmit={handleSubmit} className={styles.setupForm}>
          {error && <div className={styles.errorMsg}>{error}</div>}
          <div className={styles.formGroup}>
            <label htmlFor="name">姓名</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="employeeId">員工編號</label>
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              required
              value={formData.employeeId}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">信箱</label>
            <input
              type="email"
              id="email"
              name="email"
              readOnly
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="department">所屬部門</label>
            <div className={styles.select}>
              <select
                id="department"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">選擇您的部門</option>
                {departments.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="jobTitle">職位</label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              required
              value={formData.jobTitle}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="identity">身份</label>
            <div className={styles.select}>
              <select
                id="identity"
                name="identity"
                required
                value={formData.identity}
                onChange={handleChange}
              >
                <option value="">選擇你的身份</option>
                {identities.map((identity) => (
                  <option key={identity.value} value={identity.value}>
                    {identity.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className={styles.setupSubmit}>提交</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
