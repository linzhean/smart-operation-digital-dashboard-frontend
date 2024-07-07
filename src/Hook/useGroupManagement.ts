import { useState, useEffect } from 'react';
import { Group } from '../services/types/userManagement';
import { getGroups, addGroup as apiAddGroup, deleteGroup as apiDeleteGroup, editGroup as apiEditGroup, addGroup } from '../services/GroupApi';

const useGroupManagement = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const fetchedGroups = await getGroups();
      setGroups(fetchedGroups);
    } catch (error) {
      console.error('Error fetching groups:', error);
      // Handle error state or feedback
    }
  };

  const handleAddGroup = async (newGroup: Omit<Group, 'id'>) => {
    try {
      const message = await addGroup(newGroup);
      console.log(message);
      const updatedGroups = await getGroups();
      setGroups(updatedGroups);
    } catch (error) {
      console.error('添加群組失敗:', error);
      // 如果需要，處理錯誤狀態或反饋信息
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    try {
      const message = await apiDeleteGroup(groupId);
      console.log(message); // Optional: Log success message
      fetchGroups(); // Refresh groups after deleting
    } catch (error) {
      console.error('Error deleting group:', error);
      // Handle error state or feedback
    }
  };

  const handleEditGroup = async (editedGroup: Group) => {
    try {
      const message = await apiEditGroup(editedGroup);
      console.log(message); // Optional: Log success message
      fetchGroups(); // Refresh groups after editing
    } catch (error) {
      console.error('Error editing group:', error);
      // Handle error state or feedback
    }
  };

  const handleSelectGroup = (groupId: number) => {
    // Implement your logic for selecting a group
    console.log('Selected group:', groupId);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return {
    groups,
    isDrawerOpen,
    handleAddGroup,
    handleDeleteGroup,
    handleEditGroup,
    handleSelectGroup,
    toggleDrawer,
  };
};

export default useGroupManagement;
