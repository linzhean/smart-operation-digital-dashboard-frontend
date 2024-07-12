import React from 'react';
import { Route, Routes, Navigate } from 'react-router';
import GroupManagementSidebar from '../../component/GroupManagement/GroupManagementSideBar'

const GroupManagement: React.FC = () => {

  return (

    <div className='wrapper'>
      <GroupManagementSidebar />
      <div className="main_container">
        <div className="theContent">
          <Routes>
            {/* <Route path="userApply" element={<UserApplyTable />} /> */}
            {/* <Route path="userStatus" element={<UserStatusControl />} /> */}
            {/* <Route path="userStatus" element={<NewForm />} /> */}
            {/* <Route path="*" element={<Navigate to="userApply" />} /> */}
          </Routes>
        </div>
      </div>
    </div>


  );
};

export default GroupManagement;
