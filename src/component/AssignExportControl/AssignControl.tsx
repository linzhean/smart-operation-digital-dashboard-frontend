import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { fetchAllUsers } from '../../services/UserAccountService';
import { fetchAllCharts, getAssignedTaskSponsors, setAssignedTaskSponsorsForDashboard, getAllAssignedTasks } from '../../services/AssignedTaskService';
import { UserAccountBean } from '../../services/types/userManagement';
import { makeStyles } from '@mui/styles';
import styles from './AssignControl.module.css';
import KPIAlertSetting from './KPIAlertSetting';
import alertIcon from '../../assets/icon/alertSetting.png'
import { colors, Tooltip } from '@mui/material';
import { TooltipProps } from '@mui/material/Tooltip';
import { styled } from '@mui/system';


const LargeTooltip = styled(({ className, ...props }: TooltipProps & { className?: string }) => (
  <Tooltip {...props} classes={{ popper: className }} arrow />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    padding: '6px 12px',
    backgroundColor: 'yellow',
    color: 'black',
    border: '1px solid black',
    transition: 'opacity 0.3s ease',
    opacity: 0,
  },
  [`& .MuiTooltip-arrow`]: {
    color: 'yellow',
  },
  [`&.MuiTooltip-open .MuiTooltip-tooltip`]: {
    opacity: 1,
  },
}));


const useStyles = makeStyles({
  dialogPaper: {
    width: '50%',
    height: '50%',
    maxHeight: '80%',
    maxWidth: '80%',
  },
});


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
  available: boolean;
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
            const sponsorList = response.data.sponsorList || [];
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

  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} classes={{ paper: classes.dialogPaper }}>
      <DialogTitle style={{ color: 'black', fontSize: '1.5rem', fontWeight: 'bold', width: 'auto', padding: '10px 24px 0px 24px' }}>
        交辦事項權限設置
      </DialogTitle>
      <DialogContent style={{ paddingTop: '15px' }}>
        <Autocomplete
          multiple
          options={users}
          getOptionLabel={(option) => `${option.userId} ${option.userName}`}
          onChange={(event, newValue) => {
            setSelectedUsers(newValue as User[]);
          }}
          value={selectedUsers}
          renderOption={(props, option) => (
            <li {...props}>
              {option.userId} {option.userName}
            </li>
          )}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="選擇用戶" placeholder="或輸入文字以查找..." />
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

  const handleSetAlert = (chartName: string) => {
    setCurrentChartName(chartName);
    setShowKPIAlertSetting(true);
  };

  const handleCloseAlert = () => {
    setShowKPIAlertSetting(false);
  };

  useEffect(() => {
    fetchAllCharts()
      .then((response) => {
        if (response.data) {
          setCharts(response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching charts', error);
      });
  }, []);

  useEffect(() => {
    getAllAssignedTasks()
      .then((response) => {
        if (response.data) {
          const taskMap: { [key: number]: AssignedTask[] } = {};
          response.data.forEach((task) => {
            if (task.id !== undefined) {
              if (!taskMap[task.chartId]) {
                taskMap[task.chartId] = [];
              }
              taskMap[task.chartId].push(task as AssignedTask);
            }
          });
          setAssignedTasks(taskMap);
        }
      })
      .catch((error) => {
        console.error('Error fetching assigned tasks', error);
      });
  }, []);

  const handleOpenDialog = (chartId: number) => {
    setCurrentChart(chartId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmit = (selectedUsers: User[]) => {
    setSelectedUsersMap((prevMap) => ({
      ...prevMap,
      [currentChart]: selectedUsers,
    }));

    const userIds = selectedUsers.map(user => user.userId);

    const requestData = {
      sponsorList: userIds,
      exporterList: [],
      dashboardCharts: [],
    };

    setAssignedTaskSponsorsForDashboard(currentChart, requestData)
      .then(response => {
        console.log('Successfully set task sponsors', response);
      })
      .catch(error => {
        console.error('Failed to set task sponsors', error);
      });

    setDialogOpen(false);
  };

  const getSelectedUserNames = (chartId: number) => {
    const selectedUsers = selectedUsersMap[chartId] || [];
    const taskCount = assignedTasks[chartId]?.length || 0;
    return selectedUsers.length > 0
      ? `擁有權限者：共 ${selectedUsers.length} 人，已分配任務：${taskCount} 個`
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
                  <td onClick={() => handleSetAlert(chart.name)}>
                    {chart.name}

                    <LargeTooltip title="點擊可以設定警訊上下限" open={alertSettingTooltipOpen} placement="right" arrow>
                      <img src={alertIcon} className={styles.alertIcon} alt="" />
                    </LargeTooltip>

                    {/* <img src={alertIcon} className={styles.alertIcon} alt="" /> */}
                    {/* <p>警訊設置</p> */}
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
        <KPIAlertSetting onClose={handleCloseAlert} chartName={currentChartName} />
      )}
    </>
  );
};

export default AssignTaskControl;
