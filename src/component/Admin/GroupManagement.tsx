import React from 'react';
import AdminDrawerNavigation from '../../component/Admin/AdminDrawerNavigation';
import { Group } from '../../services/types/userManagement';
import useGroupManagement from '../../Hook/useGroupManagement';

const GroupManagement: React.FC = () => {
  const { groups, isDrawerOpen, handleAddGroup, handleDeleteGroup, handleSelectGroup, toggleDrawer } = useGroupManagement();

  return (
    <div className="group-management-container">
      <AdminDrawerNavigation
         groups={groups}
         onAddGroup={(newGroup: Omit<Group, 'id'>) => handleAddGroup(newGroup)}
         onDeleteGroup={handleDeleteGroup}
         isOpen={isDrawerOpen}
         toggleDrawer={toggleDrawer}
         onSelectGroup={handleSelectGroup}
      />
      {/* 可以添加其他组件或内容 */}
    </div>
  );
};

export default GroupManagement;
