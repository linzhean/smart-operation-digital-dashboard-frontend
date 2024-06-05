import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Pdata.css';
import Edit from '../assets/icon/edit-icon.svg';

const backendApiUrl = "http://140.131.115.153:8080";

const Pdata: React.FC = () => {
  const navigate = useNavigate();
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    name: '林哲安',
    num: '11046048',
    email: '11046048@gmail.com',
    unit: '財務',
    role: '副理',
  });
  const [error, setError] = useState<string>("");

  const handleEditClick = () => {
    setEditable(!editable);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('No auth token found');
      }

      const response = await fetch(`${backendApiUrl}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to validate data: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Data validated successfully:', data);

      navigate('/home'); // 验证成功后导航到主页
    } catch (error) {
      console.error('An error occurred during the validation request:', error);
      setError('An error occurred during the validation request. Please try again.');
    }
  };

  return (
    <main className="section">
      <div className="container">
        <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
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
              <span className="input-group-text" id="inputGroupAppend">@gmail.com</span>
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
          {error && <p className="error">{error}</p>}
          <div className="col-12">
            <button className="btn btn-primary" type="submit">提交</button>
            <button type="button" className="btn btn-secondary" onClick={handleEditClick}>
              <img src={Edit} alt="Edit" />
              {editable ? '取消編輯' : '編輯'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Pdata;
