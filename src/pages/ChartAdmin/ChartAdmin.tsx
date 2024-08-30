import React, { useState, useEffect } from 'react';
import styles from './ChartAdmin.module.css';
import KPIDetails from '../../component/ChartAdmin/KPIDetails';
import Sidebar from '../../component/ChartAdmin/ChartAdminSidebar';

const ChartAdmin: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedKPI, setSelectedKPI] = useState<string>('');

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleKPISelect = (kpi: string) => {
    setSelectedKPI(kpi);
  };

  return (
    <div className="wrapper">
      <Sidebar
        onStatusChange={handleStatusChange}
        selectedStatus={selectedStatus}
        onKPISelect={handleKPISelect}
      />
      <div className="main_container">
        <div className="theContent">
          {selectedKPI && <KPIDetails selectedKPI={selectedKPI} />}
        </div>
      </div>
    </div>
  );
};


export default ChartAdmin;
