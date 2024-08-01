import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { getAllUsers } from '../../services/userManagementServices';
import { setExportPermission } from '../../services/exportService';
import { EmployeeData } from '../../services/types/userManagement';
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
  selected?: boolean;
  [key: string]: any;
}

const UserPickerDialog: React.FC<{
  open: boolean;
  users: User[];
  selectedUserIds: string[];
  onClose: () => void;
  onSubmit: (selectedUsers: User[]) => void;
}> = ({ open, users, selectedUserIds, onClose, onSubmit }) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    const preSelectedUsers = users.filter((user) => selectedUserIds.includes(user.id));
    setSelectedUsers(preSelectedUsers);
  }, [users, selectedUserIds]);

  const handleSubmit = () => {
    onSubmit(selectedUsers); // Pass the User[] directly
    onClose();
  };

  const classes = useStyles();
  return (
    <Dialog open={open} onClose={onClose} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} classes={{ paper: classes.dialogPaper }}>
      <DialogTitle style={{ color: 'black', fontSize: '1.5rem', fontWeight: 'bold', width: 'auto', padding: '10px 24px 0px 24px' }}>
        匯出資料權限設置
      </DialogTitle>
      <DialogContent style={{ paddingTop: '15px' }}>
        <Autocomplete
          multiple
          options={users}
          getOptionLabel={(option) => `${option.id} ${option.name}`}
          onChange={(event, newValue) => {
            setSelectedUsers(newValue as User[]);
          }}
          value={selectedUsers}
          renderOption={(props, option) => (
            <li {...props}>
              {option.id} {option.name}
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
  const [currentChart, setCurrentChart] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsersMap, setSelectedUsersMap] = useState<{ [key: string]: string[] }>({}); // Map of chart to selected user IDs

  useEffect(() => {
    getAllUsers()
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          const userList: User[] = data.map((user) => ({
            ...user,
            available: user.available === 1, // Convert number to boolean
          }));
          setUsers(userList);
        } else {
          console.error('fetchAllUsers 返回的數據不是數組：', data);
          setUsers([]);
        }
      })
      .catch((error: any) => {
        console.error('獲取用戶數據失敗', error);
      });
  }, []);

  const handleOpenDialog = (chartName: string) => {
    setCurrentChart(chartName);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmit = (selectedUsers: User[]) => {
    const existingUserIds = selectedUsersMap[currentChart] || [];
    const newUserIds = selectedUsers.map(user => user.id);
    
    const toAdd = newUserIds.filter(id => !existingUserIds.includes(id));
    const toRemove = existingUserIds.filter(id => !newUserIds.includes(id));
    
    // Update the selected users map
    setSelectedUsersMap(prev => ({
      ...prev,
      [currentChart]: newUserIds,
    }));
    
    // Update export permissions
    const chartId = parseInt(currentChart, 10);
  
    // Construct the ListDTO object
    const listDTO = {
      sponsorList: [], // Add appropriate logic to handle sponsorList
      exporterList: newUserIds,
      dashboardCharts: [chartId] // Assuming currentChart is the chartId
    };
  
    // Sending the ListDTO object
    setExportPermission(chartId, listDTO)
      .then((response) => {
        console.log('成功提交:', response.message);
      })
      .catch((error) => {
        console.error('提交失败', error);
      });
  
    setDialogOpen(false);
  };
  
  const getSelectedUserNames = (chartName: string) => {
    const selectedUserIds = selectedUsersMap[chartName] || [];
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
              {['廢品率', '產能利用率', '生產進度達成率'].map((item, index) => (
                <tr key={index}>
                  <td>{item}</td>
                  <td>
                    <Button variant="contained" color="primary" onClick={() => handleOpenDialog(item)}>
                      {getSelectedUserNames(item)}
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
      />
    </>
  );
};

export default ExportControl;
