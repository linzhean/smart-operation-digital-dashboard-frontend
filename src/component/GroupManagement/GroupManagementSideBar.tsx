import React, { useEffect, useState } from 'react';
import closearrow from '../../assets/icon/close-arrow.svg';
import styles from './GroupManagementSideBar.module.css';
import { fetchGroups, addGroup, deleteGroup, updateGroupName } from '../../services/GroupApi';
import { Group } from '../../services/types/userManagement';

interface SidebarProps {
  onSelectGroup: (groupId: number) => void;
}

const GroupManagementSidebar: React.FC<SidebarProps> = ({ onSelectGroup }) => {
  const [isActive, setIsActive] = useState(false);
  const [isDisabled, setIsDisabled] = useState(window.innerWidth > 1024);
  const [activeGroup, setActiveGroup] = useState<number | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState<string>('');

  useEffect(() => {
    const handleResize = () => {
      setIsDisabled(window.innerWidth > 1024);
    };

    window.addEventListener('resize', handleResize);

    const fetchGroupData = async () => {
      try {
        const fetchedGroups = await fetchGroups();
        setGroups(fetchedGroups);
      } catch (error) {
        console.error('获取群组信息失败:', error);
      }
    };

    fetchGroupData();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleGroupClick = (groupId: number) => {
    setActiveGroup(groupId);
    onSelectGroup(groupId);
  };

  const handleAddGroup = async () => {
    try {
      const newGroup = await addGroup({
        name: newGroupName,
        createDate: '',
        modifyDate: '',
      });

      setGroups((prevGroups) => [...prevGroups, newGroup]);
      setNewGroupName('');
    } catch (error) {
      console.error('新增群组失败:', error);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    if (window.confirm('确认删除该群组吗？')) {
      try {
        await deleteGroup(groupId);
        setGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));
        if (activeGroup === groupId) {
          setActiveGroup(null);
          onSelectGroup(0);
        }
      } catch (error) {
        console.error('删除群组失败:', error);
      }
    }
  };

  const handleUpdateGroupName = async (groupId: number) => {
    const newName = prompt('请输入新的群组名称：');
    if (newName) {
      try {
        const updatedGroup = await updateGroupName(groupId, newName);
        setGroups((prevGroups) =>
          prevGroups.map((group) => (group.id === updatedGroup.id ? updatedGroup : group))
        );
      } catch (error) {
        console.error('更新群组名称失败:', error);
      }
    }
  };

  const toggleActiveState = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.bg_shadow} onClick={() => setIsActive(false)}></div>
      <div className={styles.sidebar_inner}>
        <button
          className={styles.openbutton}
          onClick={toggleActiveState}
          disabled={isDisabled}
        ></button>
        <div className={styles.close} onClick={() => setIsActive(false)}>
          <img src={closearrow} alt="点击关闭侧边栏" />
        </div>
        <ul className={`${styles.sidebar_menu} mostly-customized-scrollbar`}>
          <li>
            <button className={styles.addButton} onClick={handleAddGroup}>
              新增群组
            </button>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="输入群组名称"
              className={styles.newGroupNameInput}
            />
          </li>
          {groups.length > 0 ? (
            groups.map((group) => (
              <li
                key={group.id}
                className={`${styles.sidebartitle} ${activeGroup === group.id ? styles.active : ''}`}
              >
                <span onClick={() => handleGroupClick(group.id)}>
                  {group.name}
                </span>
                <button className={styles.deleteButton} onClick={() => handleDeleteGroup(group.id)}>
                  删除
                </button>
                <button className={styles.updateButton} onClick={() => handleUpdateGroupName(group.id)}>
                  修改名称
                </button>
              </li>
            ))
          ) : (
            <li>暂无群组</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default GroupManagementSidebar;
