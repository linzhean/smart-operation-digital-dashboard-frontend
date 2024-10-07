import React from 'react';
import Profile from '../../component/PersonalData/PersonalData'
import LoginHistory from '../../component/PersonalData/LoginHistory'
import PdataSidebar from '../../component/PersonalData/PdataSidebar'
import { Route, Routes, Navigate } from 'react-router';

const Pdata: React.FC = () => {

  return (
    <div className="theContent" style={{ overflow: 'hidden' }}>
      <Profile />
    </div>
  );
};

export default Pdata;