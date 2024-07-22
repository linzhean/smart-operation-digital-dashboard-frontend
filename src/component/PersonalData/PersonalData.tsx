import React from 'react';
import styles from './PersonalData.module.css';
import { useUserContext } from '../../context/UserContext';
import { updateUserData } from '../../services/Pdata';
import { useNavigate } from 'react-router-dom';

const Pdata: React.FC = () => {
  const { state, dispatch } = useUserContext();
  const navigate = useNavigate();

  const handleEditClick = () => {
    dispatch({ type: 'SET_EDITABLE', payload: !state.editable });
  };

  const handleInputChange = (id: string, value: string) => {
    dispatch({ type: 'UPDATE_FORM_DATA', payload: { id, value } });
  };

  const handleSaveClick = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await updateUserData(state.formData);
      dispatch({ type: 'SET_EDITABLE', payload: false });
    } catch (error) {
      console.error('Error updating user data:', error);
      alert('Failed to update user data. Please try again.');
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
                  {state.editable ? "保存變更" : "修改資料"}
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
              <label htmlFor="userName" className={styles.formLabel}>姓名</label>
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
              <label htmlFor="userId" className={styles.formLabel}>員工編號</label>
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
              <label htmlFor="gmail" className={styles.formLabel}>信箱 (Gmail)</label>
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
              <label htmlFor="departmentName" className={styles.formLabel}>所屬部門</label>
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
              <label htmlFor="position" className={styles.formLabel}>職稱</label>
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
                <option value="manager">經理</option>
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
