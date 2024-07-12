import React from 'react';
import AdminDrawerNavigation from '../../component/Admin/AdminDrawerNavigation';
import AdminNavbar from '../../component/Admin/AdminNavbar';
import UserTable from '../../component/Admin/User/UserTable';
import UserList from '../../component/Admin/User/UserList';
import UserChart from '../../component/Admin/Chart/UserChart';
import Modal from 'react-modal';
import '../../styles/Admin/userManagement.css';
import useUserManagement from '../../Hook/useUserManagement';
import { addUserToGroup } from '../../services/GroupApi';

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
    selectedGroupId, // 確保 selectedGroupId 被正確解構
  } = useUserManagement();

  const handleDeleteUserFromGroup = (userId: string) => {
    console.log(`Deleting user ${userId} from group`);
  };

  const renderContent = () => {
    switch (selectedPage) {
      case 'home':
        return (
          <div className="user-management-content">
            <h2>用戶管理</h2>
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
              onSelectGroup={handleSelectGroup}
              isOpen={isDrawerOpen}
              toggleDrawer={toggleDrawer}
            />
            <div className="content">
              <div className="tabs">
                <button
                  className={activeTab === 'users' ? 'active' : ''}
                  onClick={() => setActiveTab('users')}
                >
                  用戶
                </button>
                <button
                  className={activeTab === 'charts' ? 'active' : ''}
                  onClick={() => setActiveTab('charts')}
                >
                  圖表
                </button>
              </div>
              {activeTab === 'users' && (
                <div className="tab-content">
                  <button onClick={openModal}>添加用戶</button>
                  <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
                    <UserList addUserToGroup={addUserToGroup} selectedGroupId={selectedGroupId} /> {/* 確認使用 */}
                  </Modal>
                  <UserTable
                    users={users}
                    deleteUser={deleteUserHandler}
                    admitUser={admitUserHandler}
                    onDeleteUserFromGroup={handleDeleteUserFromGroup}
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
        return <div>頁面未找到</div>;
    }
  };

  return <div>{renderContent()}</div>;
};

export default UserManagement;
