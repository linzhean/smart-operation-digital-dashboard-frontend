import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router';
import GroupManagementSidebar from '../../component/GroupManagement/GroupManagementSideBar';
import GroupList from '../../component/GroupManagement/GroupList';

const GroupManagement: React.FC = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<number>(0);
  const [activeButton, setActiveButton] = useState<string>(''); // Manage activeButton state here

  const handleButtonClick = (buttonId: string) => {
    setActiveButton(buttonId);
  };

  return (
    <div className="wrapper">
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
