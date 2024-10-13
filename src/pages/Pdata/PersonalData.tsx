import React from 'react';
import Profile from '../../component/PersonalData/PersonalData'

const Pdata: React.FC = () => {

  return (
    <div className="theContent" style={{ overflow: 'hidden' }}>
      <Profile />
    </div>
  );
};

export default Pdata;