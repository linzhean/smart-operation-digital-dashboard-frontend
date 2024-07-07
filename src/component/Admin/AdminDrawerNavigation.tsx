import React, { useState } from 'react';
import { Group } from '../../services/types/userManagement';
import '../../styles/Admin/adminDrawerNavigation.css';

interface AdminDrawerNavigationProps {
  groups: Group[];
  onAddGroup: (newGroup: Omit<Group, 'id'>) => void; // 更新這裡的類型
  onDeleteGroup: (groupId: number) => void;
  isOpen: boolean;
  toggleDrawer: () => void;
  onSelectGroup: (groupId: number) => void;
}

const AdminDrawerNavigation: React.FC<AdminDrawerNavigationProps> = ({
  groups,
  onAddGroup,
  onDeleteGroup,
  isOpen,
  toggleDrawer,
  onSelectGroup,
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  if (!Array.isArray(groups)) {
    console.error('Expected groups to be an array, but got:', groups);
    return null; // Or handle the error in another way
  }

  return (
    <div className={`admin-drawer-navigation ${isOpen ? 'open' : 'closed'}`}>
      <div className="admin-drawer-content">
        <h3>群組管理</h3>
        <ul>
          {groups.map((group) => (
            <li
              key={group.id}
              onClick={() => {
                onSelectGroup(group.id);
                setSelectedGroupId(group.id); // Set the selected group id
              }}
              className={group.id === selectedGroupId ? 'active' : ''}
            >
              <span>{group.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteGroup(group.id);
                }}
              >
                刪除
              </button>
            </li>
          ))}
        </ul>
        <button onClick={(e) => onAddGroup({
          name: '',
          available: false,
          createId: '',
          createDate: '',
          modifyId: '',
          modifyDate: null
        })}>添加群組</button>
      </div>
      <div className="admin-drawer-toggle" onClick={toggleDrawer}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export default AdminDrawerNavigation;
