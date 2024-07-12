import { useState, useEffect } from 'react';
import { getUsers, admitUser, deleteUser, addUser } from '../services/userManagementServices';
import { fetchGroups, addGroup, deleteGroup } from '../services/GroupApi';
import { Group, User } from '../services/types/userManagement';

const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'charts'>('users');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState('home');
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getUsers(); // Changed from fetchUsers()
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const loadGroups = async () => {
      try {
        const data = await fetchGroups();
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    loadUsers();
    loadGroups();
  }, []);

  const addUserHandler = async (user: User) => {
    try {
      await addUser(user);
      setUsers((prevUsers) => [...prevUsers, user]);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const deleteUserHandler = async (userId: string) => {
    try {
      await deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const admitUserHandler = async (userId: string) => {
    try {
      await admitUser(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, admitted: true } : user
        )
      );
    } catch (error) {
      console.error('Error admitting user:', error);
    }
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleAddGroup = async (group: Omit<Group, 'id'>) => {
    try {
      const newGroup = await addGroup(group);
      setGroups((prevGroups) => [...prevGroups, newGroup]);
    } catch (error) {
      console.error('Error adding group:', error);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    try {
      await deleteGroup(groupId);
      setGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));
    } catch (error) {
      console.error('Error deleting group:', error);
    }
  };

  const handleSelectGroup = (groupId: number) => {
    setSelectedGroupId(groupId);
    // Load users of the selected group if needed
  };

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return {
    users,
    groups,
    modalIsOpen,
    activeTab,
    isDrawerOpen,
    selectedPage,
    isNavbarCollapsed,
    selectedGroupId,
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
  };
};

export default useUserManagement;
