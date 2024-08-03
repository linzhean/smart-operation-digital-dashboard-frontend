import React, { useEffect, useState } from 'react';
import closearrow from '../../assets/icon/close-arrow.svg';
import styles from './DashBoardSidebar.module.css';
import DashboardService from '../../services/DashboardService';
import { Dashboard } from '../../services/types/dashboard';
import more from '../../assets/icon/homeMore.svg'
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const DashboardSidebar: React.FC<{ onSelectDashboard: (dashboardId: string) => void }> = ({ onSelectDashboard }) => {
  const [isActive, setIsActive] = useState(false);
  const [isDisabled, setIsDisabled] = useState(window.innerWidth > 1024);
  const [activeDashboard, setActiveDashboard] = useState<string | null>(null);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsDisabled(window.innerWidth > 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchAllDashboards = async () => {
      try {
        const fetchedDashboards = await DashboardService.getAllDashboards();
        if (Array.isArray(fetchedDashboards)) {
          setDashboards(fetchedDashboards);
        } else {
          console.error('Fetched dashboards is not an array:', fetchedDashboards);
        }
      } catch (error) {
        console.error('Failed to fetch dashboards:', error);
      }
    };

    fetchAllDashboards();
  }, []);

  const toggleActiveState = () => {
    setIsActive(!isActive);
  };

  const handleDashboardClick = (dashboardId: string) => {
    setActiveDashboard(dashboardId);
    onSelectDashboard(dashboardId);
  };

  const handleAddDashboard = async () => {
    const newDashboardName = prompt('請輸入新儀表板名稱：');
    if (newDashboardName) {
      try {
        const newDashboard = await DashboardService.createDashboard({ name: newDashboardName });
        setDashboards(prevDashboards => [...prevDashboards, newDashboard]);
      } catch (error) {
        console.error('Failed to add dashboard:', error);
      }
    }
  };

  const handleDeleteDashboard = async (dashboardId: string) => {
    try {
      await DashboardService.deleteDashboard(dashboardId);
      setDashboards(prevDashboards => prevDashboards.filter(dashboard => dashboard.id !== dashboardId));
    } catch (error) {
      console.error('Failed to delete dashboard:', error);
      // 可以進一步處理錯誤，例如顯示用戶消息
    }
  };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isMenuOpen = Boolean(anchorEl);
  return (
    <div className={`${styles.wrapper} ${isActive ? styles.active : ''}`}>
      <div className={styles.sidebar}>
        <div className={styles.bg_shadow} onClick={() => setIsActive(false)}></div>
        <div className={styles.sidebar_inner}>
          <button className={styles.openbutton} onClick={toggleActiveState} disabled={isDisabled}></button>
          <div className={styles.close} onClick={() => setIsActive(false)}>
            <img src={closearrow} alt="Click to close sidebar" />
          </div>
          <ul className={`${styles.sidebar_menu} mostly-customized-scrollbar`}>
            <li>
              <button className={styles.addButton} onClick={handleAddDashboard}>
                新儀表板
              </button>
            </li>
            {dashboards.map(dashboard => (
              <li
                key={dashboard.id}
                className={`${styles.sidebartitle} ${activeDashboard === dashboard.id ? styles.active : ''}`}
                // className={`${styles.sidebartitle} ${styles.active}`}
                onClick={() => handleDashboardClick(dashboard.id)}
              >
                <span>
                  儀表板名稱{dashboard.name}
                </span>

                <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleMenuOpen}
                  className={styles.dropdownButton}
                >
                  <img src={more} alt="操作" />
                </IconButton>

                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={isMenuOpen}
                  onClose={handleMenuClose}
                  className={styles.dropdownMenu}
                >
                  <MenuItem onClick={() => { ; handleMenuClose(); }}>修改名稱</MenuItem>
                  <MenuItem onClick={() => { handleDeleteDashboard(dashboard.id); handleMenuClose(); }}>刪除</MenuItem>
                </Menu>
                {/* <button className={styles.moreButton} onClick={() => handleDeleteDashboard(dashboard.id)}>
                  <img src={more} alt="" />
                </button> */}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
