import React, { useState, useEffect } from 'react';
import styles from './TaskKpiSetting.module.css';
import { Route, Routes, useNavigate, Navigate, useLocation } from 'react-router-dom';
import KpiSetting from '../../component/TaskKpiSetting/KpiSetting';
import TaskCheck from '../../component/TaskKpiSetting/TaskCheck';

const TaskKpiSetting: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeButton, setActiveButton] = useState<string>('KpiSetting');

  useEffect(() => {
    if (location.pathname === '/TaskKpiSetting' || location.pathname === '/TaskKpiSetting/') {
      navigate('kpi');
    }
  }, [location.pathname, navigate]);

  // 按鈕點擊事件
  const handleButtonClick = (buttonId: string) => {
    setActiveButton(buttonId);
    if (buttonId === 'TaskCheck') {
      navigate('task');
    } else if (buttonId === 'KpiSetting') {
      navigate('kpi');
    }
  };

  return (
    <div>
      <div className="theContent">
        <div className={styles.filterButton}>
          {/* KPI 設定按鈕 */}
          <button
            id="KpiSetting"
            onClick={() => handleButtonClick('KpiSetting')}
            className={activeButton === 'KpiSetting' ? styles.filterActive : ''}
          >
            KPI 設定
            {/* 裝飾不要刪!!!!! */}
            <span></span><span></span><span></span><span></span>
          </button>

          {/* 任務檢查按鈕 */}
          <button
            id="TaskCheck"
            onClick={() => handleButtonClick('TaskCheck')}
            className={activeButton === 'TaskCheck' ? styles.filterActive : ''}
          >
            任務檢查
            {/* 裝飾別刪!!!!!!! */}
            <span></span><span></span><span></span><span></span>
          </button>
        </div>

        <Routes>
          <Route path="kpi" element={<KpiSetting />} />
          <Route path="task" element={<TaskCheck />} />
          <Route path="*" element={<Navigate to="kpi" />} />
        </Routes>
      </div>
    </div>
  );
};

export default TaskKpiSetting;
