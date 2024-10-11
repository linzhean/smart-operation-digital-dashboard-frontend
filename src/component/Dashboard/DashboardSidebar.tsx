//src\component\Dashboard\DashboardSidebar.tsx
import React, { useState, useEffect, useCallback } from 'react';
import closearrow from '../../assets/icon/close-arrow.svg';
import styles from './DashBoardSidebar.module.css';
import DashboardService from '../../services/DashboardService';
import ChartService from '../../services/ChartService';
import { Dashboard } from '../../services/types/dashboard';
import { fetchAllUsers } from '../../services/UserAccountService';
import { createApplication } from '../../services/application';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
}> = ({ onSelectDashboard, onAddChart, currentUserId}) => {
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
  const [charts, setCharts] = useState<any[]>([]);
  const [selectedKPIs, setSelectedKPIs] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [requestContent, setRequestContent] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedChartForApplication, setSelectedChartForApplication] = useState<number | null>(null);
  const [selectedChartId, setSelectedChartId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCharts = async () => {
      if (activeDashboard) {
        try {
          const response = await ChartService.getAvailableCharts(Number(activeDashboard));
          setCharts(response.data);
        } catch (error) {
          console.error('Failed to fetch charts:', error);
          alert('Failed to fetch charts. Please try again later.');
        }
      }
    };
    fetchCharts();
  }, [activeDashboard]);
   

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await fetchAllUsers();
        console.log(userList);
        setUsers(userList);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        alert('Failed to fetch users. Please try again later.');
      }
    };
    fetchUsers();
  }, []);

  const handleKpiSelection = (kpiId: number) => {
    if (charts.find(chart => chart.id === kpiId)?.observable) {
      setSelectedKPIs(prev => prev.includes(kpiId) ? prev.filter(id => id !== kpiId) : [...prev, kpiId]);
    }
  };

  const handleRequestKpi = (chartId: number) => {
    setSelectedChartForApplication(chartId);
    setIsFormVisible(true);
  };

  const handleChartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChartId(Number(e.target.value));
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChartId) {
      alert('請選擇一個圖表進行申請。');
      return;
    }

    try {
      const requestData = {
        chartId: selectedChartId,
        applicant: currentUserId,
        guarantor: selectedUser || '',
        startDateStr: formatDate(startDate),
        endDateStr: formatDate(endDate),
        reason: requestContent,
      };
      const response = await createApplication(requestData);
      if (response.result) {
        alert('請求提交成功');
        setIsFormVisible(false);
      } else {
        alert('請求提交失敗：' + response.message);
      }
    } catch (error) {
      console.error('提交 KPI 請求時出錯:', error);
      alert('提交 KPI 請求失敗。請重試。');
    }
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleApplyMore = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setSelectedChartForApplication(null);
  };

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

  // 修改 fetchAllDashboards 函數
  const fetchAllDashboards = useCallback(async () => {
    try {
      const fetchedDashboards = await DashboardService.getAllDashboards();

      // 确保 fetchedDashboards 是数组
      if (Array.isArray(fetchedDashboards)) {
        setDashboards(fetchedDashboards);
      } else {
        console.error('Fetched dashboards is not an array:', fetchedDashboards);
        setDashboards([]); // 设置为一个空数组，避免后续错误
      }

      if (fetchedDashboards.length > 0 && !activeDashboard) {
        const firstDashboard = fetchedDashboards[0];
        setActiveDashboard(firstDashboard.id);
        onSelectDashboard(firstDashboard.id);
      }
    } catch (error) {
      console.error('Failed to fetch dashboards:', error);
      setDashboards([]); // 发生错误时也清空 dashboards
    }
  }, [activeDashboard, onSelectDashboard]);


  useEffect(() => {
    fetchAllDashboards();
  }, [fetchAllDashboards]);

  // Fetch available charts for adding
  const fetchAvailableCharts = async () => {
    setLoading(true);
    try {
      if (activeDashboard) {
        const response = await ChartService.getAvailableCharts(Number(activeDashboard));
        console.log('Fetched charts:', response.data);
        setAvailableCharts(response.data);
      }
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
    if (!chart.observable) {
      return; // 如果 observable 為 false，直接返回，阻止選擇
    }

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

        try {
            await ChartService.addChartsToDashboard(Number(activeDashboard), selectedChartsData.map(chart => chart.id));
            onAddChart(selectedChartsData); // 调用传递的函数更新 Home 的状态
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
                  <MenuItem onClick={() => handleAddChartOpen()}>設定圖表</MenuItem>
                  <MenuItem onClick={() => { handleDeleteDashboard(dashboard.id); handleMenuClose(dashboard.id); }}>刪除</MenuItem>
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

      {/* <Dialog open={openAddChartDialog} onClose={handleAddChartClose}>
        <DialogTitle>選擇你要的圖表</DialogTitle>
        <DialogContent>
          {availableCharts.map((chart) => (
            <MenuItem
              key={chart.id}
              onClick={() => handleChartSelection(chart)}
              style={{
                color: chart.observable ? 'black' : 'gray', // observable 為 false 顯示灰色
                cursor: chart.observable ? 'pointer' : 'not-allowed' // 禁用點擊
              }}
              disabled={!chart.observable} // observable 為 false 禁用點選
            >
              <Checkbox
                checked={selectedCharts.has(chart.id)}
                onChange={() => handleChartSelection(chart.id)}
                color="primary"
                disabled={!chart.observable} // observable 為 false 禁用選擇
              />
              {chart.name}
            </MenuItem>
          ))}
        </DialogContent>
        <DialogActions>
        <button type="button" className={styles.applyMore} onClick={handleApplyMore}>
        或是點此申請無權限圖表
      </button>
          <Button onClick={handleAddChartClose} color="primary">
            取消
          </Button>
          <Button onClick={handleAddChartConfirm} color="primary">
            確定
          </Button>
        </DialogActions>
      </Dialog>

      {isFormVisible && (
        <div className={styles.checkFormContainer}>
          <div className={styles.formOverlay} onClick={handleCloseForm}></div>
          <div onClick={(e) => e.stopPropagation()} className={styles.checkFormContent}>
            <h2>申請KPI圖表</h2>
            <form onSubmit={handleRequestSubmit}>
              <div className={styles.applyKPIlabelGroup}>
                <label htmlFor='KPIapplicant'>申請人</label>
                <input
                  id='KPIapplicant'
                  type="text"
                  value={currentUserId}
                  readOnly
                  className={styles.KPIapplicant}
                />
              </div>

              <div className={styles.applyKPIlabelGroup}>
                <label htmlFor='KPIguarantor'>保證人</label>
                <select
                  id='KPIguarantor'
                  value={selectedUser || ''}
                  onChange={(e) => setSelectedUser(e.target.value)}>

                  <option>請選擇</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id} className={styles.applyKpiOption}>{user.userName}</option>
                  ))}

                </select>
              </div>

              <div className={styles.applyKPIlabelGroup}>
                <label htmlFor="chart-select">選擇圖表:</label>
                <select id="chart-select" value={selectedChartId ?? ''} onChange={handleChartChange}>
                  <option value="" disabled className={styles.applyKpiOption}>請選擇圖表</option>
                  {charts.map(chart => (
                    <option key={chart.id} value={chart.id}>
                      {chart.name} {chart.observable ? '' : '(不可觀察)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.applyKPIlabelGroup}>
                <label htmlFor='KPIstartDate'>開始日期</label>
                <DatePicker
                  id='KPIstartDate'
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  placeholderText="請選擇開始時間"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="yyyy-MM-dd HH:mm"
                />
              </div>

              <div className={styles.applyKPIlabelGroup}>
                <label htmlFor='KPIendDate'>結束日期</label>
                <DatePicker
                  id='KPIendDate'
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  placeholderText="請選擇結束時間"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="yyyy-MM-dd HH:mm"
                />
              </div>

              <div className={styles.LastapplyKPIlabelGroup}>
                <textarea
                  className={styles.applyKPItextarea}
                  placeholder='請填寫此次申請理由'
                  value={requestContent}
                  onChange={(e) => setRequestContent(e.target.value)}
                  required
                />
              </div>

              <div className={styles.KPIbuttonGroup}>
                <button type="button" className={styles.cancel} onClick={handleCloseForm}>取消</button>
                <button type="submit" className={styles.submit}>提交</button>
              </div>
            </form>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default DashboardSidebar;
