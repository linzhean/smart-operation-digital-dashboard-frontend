import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router';
import GroupManagementSidebar from '../../component/GroupManagement/GroupManagementSideBar';
import GroupList from '../../component/GroupManagement/GroupList';
import styles from './GroupManagement.module.css';

const GroupManagement: React.FC = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<number>(0);
  const [activeButton, setActiveButton] = useState<string>('memberControl');

  const handleButtonClick = (buttonId: string) => {
    setActiveButton(buttonId);
  };

  const handleDeleteGroup = (groupId: number) => {
  };

  return (
    <div className="wrapper">
      <GroupManagementSidebar
        onSelectGroup={setSelectedGroupId}
        groupId={selectedGroupId}
        activeButton={activeButton}
        handleButtonClick={handleButtonClick}
      />
      <div className={styles.sideBar250_container}>
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
