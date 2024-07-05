import React, { useEffect } from 'react';
import AssignExportControlList from '../../component/AssignExportControl/AssignExportControl';

const AssignExportControl: React.FC = () => {
  return (
    <div>
      <main>
        <div className='theContent'>
          <AssignExportControlList />
        </div>
      </main>
    </div>
  );
};

export default AssignExportControl;
