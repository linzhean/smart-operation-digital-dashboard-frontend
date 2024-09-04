import React, { useState, useEffect } from 'react';
import styles from './ChartAdmin.module.css';
// import KPIDetails from '../../component/ChartAdmin/KPIDetails';
// import Sidebar from '../../component/ChartAdmin/ChartAdminSidebar';
import ChartAdminTable from '../../component/ChartAdmin/ChartAdminTable';

const ChartAdmin: React.FC = () => {


  return (
    <div className="wrapper">
      <div className="theContent">
        <ChartAdminTable />

      </div>
    </div>

  );
};


export default ChartAdmin;
