import React, { useState } from 'react';
import { Group } from '../../services/types/userManagement';
import '../../styles/Admin/adminDrawerNavigation.css';

interface AdminDrawerNavigationProps {
  groups: Group[];
  onAddGroup: (newGroup: Omit<Group, 'id'>) => void;
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

  const handleGroupSelection = (groupId: number) => {
    onSelectGroup(groupId);
    setSelectedGroupId(groupId);
  };

  if (!Array.isArray(groups)) {
    console.error('Expected groups to be an array, but got:', groups);
    return null; // Or handle the error in another way
  }

  const handleAddGroup = () => {
    const groupName = prompt('请输入群组名称:');
    if (groupName) {
      onAddGroup({
        name: groupName,
        available: true,
        createId: 'admin',
        createDate: new Date().toISOString(),
        modifyId: 'admin',
        modifyDate: null,
      });
    }
  };

  return (
    <div className={`admin-drawer-navigation ${isOpen ? 'open' : 'closed'}`}>
      <div className="admin-drawer-content">
        <h3>群組管理</h3>
        <ul>
          {groups.map((group) => (
            <li
              key={group.id}
              onClick={() => handleGroupSelection(group.id)}
              className={group.id === selectedGroupId ? 'active' : ''}
            >
              <span>{group.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteGroup(group.id);
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <button onClick={handleAddGroup}>添加群组</button>
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
