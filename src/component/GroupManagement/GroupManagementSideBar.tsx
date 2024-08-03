import React, { useEffect, useState } from 'react';
import closearrow from '../../assets/icon/close-arrow.svg';
import styles from './GroupManagementSideBar.module.css';
import { fetchGroups, addGroup, updateGroupName } from '../../services/GroupApi';
import { Group } from '../../services/types/userManagement';
import editIcon from '../../assets/icon/edit-black.svg';
import newGroup from '../../assets/icon/newGroup.svg'
interface SidebarProps {
  onSelectGroup: (groupId: number) => void;
  groupId: number;
  activeButton: string;
  handleButtonClick: (buttonId: string) => void;
}

const GroupManagementSidebar: React.FC<SidebarProps> = ({ onSelectGroup, groupId }) => {
  const [isActive, setIsActive] = useState(false);
  const [isDisabled, setIsDisabled] = useState(window.innerWidth > 1024);
  const [activeGroup, setActiveGroup] = useState<number | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        console.error('獲取群組信息失敗:', error);
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
    if (!newGroupName) return;
    try {
      const newGroup = await addGroup({
        name: newGroupName,
        createDate: '',
        modifyDate: '',
      });

      setGroups((prevGroups) => [...prevGroups, newGroup]);
      setNewGroupName('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('新增群組失敗:', error);
    }
  };

  const handleUpdateGroupName = async (groupId: number) => {
    const newName = prompt('請輸入新的群組名稱：');
    if (newName) {
      try {
        const updatedGroup = await updateGroupName(groupId, newName);
        setGroups((prevGroups) =>
          prevGroups.map((group) => (group.id === updatedGroup.id ? updatedGroup : group))
        );
      } catch (error) {
        console.error('更新群組名稱失敗:', error);
      }
    }
  };

  const toggleActiveState = () => {
    if (!isDisabled) {
      setIsActive(!isActive);
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
            <img src={closearrow} alt="關閉側邊欄" />
          </div>
          <ul className={`${styles.sidebar_menu} mostly-customized-scrollbar`}>
            <li>
              <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
                新增群组
              </button>
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
                  <button className={styles.editButton} onClick={() => handleUpdateGroupName(group.id)}>
                    <img src={editIcon} alt="" />
                  </button>
                </li>
              ))
            ) : (
              <li>暫無群組</li>
            )}
          </ul>
        </div>
      </div>

      {isModalOpen && (<>
        <div className={styles.overlay} onClick={() => setIsModalOpen(false)}></div>

        <div className={styles.modal}>
          <div className={styles.modalContent}>

            <div className={styles.circleIcon}>
              <img src={newGroup} alt="" />
            </div>

            <h2>新增群組</h2>
            <button onClick={() => setIsModalOpen(false)} className={styles.closeModal}>X</button>


            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="請輸入群組名稱"
            />

            <div>
              <button onClick={handleAddGroup} className={styles.modalSubmit}>
                <span>確定</span>
              </button>
            </div>

          </div>
        </div>

      </>
      )}
    </div>
  );
};

export default GroupManagementSidebar;
