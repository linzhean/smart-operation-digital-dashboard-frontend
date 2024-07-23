import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Pagination } from '@mui/material';
import { User } from '../../services/types/userManagement';
import { getUserList } from '../../services/userManagementServices';
import { makeStyles } from '@mui/styles';

interface UserPickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (selectedUsers: User[]) => void;
  onAddSelectedMembers: (selectedUsers: User[]) => void; // Update here
  selectedUsers: User[];
  groupId: number;
  users: User[];
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
  inputLabel: {
    color: '#1976d2',
    background: 'white',
    padding: '0px 10px',
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

const UserPickerDialog: React.FC<UserPickerDialogProps> = ({ open, onClose, onSubmit, selectedUsers, groupId, users }) => {
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [currentSelectedIds, setCurrentSelectedIds] = useState<string[]>(selectedUsers.map(user => user.userId));
  const [localUsers, setLocalUsers] = useState<User[]>(users);

  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  useEffect(() => {
    const fetchTotalPages = async () => {
      try {
        const response = await fetch('/user-account/page');
        const data = await response.json();
        if (data.result && data.data) {
          setTotalPages(data.data); // Assuming this is a number representing the total number of pages
        } else {
          throw new Error('Failed to fetch total pages: ' + data.message);
        }
      } catch (error: any) {
        console.error('Failed to fetch total pages: ', error.message);
      }
    };

    fetchTotalPages();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersList = await getUserList(undefined, undefined, undefined, currentPage); // Update this call according to your API
        setLocalUsers(usersList);
      } catch (error: any) {
        console.error('Unable to fetch users:', error.message);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    setCurrentSelectedIds(event.target.value as string[]);
  };

  const handleSubmit = () => {
    const selected = localUsers.filter(user => currentSelectedIds.includes(user.userId));
    onAddSelectedMembers(selected);
    onClose();
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value - 1);
  };

  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" classes={{ paper: classes.dialogPaper }} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <DialogTitle className={classes.dialogTitle}>選擇用戶</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <FormControl fullWidth>
          <InputLabel className={classes.inputLabel}>選擇用戶</InputLabel>
          <Select
            multiple
            value={currentSelectedIds}
            onChange={handleChange}
            renderValue={(selected) => (
              <div>
                {localUsers.filter(user => selected.includes(user.userId)).map(user => (
                  <div key={user.userId}>{user.userName}</div>
                ))}
              </div>
            )}
          >
            {localUsers.map(user => (
              <MenuItem key={user.userId} value={user.userId}>
                {user.userName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">取消</Button>
        <Button onClick={handleSubmit} color="primary">確認</Button>
      </DialogActions>
      <div className={classes.pagination}>
        <Pagination count={totalPages} page={currentPage + 1} onChange={handlePageChange} />
      </div>
    </Dialog>
  );
};

export default UserPickerDialog;
function onAddSelectedMembers(selected: User[]) {
  throw new Error('Function not implemented.');
}

