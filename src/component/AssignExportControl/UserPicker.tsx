import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { makeStyles } from '@mui/styles';

//樣式分散在makeStyles 內聯以及 Export/AssignControl.module.css
const useStyles = makeStyles({
  dialogPaper: {
    width: '50%',
    height: '50%',
    maxHeight: '80%',
    maxWidth: '80%'
  },
});

// 定義用戶類型
type User = {
  id: number;
  name: string;
  selected: boolean;
};

// 假用戶數據
const fakeUsers: User[] = [
  { id: 1, name: 'Alice', selected: true },
  { id: 2, name: 'Bob', selected: false },
  { id: 3, name: 'Charlie', selected: true },
  { id: 4, name: 'David', selected: false },
  { id: 5, name: 'Eva', selected: true },
  { id: 6, name: 'Frank', selected: false },
  { id: 7, name: 'Grace', selected: false },
  { id: 8, name: 'Hank', selected: true },
  { id: 9, name: 'Ivy', selected: false },
  { id: 10, name: 'Jack', selected: true },
];

const UserPickerDialog: React.FC<{
  open: boolean;
  users: User[];
  onClose: () => void;
  onSubmit: (selectedUsers: User[]) => void;
}> = ({ open, users, onClose, onSubmit }) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    const preSelectedUsers = users.filter(user => user.selected);
    setSelectedUsers(preSelectedUsers);
  }, [users]);

  const handleSubmit = () => {
    onSubmit(selectedUsers);
    onClose();
  };

  const classes = useStyles();
  return (
    <>
      <Dialog open={open} onClose={onClose} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} classes={{ paper: classes.dialogPaper }}>
        <DialogTitle
          style={{
            color: 'black', fontSize: '1.5rem', fontWeight: 'bold', width: 'auto', padding: '10px 24px 0px 24px'
          }}>
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
              <li {...props} key={option.id}>
                {option.id} {option.name}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="選擇用戶"
                placeholder="或輸入文字以查找..."
              />
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
    </>
  );
};

const MainComponent: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    // 後端取數據
    setTimeout(() => {
      setUsers(fakeUsers);
      const preSelectedUsers = fakeUsers.filter((user: User) => user.selected);
      setSelectedUsers(preSelectedUsers);
    }, 0);
  }, []);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubmit = (users: User[]) => {
    setSelectedUsers(users);
    // 模擬將選中的用戶信息提交到後端
    axios.post('/api/selected-users', { users })
      .then(response => {
        console.log('成功在這裡:', response.data);
      })
      .catch(error => {
        console.error('失敗在這裡', error);
      });
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpenDialog} >
        {`擁有權限者：共 ${selectedUsers.length} 人`}
      </Button>
      <UserPickerDialog
        open={dialogOpen}
        users={users}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
      />
      {/* {selectedUsers.length > 0 && (
        <div>
          <h3>已選中的用戶：</h3>
          <ul>
            {selectedUsers.map(user => (
              <li key={user.id}>
                {user.id} {user.name}
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default MainComponent;
