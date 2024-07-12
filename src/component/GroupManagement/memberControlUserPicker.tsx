import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  dialogPaper: {
    width: '50%',
    height: '50%',
    maxHeight: '80%',
    maxWidth: '80%',
  },
});

type User = {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
};

const UserPickerDialog: React.FC<{
  open: boolean;
  users: User[];
  onClose: () => void;
  onSubmit: (selectedUsers: User[]) => void;
}> = ({ open, users, onClose, onSubmit }) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const handleSubmit = () => {
    onSubmit(selectedUsers);
    onClose();
  };

  const classes = useStyles();
  return (
    <Dialog open={open} onClose={onClose} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} classes={{ paper: classes.dialogPaper }}>
      <DialogTitle
        style={{
          color: 'black', fontSize: '1.5rem', fontWeight: 'bold', width: 'auto', padding: '10px 24px 0px 24px'
        }}>
        新增使用者
      </DialogTitle>
      <DialogContent style={{ paddingTop: '15px' }}>
        <Autocomplete
          multiple
          options={users}
          getOptionLabel={(option) => `${option.name} (${option.email})`}
          onChange={(event, newValue) => {
            setSelectedUsers(newValue as User[]);
          }}
          value={selectedUsers}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {option.name} ({option.email})
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
  );
};

export default UserPickerDialog;
