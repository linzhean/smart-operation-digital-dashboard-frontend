import React, { useState, useEffect } from 'react';
import styles from './ChartAdmin.module.css';
import ChartList from '../../component/ChartAdmin/ChartList';

const ChartAdmin: React.FC = () => {
  // const navigate = useNavigate();
  // const location = useLocation();
  // const [activeButton, setActiveButton] = useState<string>('KpiSetting');

  // useEffect(() => {
  //   if (location.pathname === '/TaskKpiSetting' || location.pathname === '/TaskKpiSetting/') {
  //     navigate('kpi');
  //   }
  // }, [location.pathname, navigate]);

  // // 按鈕點擊事件
  // const handleButtonClick = (buttonId: string) => {
  //   setActiveButton(buttonId);
  //   if (buttonId === 'TaskCheck') {
  //     navigate('task');
  //   } else if (buttonId === 'KpiSetting') {
  //     navigate('kpi');
  //   }
  // };

  return (
    <div>
      <div className="theContent">
        <div className={styles.filterButton}>
          <ChartList />
        </div>
      </div>
    </div >
  );
};

export default ChartAdmin;
