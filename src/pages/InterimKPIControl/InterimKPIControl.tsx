// InterimKPIControl.tsx
import React, { useState } from 'react';
import InterimKPIList from '../../component/InterimKPIList/InterimKPIList';
import Sidebar from '../../component/InterimKPISidebar/InterimKPISidebar';

const InterimKPIControl: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('啟用中');

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
  };

  return (
    <>
      <Sidebar onStatusChange={handleStatusChange} selectedStatus={selectedStatus} />
      <div className="main_container">
        <div className="theContent">
          <InterimKPIList selectedStatus={selectedStatus} onStatusChange={handleStatusChange} />
        </div>
      </div>
    </>
  );
};

export default InterimKPIControl;
