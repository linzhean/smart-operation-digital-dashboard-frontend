import React from 'react';
import styles from '../styles/Pdata.module.css';
import EditIcon from '../assets/icon/edit-icon.svg';
import { useUserContext } from '../context/UserContext';
import { fetchUserData, updateUserData } from '../services/Pdata'; // 更新为新的API服务路径

const Pdata: React.FC = () => {
  const { state, dispatch } = useUserContext();

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
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  if (state.loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className={styles.section}>
      <div className={styles.container}>
        <form className="row g-3 needs-validation" noValidate>
          <legend>您的個人資料</legend>
          <div className="col-md-6">
            <label htmlFor="userName" className="form-label">姓名</label>
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
          <div className="col-md-6">
            <label htmlFor="userId" className="form-label">工號</label>
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
          <div className="col-md-6">
            <label htmlFor="gmail" className="form-label">信箱 (Gmail)</label>
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
          <div className="col-md-6">
            <label htmlFor="departmentName" className="form-label">所屬部門</label>
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
          <div className="col-md-6">
            <label htmlFor="position" className="form-label">職稱</label>
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
          <div className="col-12">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={state.editable ? handleSaveClick : handleEditClick}
            >
              <img src={EditIcon} alt="Edit" />
              {state.editable ? '保存' : '編輯'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Pdata;
