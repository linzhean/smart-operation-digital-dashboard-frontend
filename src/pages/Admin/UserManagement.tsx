import React from 'react';
import AdminDrawerNavigation from '../../component/Admin/AdminDrawerNavigation';
import AdminNavbar from '../../component/Admin/AdminNavbar';
import UserTable from '../../component/Admin/User/UserTable';
import UserForm from '../../component/Admin/User/UserForm';
import UserChart from '../../component/Admin/Chart/UserChart';
import Modal from 'react-modal';
import '../../styles/Admin/userManagement.css';
import useUserManagement from '../../Hook/useUserManagement';

Modal.setAppElement('#root');

const UserManagement: React.FC = () => {
  const {
    users,
    groups,
    modalIsOpen,
    activeTab,
    isDrawerOpen,
    selectedPage,
    isNavbarCollapsed,
    addUserHandler,
    deleteUserHandler,
    admitUserHandler,
    openModal,
    closeModal,
    handleAddGroup,
    handleDeleteGroup,
    handleSelectGroup,
    toggleDrawer,
    setActiveTab,
    setSelectedPage,
    setIsNavbarCollapsed,
  } = useUserManagement();

  const renderContent = () => {
    switch (selectedPage) {
      case 'home':
        return (
          <div className="user-management-content">
            <h2>User Management</h2>
            <AdminNavbar
              selectedPage={selectedPage}
              selectPage={setSelectedPage}
              isNavbarCollapsed={isNavbarCollapsed}
              toggleNavbar={() => setIsNavbarCollapsed(!isNavbarCollapsed)}
              toggleDrawer={toggleDrawer}
            />
            <AdminDrawerNavigation
              groups={groups}
              onAddGroup={handleAddGroup}
              onDeleteGroup={handleDeleteGroup}
              isOpen={isDrawerOpen}
              toggleDrawer={toggleDrawer}
              onSelectGroup={handleSelectGroup}
            />
            <div className="content">
              <div className="tabs">
                <button
                  className={activeTab === 'users' ? 'active' : ''}
                  onClick={() => setActiveTab('users')}
                >
                  Users
                </button>
                <button
                  className={activeTab === 'charts' ? 'active' : ''}
                  onClick={() => setActiveTab('charts')}
                >
                  Charts
                </button>
              </div>
              {activeTab === 'users' && (
                <div className="tab-content">
                  <button onClick={openModal}>Add User</button>
                  <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                    <UserForm addUser={addUserHandler} />
                  </Modal>
                  <UserTable
                    users={users}
                    deleteUser={deleteUserHandler}
                    admitUser={admitUserHandler}
                    onAddUserToGroup={() => {}} // 根据需要传递添加用户到群组的逻辑
                  />
                </div>
              )}
              {activeTab === 'charts' && (
                <div className="tab-content">
                  <UserChart />
                </div>
              )}
            </div>
          </div>
        );
      default:
        return <div>Page not found</div>;
    }
  };

  return <div>{renderContent()}</div>;
};

export default UserManagement;
