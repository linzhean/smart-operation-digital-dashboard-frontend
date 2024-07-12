import React from 'react';
import AdminDrawerNavigation from '../../Admin/AdminDrawerNavigation';
import AdminNavbar from '../../Admin/AdminNavbar';
import useGroupManagement from '../../../Hook/useGroupManagement';
import UserList from '../User/UserList';

const GroupManagement: React.FC = () => {
  const {
    groups,
    isDrawerOpen,
    addGroup,
    deleteGroup,
    selectGroup,
    toggleDrawer,
    addUserToGroup,
    selectedGroupId,
  } = useGroupManagement();

  const handleAddGroup = async () => {
    try {
      await addGroup({
        name: '新群組',
        available: true,
        createId: 'admin',
        createDate: new Date().toISOString(),
        modifyId: '',
        modifyDate: null,
      });
    } catch (error) {
      console.error('無法新增群組:', error);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    try {
      await deleteGroup(groupId);
    } catch (error) {
      console.error('無法刪除群組:', error);
    }
  };

  const handleSelectGroup = (groupId: number) => {
    console.log('選擇的群組ID:', groupId);
    selectGroup(groupId);
  };

  return (
    <div className="group-management">
      <h2>群組管理</h2>
      <AdminNavbar
        selectedPage={'group'}
        selectPage={(page: string) => {}}
        isNavbarCollapsed={false}
        toggleNavbar={() => {}}
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
      <UserList addUserToGroup={addUserToGroup} selectedGroupId={selectedGroupId} />
    </div>
  );
};

export default GroupManagement;
