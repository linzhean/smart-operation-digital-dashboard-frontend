import React, { useEffect, useState } from 'react';
import styles from './PersonalData.module.css';
import { useUserContext } from '../../context/UserContext';
import { fetchUserData, updateUserData } from '../../services/Pdata';
import { UpdateUserData } from '../../services/types/userManagement';
import apiClient from '../../services/axiosConfig';
import { useNavigate } from 'react-router-dom';

const Pdata: React.FC = () => {
  const { state, dispatch } = useUserContext();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<UpdateUserData | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        // Fetch user data from /user-account
        const userData = await fetchUserData();

        // Check if the fetched userData has the correct structure
        const formattedData: UpdateUserData = {
          userId: userData.userId || '',
          userName: userData.userName || '',
          departmentId: userData.departmentId || '',
          departmentName: userData.departmentName || '',
          googleId: userData.googleId || '',
          gmail: userData.gmail || '',
          identity: userData.identity || '',
          position: userData.position || '',
          available: userData.available === true,
          createId: userData.createId || '',
          createDate: userData.createDate || '',
          modifyId: userData.modifyId || '',
          modifyDate: userData.modifyDate || ''
        };

        dispatch({ type: 'SET_FORM_DATA', payload: formattedData });
        setInitialData(formattedData);

        // Fetch full user list from /user-account/list
        const response = await apiClient.get('/user-account/list');
        console.log('User list:', response.data); // Assuming you want to log the user list
        // You can further process the user list if needed
      } catch (error) {
        console.error('加载用户数据时出错:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadUserData();
  }, [dispatch]);

  const handleEditClick = () => {
    dispatch({ type: 'SET_EDITABLE', payload: !state.editable });
  };

  const handleInputChange = (id: string, value: string) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: { id, value } });
  };

  const handleSaveClick = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await updateUserData(state.formData as UpdateUserData);
      dispatch({ type: 'SET_EDITABLE', payload: false });
      alert('用户数据更新成功！');
    } catch (error) {
      console.error('更新用户数据时出错:', error);
      alert('无法更新用户数据，请重试。');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <main className={styles.section}>
      <div className={styles.container}>
        <form className={`needs-validation ${styles.profileSide}`} noValidate>
          <div className={styles.legendContainer}>
            <legend className={styles.legend}>您的個人資料</legend>
            <div className={styles.theButtonGroup}>
              <div className={styles.theEditButton}>
                <button
                  type="button"
                  className={`btn ${styles.btn}`}
                  onClick={state.editable ? handleSaveClick : handleEditClick}
                >
                  {state.editable ? '保存變更' : '修改資料'}
                </button>
              </div>
              {!state.editable && (
                <div className={styles.logoutContainer}>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleLogoutClick}
                  >
                    <span className={styles.letter}>登出</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label htmlFor="userName" className={styles.formLabel}>
                姓名
              </label>
              <input
                type="text"
                className="form-control"
                id="userName"
                value={state.formData.userName}
                required
                disabled={!state.editable}
                onChange={(e) => handleInputChange(e.target.id, e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label htmlFor="userId" className={styles.formLabel}>
                員工編號
              </label>
              <input
                type="text"
                className="form-control"
                id="userId"
                value={state.formData.userId}
                required
                disabled={!state.editable}
                onChange={(e) => handleInputChange(e.target.id, e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label htmlFor="gmail" className={styles.formLabel}>
                信箱 (Gmail)
              </label>
              <input
                type="text"
                className="form-control"
                id="gmail"
                value={state.formData.gmail}
                required
                disabled={!state.editable}
                onChange={(e) => handleInputChange(e.target.id, e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label htmlFor="departmentName" className={styles.formLabel}>
                所屬部門
              </label>
              <select
                className="form-select"
                id="departmentName"
                required
                disabled={!state.editable}
                value={state.formData.departmentName}
                onChange={(e) => handleInputChange(e.target.id, e.target.value)}
              >
                <option value="">...</option>
                <option value="sales">銷售</option>
                <option value="production">生產</option>
                <option value="finance">財務</option>
                <option value="audit">審計</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label htmlFor="position" className={styles.formLabel}>
                職稱
              </label>
              <select
                className="form-select"
                id="position"
                required
                disabled={!state.editable}
                value={state.formData.position}
                onChange={(e) => handleInputChange(e.target.id, e.target.value)}
              >
                <option value="">...</option>
                <option value="employee">一般員工</option>
                <option value="assistant-manager">副理</option>
                <option value="manager">經理

                </option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label htmlFor="identity" className={styles.formLabel}>身份</label>
              <select
                className="form-select"
                id="identity"
                required
                disabled={!state.editable}
                value={state.formData.identity}
                onChange={(e) => handleInputChange(e.target.id, e.target.value)}
              >
                <option value="NO_PERMISSION">無權限</option>
                <option value="EMPLOYEE">員工</option>
                <option value="MANAGER">經理</option>
                <option value="ADMIN">管理員</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Pdata;
