import React, { useState, useEffect } from 'react';
import styles from '../styles/Pdata.module.css';
import Edit from '../assets/icon/edit-icon.svg';
import { fetchUserData, updateUserData } from '../services/api/Pdata';

const Pdata: React.FC = () => {
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    num: '',
    email: '',
    unit: '',
    role: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await fetchUserData();
        setFormData(data);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleEditClick = () => {
    setEditable(!editable);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSaveClick = async () => {
    setLoading(true);
    try {
      await updateUserData(formData);
      setEditable(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className={styles.section}>
      <div className={styles.container}>
        <form className="row g-3 needs-validation" noValidate>
          <legend></legend>
          <div className="col-md-12 listTitle">
            您的個人資料
          </div>
          <div className="col-md-6">
            <label htmlFor="validationName" className="form-label">姓名</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={formData.name}
              required
              disabled={!editable}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-6"></div>
          <div className="col-md-6">
            <label htmlFor="validationNum" className="form-label">工號</label>
            <input
              type="text"
              className="form-control"
              id="num"
              value={formData.num}
              required
              disabled={!editable}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="validationEmail" className="form-label">信箱<span id="gmail">(Gmail)</span></label>
            <div className="input-group has-validation">
              <input
                type="text"
                className="form-control"
                id="email"
                aria-describedby="inputGroupAppend"
                value={formData.email}
                disabled={!editable}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="col-md-6">
            <label htmlFor="validationUnit" className="form-label">所屬部門</label>
            <select
              className="form-select"
              id="unit"
              required
              disabled={!editable}
              value={formData.unit}
              onChange={handleInputChange}
            >
              <option value="">...</option>
              <option>銷售</option>
              <option>生產</option>
              <option>財務</option>
              <option>審計</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="validationRole" className="form-label">職稱</label>
            <select
              className="form-select"
              id="role"
              required
              disabled={!editable}
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="">...</option>
              <option>一般員工</option>
              <option>副理</option>
              <option>經理</option>
            </select>
          </div>
          <div className="col-12">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={editable ? handleSaveClick : handleEditClick}
            >
              <img src={Edit} alt="Edit" />
              {editable ? '保存' : '編輯'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Pdata;
