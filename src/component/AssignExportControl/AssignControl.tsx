// src/components/AssignControl/Assign.tsx
import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { fetchUsers } from '../../services/UserAccountService';
import { setAssignedTaskSponsors } from '../../services/AssignedTaskService';
import { EmployeeData } from '../../services/types/userManagement';
import { makeStyles } from '@mui/styles';
import styles from './AssignControl.module.css';

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
  onClose: () => void;
  onSubmit: (selectedUsers: User[]) => void;
}> = ({ open, users, onClose, onSubmit }) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    const preSelectedUsers = users.filter((user) => user.selected);
    setSelectedUsers(preSelectedUsers);
  }, [users]);

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

const AssignTaskControl: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentChart, setCurrentChart] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsersMap, setSelectedUsersMap] = useState<{ [key: string]: User[] }>({});

  useEffect(() => {
    fetchUsers()
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('fetchUsers 返回的數據不是數組：', data);
          setUsers([]);
        }
      })
      .catch((error) => {
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
    setSelectedUsersMap({
      ...selectedUsersMap,
      [currentChart]: selectedUsers,
    });

    const chartId = parseInt(currentChart, 10);
    const userIds = selectedUsers.map(user => user.id);

    setAssignedTaskSponsors(chartId, userIds)
      .then((response) => {
        console.log('成功提交', response.message);
      })
      .catch((error) => {
        console.error('提交失敗', error);
      });

    setDialogOpen(false);
  };

  const getSelectedUserNames = (chartName: string) => {
    const selectedUsers = selectedUsersMap[chartName] || [];
    return selectedUsers.length > 0 ? `擁有權限者：共 ${selectedUsers.length} 人` : '設置交辦權限';
  };

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
      <UserPickerDialog open={dialogOpen} users={users} onClose={handleCloseDialog} onSubmit={handleSubmit} />
    </>
  );
};

export default AssignTaskControl;
