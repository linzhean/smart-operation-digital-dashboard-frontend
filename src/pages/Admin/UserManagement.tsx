import React, { useState } from 'react';
import AdminDrawerNavigation from '../../component/Admin/AdminDrawerNavigation';
import AdminNavbar from '../../component/Admin/AdminNavbar';
import UserTable from '../../component/Admin/User/UserTable';
import UserForm from '../../component/Admin/User/UserForm';
import Modal from 'react-modal';
import '../../styles/Admin/userManagement.css';

Modal.setAppElement('#root');

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState([
    { id: '11046050', department: '生產部門', name: '梁承恩', email: '123@gmail.com', position: '經理' },
    { id: '11046051', department: '銷售部門', name: '高婕', email: '456@gmail.com', position: '經理' },
    { id: '11046052', department: '物料部門', name: '林哲安', email: '789@gmail.com', position: '經理' }
  ]);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const addUser = (user: any) => {
    setUsers([...users, user]);
    setModalIsOpen(false);
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="admin-container">
      <AdminDrawerNavigation
        tabs={['生產團隊', '銷售團隊', '物料團隊']}
        onAddTab={() => {}}
        onDeleteTab={(index) => {}}
        isOpen={true}
        toggleDrawer={() => {}}
      />
      <div className="content">
        <AdminNavbar
            selectedPage="home"
            selectPage={() => {}}
            isNavbarCollapsed={true} // 根据实际情况传递
            toggleNavbar={() => {}} // 根据实际情况传递
            toggleDrawer={() => {}}
        />
        <div className="user-management">
          <button onClick={() => setModalIsOpen(true)} className="add-user-button">新增使用者</button>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            contentLabel="新增使用者"
            className="Modal"
            overlayClassName="Overlay"
          >
            <UserForm addUser={addUser} />
          </Modal>
          <UserTable users={users} deleteUser={deleteUser} />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
