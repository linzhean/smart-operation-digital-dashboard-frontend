import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import InterimKPIList from '../../component/InterimKPI/InterimKPIList';

const InterimKPIControl: React.FC = () => {
  const { status } = useParams<{ status: string }>();
  const [selectedStatus, setSelectedStatus] = useState<string>(status || '正在啓用');

  useEffect(() => {
    if (status) {
      setSelectedStatus(status);
    }
  }, [status]);

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
