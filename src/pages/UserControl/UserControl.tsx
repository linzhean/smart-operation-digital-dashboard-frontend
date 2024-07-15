import React from 'react';
import UserStatusControl from '../../component/UserControl/UserStatusControl'
import UserControlSidebar from '../../component/UserControl/UserControlSidebar'
import UserApplyTable from '../../component/UserControl/UserApplyTable';
import { Route, Routes, Navigate } from 'react-router';
import NewForm from '../../component/UserControl/NewForm';

const UserControl: React.FC = () => {

  return (
    <div className='wrapper'>
      <UserControlSidebar />
      <div className="main_container">
        <div className="theContent">
          <Routes>
            <Route path="userApply" element={<UserApplyTable />} />
            <Route path="userStatus" element={<UserStatusControl />} />
            {/* <Route path="userStatus" element={<NewForm />} /> */}
            <Route path="*" element={<Navigate to="userApply" />} />
          </Routes>
        </div>
      </div>
    </div>


  );
};

export default UserControl;