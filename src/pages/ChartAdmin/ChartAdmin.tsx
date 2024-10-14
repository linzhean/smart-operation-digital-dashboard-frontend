import React from 'react';
import ChartAdminTable from '../../component/ChartAdmin/ChartAdminTable';

const ChartAdmin: React.FC = () => {

  return (
    <div className="wrapper">
      <div className="theContent" style={{ minWidth: '350px' }}>
        <ChartAdminTable />
      </div>
    </div>

  );
};


export default ChartAdmin;
