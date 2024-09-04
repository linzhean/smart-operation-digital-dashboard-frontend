import React, { useState } from 'react';
import styles from './ChartAdminTable.module.css';
import NewChartForm from './newChartForm';
import ViewChartForm from './ViewChartForm';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Collapse, Switch, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';


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
  const [isViewFormOpen, setIsViewFormOpen] = useState(false); // 新增狀態來控制查看表單顯示
  const [viewFormData, setViewFormData] = useState({ chartName: '', chartCodeFile: '', chartImage: '' }); // 管理查看表單的數據

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleFormSubmit = (chartName: string, chartCode: string, chartImage: string) => {
    console.log('新增圖表:', chartName, chartCode, chartImage);
  };

  const [openStatus, setOpenStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('篩選狀態');

  const handleMenuItemClick = () => {
    setOpenStatus(!openStatus);
  };

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setOpenStatus(false);
  };

  const [selected, setSelected] = useState(false);

  const handleToggle = async (event: React.ChangeEvent<HTMLInputElement>, newAlignment: boolean) => {
    if (newAlignment !== null) {
      const userConfirmed = window.confirm(`確定要${newAlignment ? '啟用' : '停用'}這個功能嗎？`);
      if (userConfirmed) {
        setSelected(newAlignment);
        alert(`功能已${newAlignment ? '啟用' : '停用'}`);
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
        <div className={`${styles.theFilter} ${openStatus ? styles.MenuOpen : ''}`}
        >
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
              <tr>
                <td>生產率</td>
                <td>
                  <div className={styles.theToggle}>
                    <FormControlLabel
                      control={<IOSSwitch checked={selected} onChange={(e) => handleToggle(e, (e.target as HTMLInputElement).checked)} />}
                      label=""
                    />
                  </div>
                </td>
                <td>
                  <span onClick={() => handleViewChart('生產率', 'chart-code.js', 'chart-preview.png')}>
                    查看
                  </span>
                </td>
              </tr>

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
