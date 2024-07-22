import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { User } from '../../services/types/userManagement';

interface UserPickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (selectedUsers: User[]) => void;
  users: User[];  // 添加 users 属性
  selectedUsers: User[];
  groupId: number;
}

const UserPickerDialog: React.FC<UserPickerDialogProps> = ({ open, onClose, onSubmit, users, selectedUsers, groupId }) => {
  const [currentSelectedIds, setCurrentSelectedIds] = React.useState<string[]>(selectedUsers.map(user => user.userId));

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    setCurrentSelectedIds(event.target.value as string[]);
  };

  const handleSubmit = () => {
    const selected = users.filter(user => currentSelectedIds.includes(user.userId));
    onSubmit(selected);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>选择用户</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>选择用户</InputLabel>
          <Select
            multiple
            value={currentSelectedIds}
            onChange={handleChange}
            renderValue={(selected) => (
              <div>
                {users.filter(user => selected.includes(user.userId)).map(user => (
                  <div key={user.userId}>{user.userName}</div>
                ))}
              </div>
            )}
          >
            {users.map(user => (
              <MenuItem key={user.userId} value={user.userId}>
                {user.userName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">取消</Button>
        <Button onClick={handleSubmit} color="primary">确认</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserPickerDialog;
