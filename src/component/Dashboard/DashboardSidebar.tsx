import React, { useState, useEffect, useCallback } from 'react';
import closearrow from '../../assets/icon/close-arrow.svg';
import styles from './DashBoardSidebar.module.css';
import DashboardService from '../../services/DashboardService';
import ChartService from '../../services/ChartService';
import { Dashboard } from '../../services/types/dashboard';
import more from '../../assets/icon/homeMore.svg';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import MultiStepForm from './dashBoardForm';
import Checkbox from '@mui/material/Checkbox'; 

const DashboardSidebar: React.FC<{
  onSelectDashboard: (dashboardId: string) => void,
  onAddChart: (chart: any) => void,
  currentUserId: string
}> = ({ onSelectDashboard, onAddChart, currentUserId }) => {
  const [isActive, setIsActive] = useState(false);
  const [isDisabled, setIsDisabled] = useState(window.innerWidth > 1024);
  const [activeDashboard, setActiveDashboard] = useState<string | null>(null);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [editingDashboardId, setEditingDashboardId] = useState<string | null>(null);
  const [newDashboardName, setNewDashboardName] = useState<string>('');
  const [openAddChartDialog, setOpenAddChartDialog] = useState(false);
  const [availableCharts, setAvailableCharts] = useState<any[]>([]);
  const [selectedCharts, setSelectedCharts] = useState<Set<string>>(new Set()); // Use a Set to manage selected charts
  const [openDialog, setOpenDialog] = useState(false);
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardDescription, setDashboardDescription] = useState('');
  const [showMultiStepForm, setShowMultiStepForm] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch available charts for adding
  const fetchAvailableCharts = async () => {
    setLoading(true);
    try {
      const response = await ChartService.getAvailableCharts();
      console.log('Fetched charts:', response.data); // Add this line
      setAvailableCharts(response.data);
    } catch (error) {
      console.error('Failed to fetch available charts:', error);
      setError('Failed to fetch available charts.');
    } finally {
      setLoading(false);
    }
  };  
  
  const toggleActiveState = () => {
    setIsActive(prev => !prev);
  };

  const handleDashboardClick = (dashboardId: string) => {
    setActiveDashboard(dashboardId);
    onSelectDashboard(dashboardId);
  };
  
  const handleAddChartOpen = async () => {
    await fetchAvailableCharts();
    setOpenAddChartDialog(true);
  };   

  const handleAddChartClose = () => {
    setOpenAddChartDialog(false);
  };

  const handleChartSelection = (chart: any) => {
    setSelectedCharts(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(chart.id)) {
        newSelection.delete(chart.id);
      } else {
        newSelection.add(chart.id);
      }
      return newSelection;
    });
  };

  const handleAddChartConfirm = async () => {
    if (activeDashboard && selectedCharts.size > 0) {
      const selectedChartsData = Array.from(selectedCharts).map(chartId => {
        const chart = availableCharts.find(c => c.id === chartId);
        return chart ? { ...chart, id: chartId } : null;
      }).filter(chart => chart !== null);
  
      console.log('Selected Charts Data:', selectedChartsData); // Debug
      console.log('Active Dashboard:', activeDashboard); // Debug
  
      try {
        await ChartService.addChartsToDashboard(Number(activeDashboard), selectedChartsData.map(chart => chart.id));
      } catch (error) {
        console.error('Failed to add charts to dashboard:', error);
      }
  
      handleAddChartClose();
    } else {
      console.error('Active Dashboard or Selected Charts are missing');
    }
  };  
  
  const handleAddDashboardOpen = () => {
    setShowMultiStepForm(true);
  };

  const closeForm = () => {
    setShowMultiStepForm(false);
  };

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
      {loading && <div className={styles.loadingMsg}></div>}
      {error && <div className={styles.errorMsg}>{error}</div>}
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
                  <MenuItem onClick={() => handleAddChartOpen()}>新增圖表</MenuItem>
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
            await fetchAllDashboards();
          }}
          currentUserId={currentUserId}
          onDashboardCreated={(dashboard, charts) => {
            // Handle dashboard creation, if needed
          }}
        />
      )}

      <Dialog open={openAddChartDialog} onClose={handleAddChartClose}>
        <DialogTitle>新增圖表</DialogTitle>
        <DialogContent>
          {availableCharts.map((chart) => (
            <MenuItem key={chart.id} onClick={() => handleChartSelection(chart)}>
              <Checkbox
                checked={selectedCharts.has(chart.id)}
                onChange={() => handleChartSelection(chart.id)}
                color="primary"
              />
              {chart.name}
            </MenuItem>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddChartClose} color="primary">
            取消
          </Button>
          <Button onClick={handleAddChartConfirm} color="primary">
            確定
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DashboardSidebar;
