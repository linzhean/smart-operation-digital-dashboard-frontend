import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router';
import GroupManagementSidebar from '../../component/GroupManagement/GroupManagementSideBar';
import GroupList from '../../component/GroupManagement/GroupList';
import styles from './GroupManagement.module.css';

const GroupManagement: React.FC = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<number>(0);
  const [activeButton, setActiveButton] = useState<string>('memberControl'); // Default to 'memberControl'

  const handleButtonClick = (buttonId: string) => {
    setActiveButton(buttonId);
  };

  const handleDeleteGroup = (groupId: number) => {
    // Implement group deletion logic if necessary
  };

  return (
    <div className="wrapper">
      <GroupManagementSidebar
        onSelectGroup={setSelectedGroupId} // Update the selected group ID
        groupId={selectedGroupId} // Pass the selected group ID to the sidebar
        activeButton={''} handleButtonClick={function (buttonId: string): void {
          throw new Error('Function not implemented.');
        }} />
      <div className="main_container">
        <div className="theContent">
          <Routes>
            <Route
              path="/GroupList"
              element={
                <GroupList
                  groupId={selectedGroupId}
                  activeButton={activeButton}
                  handleButtonClick={handleButtonClick}
                  onDeleteGroup={handleDeleteGroup}
                />
              }
            />
            <Route path="/" element={<Navigate to="GroupList" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default GroupManagement;
