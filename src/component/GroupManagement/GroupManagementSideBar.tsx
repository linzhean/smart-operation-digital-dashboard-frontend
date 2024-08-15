import React, { useEffect, useState } from 'react';
import closearrow from '../../assets/icon/close-arrow.svg';
import styles from './GroupManagementSideBar.module.css';
import { fetchGroups, addGroup, updateGroupName } from '../../services/GroupApi';
import { Group } from '../../services/types/userManagement';
import editIcon from '../../assets/icon/edit-black.svg';
import newGroup from '../../assets/icon/newGroup.svg';
import rename from '../../assets/icon/rename.svg';

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
    if (!newGroupName) return;
    try {
      const newGroup = await addGroup({
        name: newGroupName,
        createDate: '',
        modifyDate: '',
      });
  
      setGroups(prevGroups => [...prevGroups, newGroup]);
      setNewGroupName('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('新增群组失败:', error);
    }
  };

  const handleUpdateGroupName = (groupId: number) => {
    setSelectedGroupId(groupId);
    setIsUpdateModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    if (updatedGroupName && selectedGroupId !== null) {
      try {
        const updatedGroup = await updateGroupName(selectedGroupId, updatedGroupName);
        setGroups(prevGroups =>
          prevGroups.map(group => (group.id === updatedGroup.id ? updatedGroup : group))
        );
        setIsUpdateModalOpen(false);
        setUpdatedGroupName('');
      } catch (error) {
        console.error('更新群组名称失败:', error);
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
            <img src={closearrow} alt="关闭侧边栏" />
          </div>
          <ul className={`${styles.sidebar_menu} mostly-customized-scrollbar`}>
            <li>
              <button className={styles.addButton} onClick={() => setIsModalOpen(true)}>
                新增群组
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
              <li>暂无群组</li>
            )}
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddGroup}
          title="新增群组"
          icon={newGroup}
          value={newGroupName}
          onChange={e => setNewGroupName(e.target.value)}
          placeholder="请输入群组名称"
        />
      )}

      {isUpdateModalOpen && (
        <Modal
          onClose={() => setIsUpdateModalOpen(false)}
          onSubmit={handleConfirmUpdate}
          title="更新群组名称"
          icon={rename}
          value={updatedGroupName}
          onChange={e => setUpdatedGroupName(e.target.value)}
          placeholder="请输入新的群组名称"
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
          <img src={icon} className={styles.icon} alt="" />
        </div>
        <h2>{title}</h2>
        <button onClick={onClose} className={styles.closeModal}>X</button>
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <div>
          <button onClick={onSubmit} className={styles.modalSubmit}>
            <span>确定</span>
          </button>
        </div>
      </div>
    </div>
  </>
);

export default GroupManagementSidebar;
