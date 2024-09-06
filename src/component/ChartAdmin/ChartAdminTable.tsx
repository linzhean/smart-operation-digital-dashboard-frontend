import React, { useState, useEffect } from 'react';
import styles from './ChartAdminTable.module.css';
import NewChartForm from './newChartForm';
import ViewChartForm from './ViewChartForm';
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
}));

const ChartAdminTable: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewFormOpen, setIsViewFormOpen] = useState(false);
  const [viewFormData, setViewFormData] = useState({ chartName: '', chartCodeFile: '', chartImage: '' });
  const [charts, setCharts] = useState<any[]>([]);
  const [openStatus, setOpenStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('篩選狀態');

  useEffect(() => {
    const fetchCharts = async (available: boolean | null) => {
      try {
        const response = await ChartService.getCharts(available === null ? false : available);
        const chartsData = response.data; // 假设返回数据在 `data` 字段
        if (Array.isArray(chartsData)) {
          // 根据 selectedStatus 过滤数据
          const filteredCharts = chartsData.filter(chart => {
            if (selectedStatus === '全部') {
              return true;
            }
            if (selectedStatus === '啟用中') {
              return chart.available === true;
            }
            if (selectedStatus === '停用中') {
              return chart.available === false;
            }
            return true;
          });
          setCharts(filteredCharts);
        } else {
          console.error('Fetched data is not an array:', chartsData);
        }
      } catch (error) {
        console.error('Error fetching charts:', error);
        alert('查詢圖表狀態失敗');
      }
    };      

    // 根据 selectedStatus 来决定是传递 true 还是 false，或者 null 表示全部
    const isAvailable = selectedStatus === '啟用中' ? true : (selectedStatus === '停用中' ? false : null);
    fetchCharts(isAvailable);
  }, [selectedStatus]);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const urlToFile = (dataUrl: string): Promise<File> => {
    return fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => new File([blob], 'image.png', { type: 'image/png' }));
  };

  const handleFormSubmit = async (chartName: string, chartCode: File | null, chartImage: string | null) => {
    try {
      const imageFile = chartImage ? await urlToFile(chartImage) : null;
      await ChartService.createChart(chartName, chartCode, imageFile);
      alert('圖表新增成功');
      handleCloseForm();
      // 刷新图表列表
      const isAvailable = selectedStatus === '啟用中';
      const fetchedCharts = await ChartService.getCharts(isAvailable);
      setCharts(fetchedCharts);
    } catch (error) {
      console.error('新增圖表失敗:', error);
      alert('圖表新增失敗');
    }
  };

  const handleMenuItemClick = () => {
    setOpenStatus(!openStatus);
  };

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
        // 刷新图表列表
        const isAvailable = selectedStatus === '啟用中';
        const fetchedCharts = await ChartService.getCharts(isAvailable);
        setCharts(fetchedCharts);
        alert(`圖表已${newStatus ? '啟用' : '停用'}`);
      } catch (error) {
        console.error('Error updating chart availability:', error);
        alert('更新圖表狀態失敗');
      }
    }
  };  

  const handleViewChart = (chartName: string, chartCodeFile: string, chartImage: string) => {
    setViewFormData({ chartName, chartCodeFile, chartImage });
    setIsViewFormOpen(true);
  };

  const handleCloseViewForm = () => {
    setIsViewFormOpen(false);
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
            <div className={`${styles.title}`}>
              {selectedStatus}
            </div>
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

        <button className={styles.addKPIButton} onClick={handleOpenForm}>
          新增圖表
        </button>
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
                    <span onClick={() => handleViewChart(chart.name, chart.codeFile, chart.image)}>
                      查看
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <NewChartForm onSubmit={handleFormSubmit} onClose={handleCloseForm} />
      )}

      {isViewFormOpen && (
        <ViewChartForm
          chartName={viewFormData.chartName}
          chartCodeFile={viewFormData.chartCodeFile}
          chartImage={viewFormData.chartImage}
          onClose={handleCloseViewForm}
        />
      )}
    </>
  );
};

export default ChartAdminTable;
