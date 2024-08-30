import React, { useEffect, useState } from 'react';
import closearrow from '../../assets/icon/close-arrow.svg';
import styles from './ChartAdminSidebar.module.css';
import { Collapse } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import NewChartForm from './newChartForm';



interface SidebarProps {
  onStatusChange: (status: string) => void;
  selectedStatus: string;
  onKPISelect: (kpi: string) => void;
}

const statusMap: { [key: string]: string } = {
  '啟用中': '0',
  '停用中': '1',
};

const Sidebar: React.FC<SidebarProps> = ({ onStatusChange, selectedStatus, onKPISelect }) => {

  // 以下新增圖表按鈕
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleFormSubmit = (chartName: string, chartCode: string, chartImage: string) => {
    console.log('新增圖表:', chartName, chartCode, chartImage);
    // 測試
  };

  // 以上新增圖表按鈕

  const [isActive, setIsActive] = useState(false);
  const [isDisabled, setIsDisabled] = useState(window.innerWidth > 1024);

  const [openStatus, setOpenStatus] = useState<{ [key: string]: boolean }>({
    '啟用中': false,
    '停用中': false,
  });

  const [kpiList, setKpiList] = useState<{ [key: string]: string[] }>({
    '啟用中': [],
    '停用中': [],
  });

  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDisabled(window.innerWidth > 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchKPIData = async () => {
      const data = {
        '啟用中': ['廢品率', '生產線效率', '訂單完成率'],
        '停用中': ['生產利用率', '停工時間'],
      };
      setKpiList(data);
    };

    fetchKPIData();
  }, []);

  const handleSidebarToggle = () => {
    if (!isDisabled) {
      setIsActive(!isActive);
    }
  };

  const handleMenuItemClick = (status: string) => {
    setOpenStatus((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
    onStatusChange(status);
  };

  // 控制高亮KPI
  const handleKPISelect = (kpi: string) => {
    setSelectedKPI(kpi);
    onKPISelect(kpi);
  };

  return (
    <>
      <div className={`${styles.wrapper} ${isActive ? styles.active : ''}`}>
        <div className={styles.sidebar}>
          <div className={styles.bg_shadow} onClick={() => setIsActive(false)}></div>
          <div className={styles.sidebar_inner}>
            <button
              className={styles.openbutton}
              onClick={handleSidebarToggle}
              disabled={isDisabled}
            ></button>
            <div className={styles.close} onClick={() => setIsActive(false)}>
              <img src={closearrow} alt="關閉側邊欄" />
            </div>
            <ul className={`${styles.siderbar_menu} mostly-customized-scrollbar`}>
              <button className={styles.addKPIButton} onClick={handleOpenForm}>
                新增圖表
              </button>

              {Object.keys(statusMap).map((status) => (
                <li key={status} className={openStatus[status] ? styles.active : ''}>
                  <a href="#" onClick={() => handleMenuItemClick(status)} className={styles.theAccordion}>
                    <div className={styles.title}>
                      {status}
                    </div>
                    <div className={styles.theArrowIcon}>{openStatus[status] ? <ExpandLess /> : <ExpandMore />}</div>
                  </a>

                  <Collapse in={openStatus[status]} timeout="auto" unmountOnExit>
                    <div className={styles.collapseContent}>
                      <ul>
                        {kpiList[status].map((kpi) => (
                          <li
                            key={kpi}
                            onClick={() => handleKPISelect(kpi)}
                            className={selectedKPI === kpi ? `${styles.activeKPI} ${styles.theKPIs}` : styles.theKPIs}
                          >
                            {kpi}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Collapse>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {
        isFormOpen && (
          <NewChartForm onSubmit={handleFormSubmit} onClose={handleCloseForm} />
        )
      }

    </>
  );
};

export default Sidebar;
