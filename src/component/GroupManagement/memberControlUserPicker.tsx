import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  Pagination,
} from '@mui/material';
import { User } from '../../services/types/userManagement';
import { getAllUsers } from '../../services/userManagementServices'; // Adjust import
import { makeStyles } from '@mui/styles';

interface UserPickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (selectedUsers: User[]) => void;
  groupId: number;
  users: User[];
  selectedUsers: User[];
  onAddSelectedMembers: (selectedUsers: User[]) => void;
}

const useStyles = makeStyles({
  dialogPaper: {
    width: '50%',
    height: '50%',
    maxHeight: '80%',
    maxWidth: '80%',
  },
  dialogTitle: {
    color: 'black',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    width: 'auto',
    padding: '15px 24px 0px',
  },
  dialogContent: {
    paddingTop: '15px',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    padding: '16px',
  },
});

const UserPickerDialog: React.FC<UserPickerDialogProps> = ({
  open,
  onClose,
  onSubmit,
  groupId,
  users,
  selectedUsers,
  onAddSelectedMembers
}) => {
  const [localSelectedUsers, setLocalSelectedUsers] = useState<User[]>(selectedUsers);
  const [localUsers, setLocalUsers] = useState<User[]>(users);

  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers(); // Fetch all users
        setLocalUsers(fetchedUsers);
      } catch (error: any) {
        console.error('Unable to fetch users:', error.message);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleUser = (user: User) => {
    setLocalSelectedUsers(prev =>
      prev.some(u => u.userId === user.userId)
        ? prev.filter(u => u.userId !== user.userId)
        : [...prev, user]
    );
  };

  const handleSubmit = () => {
    onAddSelectedMembers(localSelectedUsers); // Use the correct function
    onClose();
  };

  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      classes={{ paper: classes.dialogPaper }}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <DialogTitle className={classes.dialogTitle}>选择用户</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {localUsers.map(user => (
          <div key={user.userId}>
            <Checkbox
              checked={localSelectedUsers.some(u => u.userId === user.userId)}
              onChange={() => handleToggleUser(user)}
            />
            {user.userName}
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">取消</Button>
        <Button onClick={handleSubmit} color="primary">确认</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserPickerDialog;
