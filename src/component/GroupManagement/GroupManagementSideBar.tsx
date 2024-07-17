import React, { useEffect, useState } from 'react';
import closearrow from '../../assets/icon/close-arrow.svg';
import styles from '../GroupManagement/GroupManagementSideBar.module.css';
import { fetchGroups, addGroup } from '../../services/GroupApi';
import { Group } from '../../services/types/userManagement';

const Sidebar: React.FC<{ onSelectGroup: (groupId: number) => void }> = ({ onSelectGroup }) => {
  const [isActive, setIsActive] = useState(false);
  const [isDisabled, setIsDisabled] = useState(window.innerWidth > 1024);
  const [activeGroup, setActiveGroup] = useState<number | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsDisabled(window.innerWidth > 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchAllGroups = async () => {
      try {
        const fetchedGroups = await fetchGroups();
        setGroups(fetchedGroups);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
      }
    };

    fetchAllGroups();
  }, []);

  const toggleActiveState = () => {
    setIsActive(!isActive);
  };

  const handleGroupClick = (groupId: number) => {
    setActiveGroup(groupId);
    onSelectGroup(groupId); // 更新主組件中的選中群組狀態
  };

  const handleAddGroup = async () => {
    const newGroupName = prompt('请输入新群组名称：');
    if (newGroupName) {
      try {
        const newGroup = await addGroup({
          name: newGroupName,
          available: false,
          createId: '',
          createDate: '',
          modifyId: '',
          modifyDate: null
        });
        setGroups(prevGroups => [...prevGroups, newGroup]);
      } catch (error) {
        console.error('Failed to add group:', error);
      }
    }
  };

  return (
    <div className={`${styles.wrapper} ${isActive ? styles.active : ''}`}>
      <div className={styles.sidebar}>
        <div className={styles.bg_shadow} onClick={() => setIsActive(false)}></div>
        <div className={styles.sidebar_inner}>

          <button
            className={styles.openbutton}
            onClick={toggleActiveState}
            disabled={isDisabled}
          ></button>

          <div className={styles.close} onClick={() => setIsActive(false)}>
            <img src={closearrow} alt="Click to close sidebar" />
          </div>

          <ul className={`${styles.sidebar_menu} mostly-customized-scrollbar`}>

            <li>
              <button className={styles.addButton} onClick={handleAddGroup}>
                新增群组
              </button>
            </li>

            {groups.map((group) => (
              <li
                key={group.id}
                className={`${styles.sidebartitle} ${activeGroup === group.id ? styles.active : ''}`}
                onClick={() => handleGroupClick(group.id)}
              >
                {group.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
