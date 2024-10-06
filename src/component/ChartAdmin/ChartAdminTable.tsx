import React, { useState, useEffect } from 'react';
import styles from './ChartAdminTable.module.css';
// import NewChartForm from './newChartForm';
import ViewChartForm from './ViewChartForm';
import { Snackbar, Button, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Collapse, Switch, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import ChartService from '../../services/ChartService';

const IOSSwitch = styled(Switch)(({ theme }) => ({
  width: 60,
  height: 34,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 5,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(22px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#65C466',
        opacity: 1,
        border: 0,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 24,
    height: 24,
  },
  '& .MuiSwitch-track': {
    borderRadius: 34 / 2,
    backgroundColor: 'red',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
  // 響應式的調整
  '@media (max-width: 480px)': {
    width: 50,
    height: 30,
    '& .MuiSwitch-thumb': {
      width: 20,
      height: 20,
    },
    '& .MuiSwitch-track': {
      borderRadius: 30 / 2,
    },
    // 圓點點的位置!!!!
    '& .MuiSwitch-switchBase': {
      '&.Mui-checked': {
        transform: 'translateX(19px)',
      }
    },
  },
}));


const ChartAdminTable: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewFormOpen, setIsViewFormOpen] = useState(false);
  const [viewFormData, setViewFormData] = useState({ chartName: '', chartCodeFile: '', chartImage: '', showcaseImage: '' });
  const [charts, setCharts] = useState<any[]>([]);
  const [openStatus, setOpenStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('篩選狀態');


  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState('');
  const [retryAction, setRetryAction] = useState<() => void>(() => { });


  const handleError = (message: string, retryFunc: () => void) => {
    setError(message);
    setRetryAction(() => retryFunc);
    setSnackbarOpen(true);
  };

  const fetchCharts = async (available: boolean | null) => {
    const actualAvailable = available !== null ? available : true; // Handle null by providing a default value
    try {
      const response = await ChartService.getCharts(actualAvailable); // Pass the actual boolean value
      const chartsData = response.data;
  
      if (Array.isArray(chartsData)) {
        const filteredCharts = chartsData.filter(chart => {
          if (selectedStatus === '全部') return true; // No filtering, show all
          if (selectedStatus === '啟用中') return chart.available === true;
          if (selectedStatus === '停用中') return chart.available === false;
          return true;
        });
  
        setCharts(filteredCharts);
        setError('');
      } else {
        throw new Error('獲取的數據不是數組');
      }
    } catch (error) {
      console.error('獲取圖表時出錯:', error);
      handleError('查詢圖表狀態失敗', () => fetchCharts(available));
    }
  };  

  useEffect(() => {
    const isAvailable = selectedStatus === '啟用中' ? true : (selectedStatus === '停用中' ? false : true);
    fetchCharts(isAvailable); // 如果 selectedStatus 是 "全部"，則 available 會是 null
  }, [selectedStatus]);

  const handleOpenForm = () => setIsFormOpen(true);
  const handleCloseForm = () => setIsFormOpen(false);

  const urlToFile = (dataUrl: string): Promise<File> => {
    return fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => new File([blob], 'image.png', { type: 'image/png' }));
  }

  const handleFormSubmit = async (chartName: string, chartCode: File | null, chartImage: string | null) => {
    try {
      const imageFile = chartImage ? await urlToFile(chartImage) : null;
      await ChartService.createChart(chartName, chartCode, imageFile);
      handleCloseForm();
      const isAvailable = selectedStatus === '啟用中';
      await fetchCharts(isAvailable);
      setError('');
    } catch (error) {
      console.error('新增圖表失敗:', error);
      handleError('圖表新增失敗', () => handleFormSubmit(chartName, chartCode, chartImage));
    }
  };

  const handleMenuItemClick = () => setOpenStatus(!openStatus);

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setOpenStatus(false);
  };

  const handleToggle = async (chartId: number, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    const userConfirmed = window.confirm(`確定要${newStatus ? '啟用' : '停用'}這個功能嗎？`);
    if (userConfirmed) {
      try {
        await ChartService.updateChartAvailability(chartId, newStatus);
        const isAvailable = selectedStatus === '啟用中';
        await fetchCharts(isAvailable);
        setError('');
      } catch (error) {
        console.error('更新圖表可用性時出錯:', error);
        handleError('更新圖表狀態失敗', () => handleToggle(chartId, currentStatus));
      }
    }
  };

  const handleViewChart = async (chartName: string, chartCodeFile: string, chartImage: string, showcaseImage: string) => {
    try {
      const availableCharts = await ChartService.getAvailableCharts();
      const selectedChart = availableCharts.find((chart: { name: string; }) => chart.name === chartName);

      if (selectedChart) {
        const showcaseImage = selectedChart.showcaseImage; // 从返回的图表数据中获取示意图 URL
        setViewFormData({ chartName, chartCodeFile, chartImage, showcaseImage });
        setIsViewFormOpen(true);
      } else {
        alert('未找到示意圖');
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      alert('获取图表信息失败');
    }
  };

  const handleCloseViewForm = () => setIsViewFormOpen(false);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleRetry = () => {
    setSnackbarOpen(false);
    retryAction();
  };

  return (
    <>
      <div className={styles.ChartAdminMenu}>
        <div className={`${styles.theFilter} ${openStatus ? styles.MenuOpen : ''}`}>
          <a
            type="button"
            onClick={handleMenuItemClick}
            className={styles.theAccordion}
          >
            <div className={`${styles.title}`}>{selectedStatus}</div>
            <div className={styles.theArrowIcon}>
              {openStatus ? <ExpandLess /> : <ExpandMore />}
            </div>
          </a>

          <Collapse in={openStatus} timeout="auto" unmountOnExit>
            <div className={`${styles.collapseContent}`}>
              <ul>
                {['全部', '停用中', '啟用中'].map((status) => (
                  <li
                    key={status}
                    onClick={() => handleStatusSelect(status)}
                    className={
                      selectedStatus === status
                        ? `${styles.activeStatus} ${styles.theStatuses}`
                        : styles.theStatuses
                    }
                  >
                    {status}
                  </li>
                ))}
              </ul>
            </div>
          </Collapse>
        </div>

        {/* <button className={styles.addKPIButton} onClick={handleOpenForm}>
          新增圖表
        </button> */}
      </div>

      <div className={styles.theTable}>
        <div className={styles.theList}>
          <table className="custom-scrollbar">
            <thead className={styles.theTitle}>
              <tr>
                <th>圖表</th>
                <th>狀態</th>
                <th>內容</th>
              </tr>
            </thead>
            <tbody>
              {charts.map((chart) => (
                <tr key={chart.id}>
                  <td>{chart.name}</td>
                  <td>
                    <div className={styles.theToggle}>
                      <FormControlLabel
                        control={<IOSSwitch checked={chart.available} onChange={() => handleToggle(chart.id, chart.available)} />}
                        label=""
                      />
                    </div>
                  </td>
                  <td>
                    <span onClick={() => handleViewChart(chart.name, chart.codeFile, chart.image, chart.showcaseImage)}>
                      查看
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* {isFormOpen && (
        <NewChartForm onSubmit={handleFormSubmit} onClose={handleCloseForm} />
      )} */}

      {isViewFormOpen && (
        <ViewChartForm
          chartName={viewFormData.chartName}
          chartCodeFile={viewFormData.chartCodeFile}
          chartImage={viewFormData.chartImage}
          onClose={handleCloseViewForm}
          showcaseImage={viewFormData.showcaseImage}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={15000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ zIndex: 999999999999 }}
      >
        <Alert
          severity="error"
          variant="filled"
          icon={false}
          sx={{
            width: '400px',
            backgroundColor: '#F5F5F5',
            color: '#000000',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            position: 'relative',
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleSnackbarClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'black',
            }}
          >
            <CloseIcon />
          </IconButton>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ErrorIcon style={{ marginRight: '12px', color: 'black', verticalAlign: 'middle' }} />
            <span style={{ verticalAlign: 'middle', fontSize: '1.2rem' }}>{error}</span>
          </div>

          <Button
            color="inherit"
            size="small"
            onClick={handleRetry}
            sx={{
              width: '100%',
              backgroundColor: '#FFD700',
              color: '#000000',
              fontWeight: '900',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '2px solid #000000',
              '&:hover': {
                backgroundColor: '#F0E68C',
              },
              padding: '8px 0',
              marginTop: '12px',
            }}
          >
            重新嘗試
          </Button>
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChartAdminTable;