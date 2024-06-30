import React, { useState } from 'react';

interface UserFormProps {
    addUser: (user: any) => void;
}

const UserForm: React.FC<UserFormProps> = ({ addUser }) => {
    const [user, setUser] = useState({ id: '', department: '', name: '', email: '', position: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addUser(user);
        setUser({ id: '', department: '', name: '', email: '', position: '' });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="id" value={user.id} onChange={handleChange} placeholder="帳號(工號)" required />
            <input type="text" name="department" value={user.department} onChange={handleChange} placeholder="所屬部門" required />
            <input type="text" name="name" value={user.name} onChange={handleChange} placeholder="姓名" required />
            <input type="email" name="email" value={user.email} onChange={handleChange} placeholder="gmail" required />
            <input type="text" name="position" value={user.position} onChange={handleChange} placeholder="職務" required />
            <button type="submit">新增使用者</button>
        </form>
    );
};

export default UserForm;
