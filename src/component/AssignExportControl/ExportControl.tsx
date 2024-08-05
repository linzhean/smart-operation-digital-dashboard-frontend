import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { fetchAllUsers } from '../../services/UserAccountService';
import { setExportPermission, getExportPermission } from '../../services/exportService';
import { fetchAllCharts } from '../../services/AssignedTaskService';
import { EmployeeData, UserAccountBean } from '../../services/types/userManagement';
import { makeStyles } from '@mui/styles';
import styles from './ExportControl.module.css';

const useStyles = makeStyles({
  dialogPaper: {
    width: '50%',
    height: '50%',
    maxHeight: '80%',
    maxWidth: '80%',
  },
});

interface User extends EmployeeData {
  id: string;
  selected?: boolean;
}

interface Chart {
  id: number;
  name: string;
}

const UserPickerDialog: React.FC<{
  open: boolean;
  users: User[];
  selectedUserIds: string[];
  onClose: () => void;
  onSubmit: (selectedUsers: User[]) => void;
  chartId: number;
}> = ({ open, users, selectedUserIds, onClose, onSubmit, chartId }) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const classes = useStyles();

  useEffect(() => {
    const initialSelectedUsers = users.filter(user => selectedUserIds.includes(user.id));
    setSelectedUsers(initialSelectedUsers);
  }, [users, selectedUserIds]);

  const handleSubmit = () => {
    onSubmit(selectedUsers);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} classes={{ paper: classes.dialogPaper }}>
      <DialogTitle style={{ color: 'black', fontSize: '1.5rem', fontWeight: 'bold', width: 'auto', padding: '10px 24px 0px 24px' }}>
        匯出資料權限設置
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

const ExportControl: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentChart, setCurrentChart] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [charts, setCharts] = useState<Chart[]>([]);
  const [selectedUsersMap, setSelectedUsersMap] = useState<{ [key: number]: string[] }>({}); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users
        const userData = await fetchAllUsers();
        if (Array.isArray(userData)) {
          const userList: User[] = userData.map((user) => ({
            ...user,
            id: user.userId,
            available: Boolean(user.available), // Convert number to boolean
          }));
          setUsers(userList);
        } else {
          console.error('fetchAllUsers 返回的數據不是數組：', userData);
          setUsers([]);
        }

        // Fetch all charts
        const chartResponse = await fetchAllCharts();
        if (chartResponse.data) {
          setCharts(chartResponse.data);

          // Fetch permissions for each chart
          const permissionsMap: { [key: number]: string[] } = {};
          for (const chart of chartResponse.data) {
            try {
              const permissionResponse = await getExportPermission(chart.id);
              if (permissionResponse.result && permissionResponse.data) {
                const selectedUserIds = permissionResponse.data.exporterList || [];
                permissionsMap[chart.id] = selectedUserIds;
              }
            } catch (error) {
              console.error('Error fetching export permissions', error);
            }
          }
          setSelectedUsersMap(permissionsMap);
        }
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  const handleOpenDialog = (chartId: number) => {
    setCurrentChart(chartId);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmit = (selectedUsers: User[]) => {
    const selectedUserIds = selectedUsers.map(user => user.id);

    // Update the selected users map
    setSelectedUsersMap(prev => ({
      ...prev,
      [currentChart]: selectedUserIds,
    }));

    const listDTO = {
      sponsorList: [], // Add appropriate logic to handle sponsorList
      exporterList: selectedUserIds,
      dashboardCharts: [],
    };

    setExportPermission(currentChart, listDTO)
      .then((response) => {
        console.log('成功提交:', response.message);
      })
      .catch((error) => {
        console.error('提交失败', error);
      });

    setDialogOpen(false);
  };

  const getSelectedUserNames = (chartId: number) => {
    const selectedUserIds = selectedUsersMap[chartId] || [];
    const count = selectedUserIds.length;
    return count > 0 ? `擁有權限者：共 ${count} 人` : '設置匯出權限';
  };

  return (
    <>
      <div className={styles.theTable}>
        <div className={styles.theList}>
          <table className="custom-scrollbar">
            <thead>
              <tr>
                <th>圖表名稱</th>
                <th>匯出資料權限設置</th>
              </tr>
            </thead>
            <tbody>
              {charts.map((chart) => (
                <tr key={chart.id}>
                  <td>{chart.name}</td>
                  <td>
                    <Button variant="contained" color="primary" onClick={() => handleOpenDialog(chart.id)}>
                      {getSelectedUserNames(chart.id)}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <UserPickerDialog
        open={dialogOpen}
        users={users}
        selectedUserIds={selectedUsersMap[currentChart] || []}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        chartId={currentChart}
      />
    </>
  );
};

export default ExportControl;
