import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { fetchUsers, admitUser } from '../../services/UserAccountService';
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
  [key: string]: any; // Allows any additional properties
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
        匯出資料權限設置
      </DialogTitle>
      <DialogContent style={{ paddingTop: '15px' }}>
        <Autocomplete
          multiple
          options={users}
          getOptionLabel={(option) => `${option.id} ${option.name}`} // Ensure `id` and `name` properties exist on `User`
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
          setUsers([]); // 或其他處理方式
        }
      })
      .catch((error) => {
        console.error('获取用户数据失败', error);
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

    const chartId = parseInt(currentChart, 10); // Parse currentChart to integer

    // Assuming setExportPermission expects an array of user IDs or names
    const userIds = selectedUsers.map(user => user.id); // Adjust this according to your actual data structure

    setExportPermission(chartId, userIds) // Pass array of strings (user IDs or names)
      .then((response) => {
        console.log('成功提交:', response.message);
      })
      .catch((error) => {
        console.error('提交失败', error);
      });

    setDialogOpen(false);
  };

  const getSelectedUserNames = (chartName: string) => {
    const selectedUsers = selectedUsersMap[chartName] || [];
    return selectedUsers.length > 0 ? `擁有權限者：共 ${selectedUsers.length} 人` : '設置匯出權限';
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
      <UserPickerDialog open={dialogOpen} users={users} onClose={handleCloseDialog} onSubmit={handleSubmit} />
    </>
  );
};

export default ExportControl;
