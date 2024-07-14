import React, { useState } from 'react'; // 引入 useState 函數

import { Route, Routes, Navigate } from 'react-router';
import GroupManagementSidebar from '../../component/GroupManagement/GroupManagementSideBar';
import GroupList from '../../component/GroupManagement/GroupList';

const GroupManagement: React.FC = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<number>(0); // 使用 useState 定義狀態變量

  return (
    <div className='wrapper'>
      <GroupManagementSidebar onSelectGroup={setSelectedGroupId} />
      <div className="main_container">
        <div className="theContent">
          <Routes>
            {/* <Route path="userApply" element={<UserApplyTable />} /> */}
            <Route path="/GroupList" element={<GroupList groupId={selectedGroupId} />} />
            <Route path="/" element={<Navigate to="GroupList" />} />
            {/* <Route path="userStatus" element={<UserStatusControl />} /> */}
            {/* <Route path="userStatus" element={<NewForm />} /> */}
            {/* <Route path="/GroupList" element={<Navigate to="GroupList" />} /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default GroupManagement;
