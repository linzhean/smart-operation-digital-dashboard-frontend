import React, { useEffect, useState, useCallback } from 'react';
import closearrow from '../../assets/icon/close-arrow.svg';
import styles from './GroupManagementSideBar.module.css';
import { fetchGroups, addGroup, updateGroupName } from '../../services/GroupApi';
import { Group } from '../../services/types/userManagement';
import editIcon from '../../assets/icon/edit-black.svg';
import newGroup from '../../assets/icon/newGroup.png';
import rename from '../../assets/icon/rename.png';
import closeX from '../../assets/icon/X.svg'
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
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [updatedGroupName, setUpdatedGroupName] = useState<string>('');

  useEffect(() => {
    const handleResize = () => {
      setIsDisabled(window.innerWidth > 1024);
    };

    window.addEventListener('resize', handleResize);

    fetchGroupsData();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchGroupsData = useCallback(async () => {
    try {
      const fetchedGroups = await fetchGroups();
      setGroups(fetchedGroups);
      
      // 自動選取第一個群組
      if (fetchedGroups.length > 0) {
        const firstGroupId = fetchedGroups[0].id;
        setActiveGroup(firstGroupId);
        onSelectGroup(firstGroupId);
      }
    } catch (error) {
      console.error('獲取群組訊息失敗:', error);
    }
  }, [onSelectGroup]);

  const handleGroupClick = (groupId: number) => {
    setActiveGroup(groupId);
    onSelectGroup(groupId);
  };

  const handleAddGroup = async () => {
    if (!newGroupName) return;
    try {
      await addGroup({
        name: newGroupName,
        createDate: '',
        modifyDate: '',
      });
      setNewGroupName('');
      setIsModalOpen(false);
      fetchGroupsData();
    } catch (error) {
      console.error('新增群組失敗:', error);
    }
  };

  const handleUpdateGroupName = (groupId: number) => {
    setSelectedGroupId(groupId);
    setIsUpdateModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    if (updatedGroupName && selectedGroupId !== null) {
      try {
        await updateGroupName(selectedGroupId, updatedGroupName);
        setUpdatedGroupName('');
        setIsUpdateModalOpen(false);
        fetchGroupsData();
      } catch (error) {
        console.error('編輯群組名稱失敗:', error);
      }
    }
  };

  const toggleActiveState = () => {
    if (!isDisabled) {
      setIsActive(prev => !prev);
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
                新增群組
              </button>
            </li>
            {groups.length > 0 ? (
              groups.map(group => (
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
              <li className={`${styles.noGroupMsg}`}>目前查無群組</li>
            )}
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddGroup}
          title="新增群組"
          icon={newGroup}
          value={newGroupName}
          onChange={e => setNewGroupName(e.target.value)}
          placeholder="請輸入群組名稱"
        />
      )}

      {isUpdateModalOpen && (
        <Modal
          onClose={() => setIsUpdateModalOpen(false)}
          onSubmit={handleConfirmUpdate}
          title="編輯群組名稱"
          icon={rename}
          value={updatedGroupName}
          onChange={e => setUpdatedGroupName(e.target.value)}
          placeholder="請輸入新的群組名稱"
        />
      )}
    </div>
  );
};

interface ModalProps {
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  icon: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const Modal: React.FC<ModalProps> = ({ onClose, onSubmit, title, icon, value, onChange, placeholder }) => (
  <>
    <div className={styles.overlay} onClick={onClose}></div>
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.circleIcon}>
          <img src={icon} className={styles.theIcon} alt="" />
        </div>
        <h2>{title}</h2>
        <button onClick={onClose} className={styles.closeModal}>
          <img src={closeX} alt="關閉" />
        </button>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <div>
          <button onClick={onSubmit} className={styles.modalSubmit}>
            <span>確定</span>
          </button>
        </div>
      </div>
    </div>
  </>
);

export default GroupManagementSidebar;
