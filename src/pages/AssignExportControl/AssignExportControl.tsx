import React, { useState, useEffect } from 'react';
import styles from './AssignExportControl.module.css';
import { Route, Routes, useNavigate, Navigate, useLocation } from 'react-router-dom';
import Assign from '../../component/AssignExportControl/AssignControl';
import Export from '../../component/AssignExportControl/ExportControl';

const AssignExportControl: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState<string>('AssignPermission');

  useEffect(() => {
    if (location.pathname === '/AssignExportControl' || location.pathname === '/AssignExportControl/') {
      navigate('assign');
    }
  }, [location.pathname, navigate]);

  // 按鈕點擊事件
  const handleButtonClick = (buttonId: string) => {
    setActiveButton(buttonId);
    if (buttonId === 'ExportPermission') {
      navigate('export');
    } else if (buttonId === 'AssignPermission') {
      navigate('assign');
    }
  };

  return (
    <div>
      <div className="theContent">
        <div className={styles.filterButton}>
          {/* 匯出權限管理按鈕 */}
          <button
            id="ExportPermission"
            onClick={() => handleButtonClick('ExportPermission')}
            className={activeButton === 'ExportPermission' ? styles.filterActive : ''}
          >
            匯出權限管理
            {/* 裝飾不要刪 */}
            <span></span><span></span><span></span><span></span>
          </button>

          {/* 交辦權限管理按鈕 */}
          <button
            id="AssignPermission"
            onClick={() => handleButtonClick('AssignPermission')}
            className={activeButton === 'AssignPermission' ? styles.filterActive : ''}
          >
            交辦權限管理
            {/* 裝飾別刪 */}
            <span></span><span></span><span></span><span></span>
          </button>
        </div>

        <Routes>
          <Route path="export" element={<Export />} />
          <Route path="assign" element={<Assign />} />
          <Route path="*" element={<Navigate to="export" />} />
        </Routes>
      </div>
    </div>
  );
};

export default AssignExportControl;
