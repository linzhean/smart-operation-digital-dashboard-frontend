// AdminPage.tsx
import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../component/Admin/AdminNavbar';
import AdminDrawerNavigation from '../../component/Admin/AdminDrawerNavigation';
import { Group } from '../../services/types/userManagement';
import { getGroups, addGroup, deleteGroup } from '../../services/GroupApi';

const AdminPage = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const fetchedGroups = await getGroups();
      setGroups(fetchedGroups);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  };

  const handleAddGroup = async () => {
    try {
      const newGroup: Group = {
        id: 0,
        name: 'New Group',
        available: true,
        createId: 'admin',
        createDate: new Date().toISOString(),
        modifyId: '',
        modifyDate: null
      };
      await addGroup(newGroup);
      loadGroups();
    } catch (error) {
      console.error('Failed to add group:', error);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    try {
      await deleteGroup(groupId);
      loadGroups();
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };

  const handleSelectGroup = (groupId: number) => {
    console.log('Selected Group ID:', groupId);
    // You can implement further actions here, like loading users for the selected group
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="admin-page">
      <AdminNavbar 
        selectedPage={''} 
        selectPage={(page: string) => {}} 
        isNavbarCollapsed={false} 
        toggleNavbar={() => {}} 
        toggleDrawer={toggleDrawer} 
      />
      <AdminDrawerNavigation
        groups={groups}
        onAddGroup={handleAddGroup}
        onDeleteGroup={handleDeleteGroup}
        isOpen={isOpen}
        toggleDrawer={toggleDrawer}
        onSelectGroup={handleSelectGroup}
      />
      {/* Other content */}
    </div>
  );
};

export default AdminPage;
