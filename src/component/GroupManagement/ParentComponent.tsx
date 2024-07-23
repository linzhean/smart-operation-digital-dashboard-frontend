import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import UserPickerDialog from './memberControlUserPicker';
import { User } from '../../services/types/userManagement';
import { addUserToGroup } from '../../services/GroupApi';
import { getUsers } from '../../services/userManagementServices';
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
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (error: any) {
        console.error('Unable to fetch users:', error.message);
      }
    };

    fetchUsers();
  }, [selectedGroupId]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmitUsers = async (selectedUsers: User[]) => {
    console.log('Selected users:', selectedUsers);
    setSelectedUsers(selectedUsers);
    try {
      const addUserPromises = selectedUsers.map(user =>
        addUserToGroup({ userId: user.userId, groupId: selectedGroupId })
      );
      await Promise.all(addUserPromises);
      console.log('Users successfully added to the group');
    } catch (error: any) {
      console.error('Failed to add users to the group:', error.message);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    // Implement group deletion logic if necessary
  };

  return (
    <div>
      <GroupManagementSidebar onSelectGroup={handleDeleteGroup} groupId={0} activeButton={''} handleButtonClick={() => {}} />
      <Button variant="contained" color="primary" onClick={handleOpenDialog}>
        Select Users
      </Button>
      <UserPickerDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitUsers}
        selectedUsers={selectedUsers}
        groupId={selectedGroupId}
        onAddSelectedMembers={() => {}}
        users={users}
      />
      {selectedGroupId !== 0 && (
        <GroupList
          groupId={selectedGroupId}
          activeButton={''}
          handleButtonClick={() => {}}
          onDeleteGroup={handleDeleteGroup}
        />
      )}
    </div>
  );
};

export default ParentComponent;
