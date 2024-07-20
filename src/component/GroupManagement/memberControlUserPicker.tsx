import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { User } from '../../services/types/userManagement';

interface UserPickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (selectedUsers: User[]) => void;
  users: User[];
  selectedUsers: User[];
  groupId: number;
}

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
        <Button onClick={handleSubmit} color="primary">确定</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserPickerDialog;
