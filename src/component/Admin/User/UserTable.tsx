import React from 'react';
import { User } from '../../../services/types/userManagement';
import '../../../styles/Admin/userTable.css';

interface UserTableProps {
  users: User[];
  deleteUser: (id: string) => void;
  admitUser: (id: string) => void;
  groupId?: number;
  onAddUserToGroup: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, deleteUser, admitUser, groupId, onAddUserToGroup }) => {
  if (!Array.isArray(users)) {
    console.error('Expected users to be an array, but got:', users);
    return null;
  }

  return (
    <div className="user-table">
      <h3>群組用戶列表</h3>
      <table>
        <thead>
          <tr>
            <th>姓名</th>
            <th>部門</th>
            <th>職位</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.department}</td>
              <td>{user.position}</td>
              <td>
                <button onClick={() => admitUser(user.id)}>接受</button>
                <button onClick={() => deleteUser(user.id)}>刪除</button>
                {groupId && (
                  <button onClick={() => onAddUserToGroup(user.id)}>新增到群組</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
