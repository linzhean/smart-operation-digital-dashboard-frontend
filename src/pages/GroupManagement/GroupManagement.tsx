import React from 'react';
import { Route, Routes, Navigate } from 'react-router';
import GroupManagementSidebar from '../../component/GroupManagement/GroupManagementSideBar'
import GroupList from '../../component/GroupManagement/GroupList';

const GroupManagement: React.FC = () => {

  return (

    <div className='wrapper'>
      <GroupManagementSidebar />
      <div className="main_container">
        <div className="theContent">
          <Routes>
            {/* <Route path="userApply" element={<UserApplyTable />} /> */}
            <Route path="GroupList" element={<GroupList />} />
            <Route path="/" element={<Navigate to="GroupList" />} />
            {/* <Route path="userStatus" element={<UserStatusControl />} /> */}
            {/* <Route path="userStatus" element={<NewForm />} /> */}
            {/* <Route path="/GroupList" element={<Navigate to="GroupList" />} /> */}
          </Routes>
        </div>
      </div>
    </div>


  );
};

export default GroupManagement;
