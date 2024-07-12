import React, { useEffect } from 'react';
import AdminNavbar from '../../component/Admin/AdminNavbar';
import AdminDrawerNavigation from '../../component/Admin/AdminDrawerNavigation';
import useGroupManagement from '../../Hook/useGroupManagement'; // Assuming you have defined useGroupManagement correctly
import { getGroups } from '../../services/userManagementServices'; // Import getGroups correctly

const AdminPage: React.FC = () => {
  const { groups, isDrawerOpen, addGroup, deleteGroup, selectGroup, toggleDrawer } = useGroupManagement();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const fetchedGroups = await getGroups();
      console.log('Fetched groups:', fetchedGroups); // Handle fetchedGroups as needed
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  };

  const handleAddGroup = async () => {
    try {
      await addGroup({
        name: 'New Group', available: true, createId: 'admin', createDate: new Date().toISOString(),
        modifyId: '',
        modifyDate: null
      });
    } catch (error) {
      console.error('Failed to add group:', error);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    try {
      await deleteGroup(groupId);
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };

  const handleSelectGroup = (groupId: number) => {
    console.log('Selected Group ID:', groupId);
    selectGroup(groupId);
  };

  return (
    <div className="admin-page">
      <AdminNavbar
        selectedPage=""
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
      {/* Other content */}
    </div>
  );
};

export default AdminPage;
