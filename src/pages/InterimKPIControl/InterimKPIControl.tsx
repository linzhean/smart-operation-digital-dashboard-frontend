import React from 'react';
import Table from '../../component/InterimKPIList/InterimKPIList';
import Sidebar from '../../component/InterimKPISidebar/InterimKPISidebar';

const InterimKPIControl: React.FC = () => {
  return (
    <>
      <Sidebar />
      <div className="main_container">
        <div className="theContent">
          <Table />
        </div></div>
    </>

  );
};

export default InterimKPIControl;
