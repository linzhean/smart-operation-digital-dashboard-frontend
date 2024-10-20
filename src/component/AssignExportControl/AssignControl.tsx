import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { fetchAllUsers } from '../../services/UserAccountService';
import { fetchAllCharts, getAssignedTaskSponsors, setAssignedTaskSponsorsForDashboard, getAllAssignedTasks, createAssignedTask, updateAssignedTask } from '../../services/AssignedTaskService';
import { UserAccountBean } from '../../services/types/userManagement';
import { makeStyles } from '@mui/styles';
import styles from './AssignControl.module.css';
import KPIAlertSetting from './KPIAlertSetting';
import alertIcon from '../../assets/icon/alertSetting.png'
import { Tooltip } from '@mui/material';
import { TooltipProps } from '@mui/material/Tooltip';
import { styled } from '@mui/system';


const LargeTooltip = styled(({ className, ...props }: TooltipProps & { className?: string }) => (
  <Tooltip {...props} classes={{ popper: className }} arrow />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    fontSize: '0.8rem',
    fontWeight: '800',
    padding: '6px 10px',
    backgroundColor: 'yellow',
    color: 'black',
    transition: 'opacity 0.3s ease',
    opacity: 0,
  },
  [`& .MuiTooltip-arrow`]: {
    color: 'yellow',
  },
  [`&.MuiTooltip-open .MuiTooltip-tooltip`]: {
    opacity: 0.8,
  },
}));

interface User extends UserAccountBean {
  selected?: boolean;
}

interface Chart {
  id: number;
  name: string;
}

interface AssignedTask {
  id: number;
  chartId: number;
  name: string;
  defaultProcessor: string;
  defaultAuditor: string;
  available: boolean;
  upperLimit?: number;
  lowerLimit?: number;
}

interface AssignedTaskResponse {
  upperLimit: number;
  lowerLimit: number;
  defaultProcessor: string;
  defaultAuditor: string;
}

const UserPickerDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (selectedUsers: User[]) => void;
  chartId: number;
}> = ({ open, onClose, onSubmit, chartId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchAllUsers()
      .then((data) => {
        const userList: User[] = data.map((user: UserAccountBean) => ({
          ...user,
          available: user.available === true,
        }));
        setUsers(userList);
      })
      .catch((error) => {
        console.error('Error fetching users', error);
      });
  }, []);

  useEffect(() => {
    if (chartId > 0) {
      getAssignedTaskSponsors(chartId)
        .then((response) => {
          if (response && response.data) {
            const sponsorList = response.data.map((sponsor: any) => sponsor.sponsorId);
            const selectedUsers = users.filter((user) =>
              sponsorList.includes(user.userId)
            );
            setSelectedUsers(selectedUsers);
          } else {
            console.warn('No sponsor data available');
            setSelectedUsers([]);
          }
        })
        .catch((error) => {
          console.error('Error fetching assigned task sponsors', error);
          setSelectedUsers([]);
        });
    }
  }, [chartId, users]);

  const handleSubmit = () => {
    onSubmit(selectedUsers);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>交辦事項權限設置</DialogTitle>
      <DialogContent>
        <Autocomplete
          multiple
          options={users}
          getOptionLabel={(option) => `${option.userId} ${option.userName}`}
          value={selectedUsers}
          onChange={(event, newValue) => {
            setSelectedUsers(newValue as User[]);
          }}
          renderOption={(props, option) => (
            <li {...props}>
              {option.userId} {option.userName}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="選擇用戶" />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSubmit} color="primary">
          確認
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AssignTaskControl: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentChart, setCurrentChart] = useState(0);
  const [selectedUsersMap, setSelectedUsersMap] = useState<{ [key: number]: User[] }>({});
  const [charts, setCharts] = useState<Chart[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<{ [key: number]: AssignedTask[] }>({});
  const [showKPIAlertSetting, setShowKPIAlertSetting] = useState(false);
  const [currentChartName, setCurrentChartName] = useState<string | null>(null);
  const [upperLimit, setUpperLimit] = useState<number>(0);
  const [lowerLimit, setLowerLimit] = useState<number>(0);
  const [defaultProcessorName, setDefaultProcessorName] = useState<string>('');
  const [defaultAuditorName, setDefaultAuditorName] = useState<string>('');
  const [selectedAuditor, setSelectedAuditor] = useState<User | null>(null);
  const [selectedProcessor, setSelectedProcessor] = useState<User | null>(null);
  const [defaultProcessorId, setDefaultProcessorId] = useState<string>('');
  const [defaultAuditorId, setDefaultAuditorId] = useState<string>('');
  const [taskUpdated, setTaskUpdated] = useState(false);

  const handleSetAlert = (chartName: string, chartId: number) => {
    setCurrentChartName(chartName);
    setShowKPIAlertSetting(true);
    setCurrentChart(chartId);
  };


  const handleCloseAlert = () => {
    setShowKPIAlertSetting(false);
  };

  const handleKPIAlertSubmit = (lower: number, upper: number, defaultProcessorId: string, defaultAuditorId: string, chartId: number) => {
    const requestData = {
      chartId: currentChart,
      name: currentChartName || '',
      upperLimit: upper,
      lowerLimit: lower,
      defaultProcessor: defaultProcessorId,
      defaultAuditor: defaultAuditorId,
      available: true,
    };
  
    if (chartId) {
      updateAssignedTask(chartId, requestData)
        .then(response => {
          console.log('Successfully updated assigned task', response);
          // Set taskUpdated to true to trigger the refetch
          setTaskUpdated(prev => !prev);
        })
        .catch(error => {
          console.error('Failed to update assigned task', error);
        });
    } else {
      console.error('Chart ID is not available for updating');
    }
  };  

  useEffect(() => {
    fetchAllCharts()
      .then((response) => {
        if (response.data) {
          console.log('Fetched charts:', response.data);
          setCharts(response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching charts', error);
      });
  }, []);

  useEffect(() => {
    if (currentChart > 0) {
      fetchAllUsers().then((userData) => {
        const userMap: { [key: string]: string } = {};
        userData.forEach(user => {
          userMap[user.userId] = user.userName;
        });
  
        getAllAssignedTasks(currentChart).then((response) => {
          console.log('Assigned tasks response:', response.data);
  
          const taskData = response.data as unknown as AssignedTaskResponse;
  
          if (taskData) {
            setUpperLimit(taskData.upperLimit);
            setLowerLimit(taskData.lowerLimit);
  
            const defaultProcessorId = taskData.defaultProcessor;
            const defaultAuditorId = taskData.defaultAuditor;
  
            const defaultProcessorName = userMap[defaultProcessorId] || 'Unknown Processor';
            const defaultAuditorName = userMap[defaultAuditorId] || 'Unknown Auditor';
  
            setDefaultProcessorId(defaultProcessorId);
            setDefaultAuditorId(defaultAuditorId);
            setDefaultProcessorName(defaultProcessorName);
            setDefaultAuditorName(defaultAuditorName);
          } else {
            console.warn('Task data is undefined or null');
          }
        }).catch((error) => {
          console.error('Error fetching assigned tasks', error);
        });
      }).catch((error) => {
        console.error('Error fetching users', error);
      });
    }
  }, [currentChart, taskUpdated]); // Adding taskUpdated as a dependency  

  const handleOpenDialog = (chartId: number) => {
    setCurrentChart(chartId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmit = () => {
    if (!currentChart) {
      console.error('No chart selected');
      return;
    }

    const processorId = selectedProcessor?.userId || defaultProcessorId;
    const auditorId = selectedAuditor?.userId || defaultAuditorId;

    const requestData = {
      sponsorList: [processorId],
      exporterList: [],
      dashboardCharts: [],
      upperLimit,
      lowerLimit,
      defaultAuditor: auditorId,
      defaultProcessor: processorId
    };

    // 更新交辦事項
    updateAssignedTask(currentChart, {
      chartId: currentChart,
      name: currentChartName || '',
      defaultProcessor: processorId || '',
      defaultAuditor: auditorId || '',
      available: true,
      upperLimit: upperLimit !== null ? upperLimit : undefined,
      lowerLimit: lowerLimit !== null ? lowerLimit : undefined,
    })
      .then(response => {
        console.log('Successfully updated assigned task', response);
      })
      .catch(error => {
        console.error('Failed to update assigned task', error);
      });

    setDialogOpen(false);
  };

  const getSelectedUserNames = (chartId: number) => {
    const selectedUsers = selectedUsersMap[chartId] || [];
    const taskCount = assignedTasks[chartId]?.length || 0;
    return selectedUsers.length > 0
      ? `擁有權限者：共 ${selectedUsers.length} 人`
      : '設置交辦權限';
  };

  const currentUser = {
    userId: '123',
    permissions: ['create_task', 'update_task'],
  };


  const [alertSettingTooltipOpen, setAlertSettingTooltipOpen] = useState(false);

  useEffect(() => {
    setAlertSettingTooltipOpen(true);

    const timer = setTimeout(() => {
      setAlertSettingTooltipOpen(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);


  return (
    <>
      <div className={styles.theTable}>
        <div className={styles.theList}>
          <table className="custom-scrollbar">
            <thead>
              <tr>
                <th>圖表名稱</th>
                <th>交辦事項權限設置</th>
              </tr>
            </thead>
            <tbody>
              {charts.map((chart) => (
                <tr key={chart.id}>
                  <td onClick={() => handleSetAlert(chart.name, chart.id)}>
                    {chart.name}

                    <LargeTooltip title="點擊可以設定警訊上下限" open={alertSettingTooltipOpen} placement="right">
                      <img src={alertIcon} className={styles.alertIcon} alt="" />
                    </LargeTooltip>

                  </td>

                  <td>
                    {currentUser.permissions.includes('create_task') || currentUser.permissions.includes('update_task') ? (
                      <Button variant="contained" color="primary" onClick={() => handleOpenDialog(chart.id)}>
                        {getSelectedUserNames(chart.id)}
                      </Button>
                    ) : (
                      <span>無權限設置</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <UserPickerDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        chartId={currentChart}
      />
      {showKPIAlertSetting && (
        <KPIAlertSetting
          onClose={handleCloseAlert}
          chartName={currentChartName}
          upperLimit={upperLimit}
          lowerLimit={lowerLimit}
          setUpperLimit={setUpperLimit}
          setLowerLimit={setLowerLimit}
          defaultProcessor={defaultProcessorId} // 傳遞處理者的預設 ID
          defaultAuditor={defaultAuditorId}     // 傳遞稽核者的預設 ID
          defaultProcessorName={defaultProcessorName} // 傳遞處理者的預設名稱
          defaultAuditorName={defaultAuditorName}     // 傳遞稽核者的預設名稱
          onSubmit={(lower, upper, processor, auditor, chartId) => handleKPIAlertSubmit(lower, upper, processor, auditor, chartId)}
          chartId={currentChart}
        />
      )}
    </>
  );
};

export default AssignTaskControl;
