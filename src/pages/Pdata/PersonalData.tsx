import React from 'react';
import Profile from '../../component/PersonalData/PersonalData'
import LoginHistory from '../../component/PersonalData/LoginHistory'
import PdataSidebar from '../../component/PersonalData/PdataSidebar'
import { Route, Routes, Navigate } from 'react-router';

const Pdata: React.FC = () => {

  return (
    <div className='wrapper'>
      <PdataSidebar />
      <div className="main_container">
        <div className="theContent">
          <Routes>
            <Route path="profile" element={<Profile />} />
            <Route path="loginHistory" element={<LoginHistory />} />
            <Route path="*" element={<Navigate to="profile" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Pdata;