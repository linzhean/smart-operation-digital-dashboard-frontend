import React from 'react';
import '../../../styles/Admin/userTable.css';

interface User {
    id: string;
    department: string;
    name: string;
    email: string;
    position: string;
}

interface UserTableProps {
    users: User[];
    deleteUser: (id: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, deleteUser }) => {
    return (
        <table className="user-table">
            <thead>
                <tr>
                    <th>帳號(工號)</th>
                    <th>所屬部門</th>
                    <th>姓名</th>
                    <th>gmail</th>
                    <th>職務</th>
                    <th>移除</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.department}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.position}</td>
                        <td>
                            <button onClick={() => deleteUser(user.id)} className="delete-button">移除</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UserTable;
