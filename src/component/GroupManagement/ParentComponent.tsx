import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import UserPickerDialog from './memberControlUserPicker';
import { User } from '../../services/types/userManagement';
import { addUserToGroup, fetchGroups } from '../../services/GroupApi';
import { getAllUsers } from '../../services/userManagementServices';
import GroupManagementSidebar from './GroupManagementSideBar';
import GroupList from './GroupList';

const ParentComponent: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Unable to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmitUsers = async (selectedUsers: User[]) => {
    setSelectedUsers(selectedUsers);
    try {
      const addUserPromises = selectedUsers.map(user =>
        addUserToGroup({ userId: user.userId, groupId: selectedGroupId })
      );
      await Promise.all(addUserPromises);
      console.log('Users successfully added to the group');
    } catch (error:any) {
      console.error('Failed to add users to the group:', error.message);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    // Logic to delete group
    console.log('Group deleted:', groupId);
  };

  return (
    <div>
      <GroupManagementSidebar onSelectGroup={(groupId) => setSelectedGroupId(groupId)} groupId={0} activeButton={''} handleButtonClick={function (buttonId: string): void {
        throw new Error('Function not implemented.');
      } } />
      <GroupList
        groupId={selectedGroupId}
        activeButton='memberControl'
        handleButtonClick={() => {}}
        onDeleteGroup={handleDeleteGroup}
      />
      <Button variant="contained" color="primary" onClick={handleOpenDialog}>
        新增成員
      </Button>
      <UserPickerDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitUsers}
        groupId={selectedGroupId}
        users={users}
        selectedUsers={selectedUsers}
        onAddSelectedMembers={handleSubmitUsers}
      />
    </div>
  );
};

export default ParentComponent;
