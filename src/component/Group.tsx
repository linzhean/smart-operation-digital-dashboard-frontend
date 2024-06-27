import React from 'react';

interface User {
  username: string;
  department: string;
  name: string;
  gmail: string;
  position: string;
}

interface GroupProps {
  users: User[];
  addUser: () => void;
  deleteUser: (index: number) => void;
}

const Group: React.FC<GroupProps> = ({ users, addUser, deleteUser }) => {
  return (
    <div className="group">
      <button className="add-user-button" onClick={addUser}>新增用户</button>
      <div className="fields">
        <div className="field">賬號</div>
        <div className="field">所屬部門</div>
        <div className="field">姓名</div>
        <div className="field">Gmail</div>
        <div className="field">職務</div>
        <div className="field">移除</div>
      </div>
      {users.map(({ username, department, name, gmail, position }, index) => (
        <div className="fields" key={index}>
          <div className="field">{username}</div>
          <div className="field">{department}</div>
          <div className="field">{name}</div>
          <div className="field">{gmail}</div>
          <div className="field">{position}</div>
          <button className="delete-user-button" onClick={() => deleteUser(index)}>移除</button>
        </div>
      ))}
    </div>
  );
};

export default Group;
