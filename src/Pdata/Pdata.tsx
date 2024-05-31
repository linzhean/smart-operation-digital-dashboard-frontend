// Pdata.tsx
import React, { useState } from 'react';
import './Pdata.css';
import Edit from '../assets/icon/edit-icon.svg';

const Pdata: React.FC = () => {
  const [editable, setEditable] = useState(false);
  const [formData, setFormData] = useState({
    name: '林哲安',
    num: '11046048',
    email: '11046048@gmail.com',
    unit: '財務',
    role: '副理',
  });

  const handleEditClick = () => {
    setEditable(!editable);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('保存的数据:', formData);
    setEditable(false);
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
              <option>員工</option>
              <option>副理</option>
              <option>經理</option>
              <option>總經理</option>
            </select>
          </div>
          {/* 编辑按钮 */}
          <button type="button" id="editBtn" onClick={handleEditClick}>
            <img src={Edit} alt="編輯" />
          </button>
          {editable && (
            <button type="submit" className="btn btn-primary">
              保存
            </button>
          )}
        </form>
      </div>
    </main>
  );
};

export default Pdata;