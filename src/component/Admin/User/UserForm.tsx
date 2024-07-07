import React, { useState } from 'react';
import { User } from '../../../services/types/userManagement';
import '../../../styles/Admin/userForm.css';

interface UserFormProps {
  addUser: (user: User) => void;
}

const UserForm: React.FC<UserFormProps> = ({ addUser }) => {
  const [user, setUser] = useState<User>({ id: '', department: '', name: '', position: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUser(user);
    setUser({ id: '', department: '', name: '', position: '' });
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="部門"
        value={user.department}
        onChange={(e) => setUser({ ...user, department: e.target.value })}
      />
      <input
        type="text"
        placeholder="姓名"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="職位"
        value={user.position}
        onChange={(e) => setUser({ ...user, position: e.target.value })}
      />
      <button type="submit">新增使用者</button>
    </form>
  );
};

export default UserForm;
