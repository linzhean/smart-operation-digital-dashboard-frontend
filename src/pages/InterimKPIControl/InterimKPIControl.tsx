import React, { useState } from 'react';
import InterimKPIList from '../../component/InterimKPI/InterimKPIList';

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
