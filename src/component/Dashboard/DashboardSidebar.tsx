import React, { useState, useEffect, useCallback } from 'react';
import closearrow from '../../assets/icon/close-arrow.svg';
import styles from './DashBoardSidebar.module.css';
import DashboardService from '../../services/DashboardService';
import { Dashboard } from '../../services/types/dashboard';
import more from '../../assets/icon/homeMore.svg';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MultiStepForm from './dashBoardForm';

const DashboardSidebar: React.FC<{ onSelectDashboard: (dashboardId: string) => void, currentUserId: string }> = ({ onSelectDashboard, currentUserId }) => {
  const [isActive, setIsActive] = useState(false);
  const [isDisabled, setIsDisabled] = useState(window.innerWidth > 1024);
  const [activeDashboard, setActiveDashboard] = useState<string | null>(null);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [editingDashboardId, setEditingDashboardId] = useState<string | null>(null);
  const [newDashboardName, setNewDashboardName] = useState<string>('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardDescription, setDashboardDescription] = useState('');
  const [showMultiStepForm, setShowMultiStepForm] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsDisabled(window.innerWidth > 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fetch dashboards
  const fetchAllDashboards = useCallback(async () => {
    try {
      const fetchedDashboards = await DashboardService.getAllDashboards();
      setDashboards(fetchedDashboards);
    } catch (error) {
      console.error('Failed to fetch dashboards:', error);
    }
  }, []);

  useEffect(() => {
    fetchAllDashboards();
  }, [fetchAllDashboards]);

  const toggleActiveState = () => {
    setIsActive(prev => !prev);
  };

  const handleDashboardClick = (dashboardId: string) => {
    setActiveDashboard(dashboardId);
    onSelectDashboard(dashboardId);
  };

  const handleAddDashboardOpen = () => {
    setShowMultiStepForm(true);
  };

  const closeForm = () => {
    setShowMultiStepForm(false);
  };

  // Update dashboard description
  const updateDashboardDescription = useCallback(async (dashboardId: string, newDescription: string) => {
    try {
      await DashboardService.patchDashboard(dashboardId, { description: newDescription });
      setDashboards(prevDashboards =>
        prevDashboards.map(dashboard =>
          dashboard.id === dashboardId ? { ...dashboard, description: newDescription } : dashboard
        )
      );
    } catch (error) {
      console.error('Failed to update dashboard description:', error);
    }
  }, []);

  // Edit description
  const handleEditDescription = useCallback((dashboardId: string, currentDescription: string) => {
    const newDescription = prompt('請輸入儀表板說明文字（非必填）：', currentDescription);
    if (newDescription !== null) {
      updateDashboardDescription(dashboardId, newDescription);
    }
  }, [updateDashboardDescription]);

  // Add dashboard
  const handleAddDashboardSubmit = useCallback(async () => {
    if (dashboardName) {
      try {
        await DashboardService.createDashboard({ name: dashboardName, description: dashboardDescription });
        fetchAllDashboards(); // Refresh the dashboard list
        handleAddDashboardClose();
      } catch (error) {
        console.error('Failed to add dashboard:', error);
      }
    }
  }, [dashboardName, dashboardDescription, fetchAllDashboards]);

  const handleAddDashboardClose = () => {
    setOpenDialog(false);
    setDashboardName('');
    setDashboardDescription('');
  };

  // Delete dashboard
  const handleDeleteDashboard = useCallback(async (dashboardId: string) => {
    try {
      await DashboardService.deleteDashboard(dashboardId);
      fetchAllDashboards(); // Refresh the dashboard list
    } catch (error) {
      console.error('Failed to delete dashboard:', error);
    }
  }, [fetchAllDashboards]);

  const [anchorEls, setAnchorEls] = useState<{ [key: string]: HTMLElement | null }>({});

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, dashboardId: string) => {
    setAnchorEls(prev => ({ ...prev, [dashboardId]: event.currentTarget }));
  };

  const handleMenuClose = (dashboardId: string) => {
    setAnchorEls(prev => ({ ...prev, [dashboardId]: null }));
  };

  // Update dashboard name
  const handleUpdateDashboardName = useCallback(async () => {
    if (editingDashboardId && newDashboardName) {
      try {
        const updatedDashboard = await DashboardService.patchDashboard(editingDashboardId, { name: newDashboardName });
        setDashboards(prevDashboards =>
          prevDashboards.map(dashboard =>
            dashboard.id === editingDashboardId ? updatedDashboard : dashboard
          )
        );
        setEditingDashboardId(null);
        setNewDashboardName('');
      } catch (error) {
        console.error('Failed to update dashboard name:', error);
      }
    }
  }, [editingDashboardId, newDashboardName]);

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
              <button className={styles.addButton} onClick={handleAddDashboardOpen}>
                新儀表板
              </button>
            </li>
            {dashboards.map(dashboard => (
              <li
                key={dashboard.id}
                className={`${styles.sidebartitle} ${activeDashboard === dashboard.id ? styles.active : ''}`}
                onClick={() => handleDashboardClick(dashboard.id)}
              >
                {editingDashboardId === dashboard.id ? (
                  <input
                    type="text"
                    value={newDashboardName}
                    onChange={(e) => setNewDashboardName(e.target.value)}
                    onBlur={handleUpdateDashboardName}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdateDashboardName();
                      }
                    }}
                  />
                ) : (
                  <span>{dashboard.name}</span>
                )}
                <IconButton
                  aria-label="更多"
                  aria-controls={`long-menu-${dashboard.id}`}
                  aria-haspopup="true"
                  onClick={(event) => handleMenuOpen(event, dashboard.id)}
                  className={styles.dropdownButton}
                >
                  <img src={more} alt="操作" />
                </IconButton>

                <Menu
                  id={`long-menu-${dashboard.id}`}
                  anchorEl={anchorEls[dashboard.id]}
                  keepMounted
                  open={Boolean(anchorEls[dashboard.id])}
                  onClose={() => handleMenuClose(dashboard.id)}
                  className={styles.dropdownMenu}
                >
                  <MenuItem onClick={() => { setEditingDashboardId(dashboard.id); handleMenuClose(dashboard.id); }}>修改名稱</MenuItem>
                  <MenuItem onClick={() => { handleDeleteDashboard(dashboard.id); handleMenuClose(dashboard.id); }}>刪除</MenuItem>
                  <MenuItem onClick={() => handleEditDescription(dashboard.id, dashboard.description || '')}>編輯說明文字</MenuItem>
                </Menu>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {showMultiStepForm && (
        <MultiStepForm
          onClose={closeForm}
          exportData={async () => {
            await fetchAllDashboards(); // Ensure this is an async operation
          } }
          currentUserId={currentUserId} onDashboardCreated={function (dashboard: Dashboard, charts: any[]): void {
            throw new Error('Function not implemented.');
          } }        />
      )}
      <Dialog open={openDialog} onClose={handleAddDashboardClose}>
        <DialogTitle>新增儀表板</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="儀表板名稱"
            fullWidth
            variant="standard"
            value={dashboardName}
            onChange={(e) => setDashboardName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="儀表板說明文字（非必填）"
            fullWidth
            variant="standard"
            value={dashboardDescription}
            onChange={(e) => setDashboardDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDashboardClose}>取消</Button>
          <Button onClick={handleAddDashboardSubmit}>新增</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DashboardSidebar;
