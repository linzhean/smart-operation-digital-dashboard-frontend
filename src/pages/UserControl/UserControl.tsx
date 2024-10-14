import React from 'react';
import UserStatusControl from '../../component/UserControl/UserStatusControl';
import UserControlSidebar from '../../component/UserControl/UserControlSidebar';
import UserApplyTable from '../../component/UserControl/UserApplyTable';
import { UserStatusProvider } from '../../context/UserStatusContext';
import { Route, Routes, Navigate } from 'react-router';

const UserControl: React.FC = () => {
  return (
    <UserStatusProvider>
      <div className='wrapper'>
        <UserControlSidebar />
        <div className="main_container">
          <div className="theContent">
            <Routes>
              <Route path="userApply" element={<UserApplyTable />} />
              <Route path="userStatus" element={<UserStatusControl />} />
              <Route path="*" element={<Navigate to="userApply" />} />
            </Routes>
          </div>
        </div>
      </div>
    </UserStatusProvider>
  );
};

export default UserControl;
