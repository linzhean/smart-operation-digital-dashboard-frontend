import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { EmployeeData } from '../../services/types/userManagement';

type User = EmployeeData & { selected?: boolean, id: string };

interface UserPickerProps {
  open: boolean;
  users: User[];
  onClose: () => void;
  onSubmit: (selectedUsers: User[]) => void;
}

const UserPicker: React.FC<UserPickerProps> = ({ open, users, onClose, onSubmit }) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!users || !Array.isArray(users)) {
      setSelectedUsers([]);
      return;
    }
  
    const preSelectedUsers = users.filter((user) => user.selected);
    setSelectedUsers(preSelectedUsers);
  }, [users]);
  
  const handleSubmit = () => {
    onSubmit(selectedUsers);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <DialogTitle style={{ color: 'black', fontSize: '1.5rem', fontWeight: 'bold' }}>匯出資料權限設置</DialogTitle>
      <DialogContent style={{ paddingTop: '15px' }}>
        <Autocomplete
          multiple
          options={users || []} // Ensure `users` is an array
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

export default UserPicker;
