import React, { useEffect, useState } from 'react';
import styles from './ProfileSetup.module.css';
import logo from '../../assets/icon/Logo-GIF-crop.gif';
import { getUser, updateUser } from '../../services/userManagementServices';
import { fetchDropdownData } from '../../services/dropdownServices';
import { UserData } from '../../services/types/userManagement';
import { useNavigate } from 'react-router-dom';

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    jobNumber: '',
    department: '',
    jobTitle: '',
    identity: ''
  });
  const [departments, setDepartments] = useState<{ value: string; label: string }[]>([]);
  const [identities, setIdentities] = useState<{ value: string; label: string }[]>([]);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await getUser();
        console.log('獲取到的用戶:', user);

        if (user && user.id) {
          setUserId(user.id.toString());
          console.log('用戶 ID 設置為:', user.id);
        } else {
          setError('找不到用戶或用戶ID缺失。');
        }
      } catch (error) {
        console.error('無法獲取用戶ID:', error);
        setError('加載用戶信息失敗，請稍後再試。');
      }
    };

    fetchUserId();
  }, []);


  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const departmentData = await fetchDropdownData('department');
        setDepartments(departmentData);

        const identityData = await fetchDropdownData('identity');
        setIdentities(identityData);
      } catch (error) {
        console.error('無法加載下拉數據:', error);
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

    if (!userId) {
      setError('用戶ID缺失。');
      console.log('錯誤: 用戶 ID 缺失');
      return;
    }

    const newUser: UserData = {
      userId,
      userName: formData.name,
      departmentId: formData.department,
      departmentName: departments.find(dept => dept.value === formData.department)?.label || '',
      position: formData.jobTitle,
      jobNumber: formData.jobNumber,
    };

    try {
      console.log('提交用戶數據:', newUser);
      await updateUser(userId, newUser);
      navigate('/awaiting-approval');
    } catch (error) {
      console.error('更新用戶失敗:', error);
      setError('提交失敗，請重試。');
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
            <label htmlFor="jobNumber">員工編號</label>
            <input
              type="text"
              id="jobNumber"
              name="jobNumber"
              required
              value={formData.jobNumber}
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
          <button type="submit" className={styles.setupSubmit}>提交</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
