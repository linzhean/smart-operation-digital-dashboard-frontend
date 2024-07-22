import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { User } from '../../services/types/userManagement';
import { makeStyles } from '@mui/styles';

interface UserPickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (selectedUsers: User[]) => void;
  users: User[];
  selectedUsers: User[];
  groupId: number;
}

const useStyles = makeStyles({
  dialogPaper: {
    width: '50%',
    height: '50%',
    maxHeight: '80%',
    maxWidth: '80%',
  },
});

const UserPickerDialog: React.FC<UserPickerDialogProps> = ({ open, onClose, onSubmit, users, selectedUsers, groupId }) => {
  const [currentSelectedIds, setCurrentSelectedIds] = useState<number[]>(selectedUsers.map(user => user.id));

  const handleChange = (event: SelectChangeEvent<number[]>) => {
    setCurrentSelectedIds(event.target.value as number[]);
  };

  const handleSubmit = () => {
    const selected = users.filter(user => currentSelectedIds.includes(user.id));
    onSubmit(selected);
    onClose();
  };

  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} classes={{ paper: classes.dialogPaper }}>
      <DialogTitle style={{ color: 'black', fontSize: '1.5rem', fontWeight: 'bold', width: 'auto', padding: '15px 24px 0px' }}>選擇用戶</DialogTitle>
      <DialogContent style={{ paddingTop: '15px' }}>
        <FormControl fullWidth>
          <InputLabel style={{
            color: '#1976d2',
            background: 'white',
            padding: '0px 10px'
          }}
          >選擇用戶</InputLabel>
          <Select
            multiple
            value={currentSelectedIds}
            onChange={handleChange}
            renderValue={(selected) => (
              <div>
                {users.filter(user => selected.includes(user.id)).map(user => (
                  <div key={user.id}>{user.name}</div>
                ))}
              </div>
            )}
          >
            {users.map(user => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">取消</Button>
        <Button onClick={handleSubmit} color="primary">確定</Button>
      </DialogActions>
    </Dialog >
    // <Dialog open={open} onClose={onClose} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} classes={{ paper: classes.dialogPaper }}>
    //   <DialogTitle style={{ color: 'black', fontSize: '1.5rem', fontWeight: 'bold', width: 'auto', padding: '15px 24px 0px' }}>
    //     新增使用者
    //   </DialogTitle>
    //   <DialogContent style={{ paddingTop: '15px' }}>
    //     <Autocomplete
    //       multiple
    //       options={users}
    //       getOptionLabel={(option) => `${option.name} (${option.email})`}
    //       onChange={(event, newValue) => {
    //         setSelectedUsers(newValue as User[]);
    //       }}
    //       value={selectedUsers}
    //       renderOption={(props, option) => (
    //         <li {...props} key={option.id}>
    //           {option.name} ({option.email})
    //         </li>
    //       )}
    //       renderInput={(params) => (
    //         <TextField
    //           {...params}
    //           variant="outlined"
    //           label="選擇用戶"
    //           placeholder="關鍵字搜尋..."
    //         />
    //       )}
    //     />
    //   </DialogContent>
    //   <DialogActions>
    //     <Button onClick={onClose}>取消</Button>
    //     <Button onClick={handleSubmit} color="primary">
    //       確認
    //     </Button>
    //   </DialogActions>
    // </Dialog>
  );
};

export default UserPickerDialog;
