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
      <InterimKPIList selectedStatus={selectedStatus} onStatusChange={handleStatusChange} />
    </>
  );
};

export default InterimKPIControl;
