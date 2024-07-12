import { useState, useEffect } from 'react';
import { Group, User } from '../services/types/userManagement';
import { 
  fetchGroups, 
  addGroup, 
  deleteGroup, 
  addUserToGroup,
  fetchUsersByGroupId 
} from '../services/GroupApi';

const useGroupManagement = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchGroupsData = async () => {
      try {
        const fetchedGroups = await fetchGroups();
        setGroups(fetchedGroups);
      } catch (error) {
        console.error('無法獲取群組:', error);
      }
    };

    fetchGroupsData();
  }, []);

  const handleAddGroup = async (group: Omit<Group, 'id'>) => {
    try {
      const newGroup = await addGroup(group);
      setGroups([...groups, newGroup]);
    } catch (error) {
      console.error('無法新增群組:', error);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    try {
      await deleteGroup(groupId);
      setGroups(groups.filter(group => group.id !== groupId));
    } catch (error) {
      console.error('無法刪除群組:', error);
    }
  };

  const handleSelectGroup = async (groupId: number) => {
    setSelectedGroupId(groupId);
    try {
      const fetchedUsers = await fetchUsersByGroupId(groupId);
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('無法獲取所選群組的用戶:', error);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return {
    groups,
    isDrawerOpen,
    addGroup: handleAddGroup,
    deleteGroup: handleDeleteGroup,
    selectGroup: handleSelectGroup,
    toggleDrawer,
    addUserToGroup,
    users,
    selectedGroupId,
  };
};

export default useGroupManagement;
