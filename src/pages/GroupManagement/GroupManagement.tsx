import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router';
import GroupManagementSidebar from '../../component/GroupManagement/GroupManagementSideBar';
import GroupList from '../../component/GroupManagement/GroupList';
import styles from './GroupManagement.module.css';

const GroupManagement: React.FC = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<number>(0);
  const [activeButton, setActiveButton] = useState<string>(''); // Manage activeButton state here

  const handleButtonClick = (buttonId: string) => {
    setActiveButton(buttonId);
  };

  return (
    <div className={styles.wrapper}>
      <GroupManagementSidebar onSelectGroup={setSelectedGroupId} />
      <div className={styles.main_container}>
        <div className={styles.theContent}>
          <Routes>
            <Route
              path="/GroupList"
              element={
                <GroupList
                  groupId={selectedGroupId}
                  activeButton={activeButton}
                  handleButtonClick={handleButtonClick}
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
