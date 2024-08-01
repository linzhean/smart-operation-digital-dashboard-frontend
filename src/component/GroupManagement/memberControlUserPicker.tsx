import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  TextField,
  IconButton,
  Typography,
  Checkbox,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { User } from '../../services/types/userManagement';
import { getAllUsers } from '../../services/userManagementServices'; // Adjust import

interface UserPickerDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (selectedUsers: User[]) => void;
  onAddSelectedMembers: (selectedUsers: User[]) => void;
  selectedUsers: User[];
  groupId: number;
  users: User[];
}

const useStyles = makeStyles({
  dialogPaper: {
    width: '60%',
    height: '70%',
    maxHeight: '90%',
    maxWidth: '90%',
    backgroundColor: '#1e1e1e',
    color: 'white',
  },
  dialogTitle: {
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputLabel: {
    color: '#1976d2',
    background: '#1e1e1e',
    padding: '0px 10px',
  },
  dialogContent: {
    paddingTop: '15px',
    color: 'white',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
  },
  paginationButton: {
    color: 'white',
    fontSize: '1.5rem',
    margin: '0 10px',
    minWidth: '40px',
    minHeight: '40px',
    borderRadius: '4px',
    '&:disabled': {
      color: 'grey',
    },
  },
  chip: {
    margin: '4px',
    color: 'white',
    borderColor: 'grey',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    '& .MuiChip-deleteIcon': {
      fontSize: '24px',
      color: 'white',
      margin: '0 5px 0 -8px',
      transition: 'all 0.3s ease',
      '&:hover': {
        fontSize: '28px',
        color: '#ff6666',
        animation: '$spinAndGrow 0.7s ease-in-out',
      },
    },
  },
  '@keyframes spinAndGrow': {
    '0%': {
      transform: 'rotate(0deg) scale(1)',
    },
    '50%': {
      transform: 'rotate(180deg) scale(1.5)',
    },
    '100%': {
      transform: 'rotate(360deg) scale(1)',
    },
  },
  textField: {
    marginTop: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    padding: '0px',
    marginLeft: '0px',
    '& .MuiOutlinedInput-root': {
      '& input': {
        color: 'white',
      },
    },
  },
  cancel: {
    color: 'white',
  },
  submit: {
    color: 'white',
  },
  pageIndicator: {
    margin: '0 8px',
    color: 'white',
    fontSize: '1rem',
  },
});

const UserPickerDialog: React.FC<UserPickerDialogProps> = ({
  open,
  onClose,
  onSubmit,
  selectedUsers,
  onAddSelectedMembers,
  groupId,
  users,
}) => {
  const [currentSelectedIds, setCurrentSelectedIds] = useState<string[]>(selectedUsers.map(user => user.userId));
  const [localUsers, setLocalUsers] = useState<User[]>(users);
  const [searchText, setSearchText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage] = useState<number>(10);

  const classes = useStyles();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers(); // Fetch all users from API
        setLocalUsers(fetchedUsers);
      } catch (error: any) {
        console.error('Unable to fetch users:', error.message);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setLocalUsers(users);
  }, [users]);

  const handleDelete = (userId: string) => {
    setCurrentSelectedIds(currentSelectedIds.filter(id => id !== userId));
  };

  const handleAdd = (userId: string) => {
    setCurrentSelectedIds([...currentSelectedIds, userId]);
  };

  const handleToggleUser = (user: User) => {
    setCurrentSelectedIds(prev =>
      prev.includes(user.userId)
        ? prev.filter(id => id !== user.userId)
        : [...prev, user.userId]
    );
  };

  const handleSubmit = () => {
    const selected = localUsers.filter(user => currentSelectedIds.includes(user.userId));
    onAddSelectedMembers(selected);
    onClose();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const filteredUsers = localUsers.filter(user =>
    user.userName.includes(searchText) || user.userId.includes(searchText)
  );

  const availableUsers = filteredUsers.filter(user => !currentSelectedIds.includes(user.userId));

  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = availableUsers.slice(startIndex, startIndex + usersPerPage);
  const totalPages = Math.ceil(availableUsers.length / usersPerPage);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      classes={{ paper: classes.dialogPaper }}
    >
      <DialogTitle className={classes.dialogTitle}>选择用户</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <div style={{ margin: '10px 0', color: 'grey' }}>已選用戶</div>
        <div>
          {currentSelectedIds.map(id => {
            const user = localUsers.find(user => user.userId === id);
            return user ? (
              <Chip
                key={user.userId}
                label={`${user.userName} ${user.userId}`}
                onDelete={() => handleDelete(user.userId)}
                className={classes.chip}
                variant="outlined"
              />
            ) : null;
          })}
        </div>
        <TextField
          placeholder="輸入以快速搜尋"
          variant="outlined"
          fullWidth
          className={classes.textField}
          value={searchText}
          onChange={handleSearchChange}
        />
        <div style={{ margin: '10px 0', color: 'grey' }}>可選用戶</div>
        <div>
          {paginatedUsers.map(user => (
            <div key={user.userId}>
              <Checkbox
                checked={currentSelectedIds.includes(user.userId)}
                onChange={() => handleToggleUser(user)}
                style={{ color: 'white' }}
              />
              <span style={{ color: 'white' }}>{user.userName}</span>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} className={classes.cancel}>取消</Button>
        <Button onClick={handleSubmit} className={classes.submit}>确认</Button>
      </DialogActions>
      <div className={classes.pagination}>
        <IconButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={classes.paginationButton}
        >
          <ChevronLeftIcon />
        </IconButton>
        <Typography className={classes.pageIndicator}>{currentPage}</Typography>
        <IconButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={classes.paginationButton}
        >
          <ChevronRightIcon />
        </IconButton>
      </div>
    </Dialog>
  );
};

export default UserPickerDialog;
