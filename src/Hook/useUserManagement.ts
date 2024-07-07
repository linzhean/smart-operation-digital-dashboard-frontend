import { useState, useEffect } from 'react';
import { getUsers, addUser, deleteUser, admitUser, getUsersByDepartmentAndName } from '../services/userManagementServices';
import { getUsersByGroupId, addGroup, deleteGroup, getGroups, addUserToGroup } from '../services/GroupApi';
import { Group, User } from '../services/types/userManagement';

const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [searchDepartment, setSearchDepartment] = useState('');
  const [searchName, setSearchName] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(undefined);
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState<boolean>(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [nowPage, setNowPage] = useState<number>(1);

  useEffect(() => {
    loadUsers();
    loadGroups();
  }, []);

  const loadUsers = async () => {
    try {
      if (selectedGroupId !== undefined) {
        await loadUsersByGroup(selectedGroupId);
      } else {
        const fetchedUsers = await getUsers();
        setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setUsers([]);
    }
  };

  const loadUsersByGroup = async (groupId: number) => {
    try {
      const usersByGroup = await getUsersByGroupId(groupId, {});
      setUsers(Array.isArray(usersByGroup) ? usersByGroup : []);
    } catch (error) {
      console.error('Failed to fetch users for selected group:', error);
    }
  };

  const loadGroups = async () => {
    try {
      const fetchedGroups = await getGroups();
      setGroups(Array.isArray(fetchedGroups) ? fetchedGroups : []);
    } catch (error) {
      console.error('Failed to load groups:', error);
      setGroups([]);
    }
  };

  const addUserHandler = async (user: User) => {
    try {
      await addUser(user);
      if (selectedGroupId !== undefined) {
        await addUserToGroup(user.id, selectedGroupId);
      }
      loadUsers();
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const deleteUserHandler = async (id: string) => {
    try {
      await deleteUser(id);
      loadUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const admitUserHandler = async (id: string) => {
    try {
      await admitUser(id);
      loadUsers();
    } catch (error) {
      console.error("Failed to admit user:", error);
    }
  };

  const handleSelectGroup = (groupId: number) => {
    setSelectedGroupId(groupId);
    loadUsersByGroup(groupId);
  };

  const handleSearch = async () => {
    try {
      const users = await getUsersByDepartmentAndName(searchDepartment, searchName, 1); // 這裡的 1 是示例中的頁碼，根據實際情況更換
      setUsers(Array.isArray(users) ? users : []);
    } catch (error) {
      console.error('Failed to search users:', error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
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
        modifyDate: null,
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
      if (selectedGroupId === groupId) {
        setSelectedGroupId(undefined);
        loadUsers();
      }
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return {
    users,
    groups,
    modalIsOpen,
    searchDepartment,
    searchName,
    activeTab,
    isDrawerOpen,
    selectedPage,
    selectedGroupId,
    isNavbarCollapsed,
    feedbackMessage,
    nowPage,
    addUserHandler,
    deleteUserHandler,
    admitUserHandler,
    handleSearch,
    openModal,
    closeModal,
    handleAddGroup,
    handleDeleteGroup,
    handleSelectGroup,
    toggleDrawer,
    setSearchDepartment,
    setSearchName,
    setActiveTab,
    setSelectedPage,
    setIsNavbarCollapsed,
    setFeedbackMessage,
    setNowPage
  };
};

export default useUserManagement;
