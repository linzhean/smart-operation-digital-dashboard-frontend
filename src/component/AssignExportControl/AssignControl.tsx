import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { fetchAllUsers } from '../../services/UserAccountService';
import { fetchAllCharts, getAssignedTaskSponsors, setAssignedTaskSponsors } from '../../services/AssignedTaskService';
import { UserAccountBean } from '../../services/types/userManagement';
import { makeStyles } from '@mui/styles';
import styles from './AssignControl.module.css';

const useStyles = makeStyles({
  dialogPaper: {
    width: '50%',
    height: '50%',
    maxHeight: '80%',
    maxWidth: '80%',
  },
});

interface User extends UserAccountBean {
  selected?: boolean;
}

interface Chart {
  id: number;
  name: string;
}

const UserPickerDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: (selectedUsers: User[]) => void;
  chartId: number;
}> = ({ open, onClose, onSubmit, chartId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchAllUsers()
      .then((data) => {
        const userList: User[] = data.map((user: UserAccountBean) => ({
          ...user,
          available: user.available === true,
        }));
        setUsers(userList);
      })
      .catch((error) => {
        console.error('Error fetching users', error);
      });
  }, []);

  useEffect(() => {
    if (chartId > 0) {
      getAssignedTaskSponsors(chartId)
        .then((response) => {
          if (response.data) {
            const sponsorList = response.data.sponsorList || [];
            const selectedSponsorUsers = users.filter(user => sponsorList.includes(user.userId));
            setSelectedUsers(selectedSponsorUsers);
          }
        })
        .catch((error) => {
          console.error('Error fetching sponsors', error);
        });
    }
  }, [chartId, users]);

  const handleSubmit = () => {
    onSubmit(selectedUsers);
    onClose();
  };

  const classes = useStyles();
  return (
    <Dialog open={open} onClose={onClose} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} classes={{ paper: classes.dialogPaper }}>
      <DialogTitle style={{ color: 'black', fontSize: '1.5rem', fontWeight: 'bold', width: 'auto', padding: '10px 24px 0px 24px' }}>
        交辦事項權限設置
      </DialogTitle>
      <DialogContent style={{ paddingTop: '15px' }}>
        <Autocomplete
          multiple
          options={users}
          getOptionLabel={(option) => `${option.userId} ${option.userName}`}
          onChange={(event, newValue) => {
            setSelectedUsers(newValue as User[]);
          }}
          value={selectedUsers}
          renderOption={(props, option) => (
            <li {...props}>
              {option.userId} {option.userName}
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

const AssignTaskControl: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentChart, setCurrentChart] = useState(0);
  const [selectedUsersMap, setSelectedUsersMap] = useState<{ [key: number]: User[] }>({});
  const [charts, setCharts] = useState<Chart[]>([]);

  useEffect(() => {
    fetchAllCharts()
      .then((response) => {
        if (response.data) {
          setCharts(response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching charts', error);
      });
  }, []);

  const handleOpenDialog = (chartId: number) => {
    setCurrentChart(chartId);
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

    const chartId = currentChart;
    const userIds = selectedUsers.map(user => user.userId);

    setAssignedTaskSponsors(chartId, {
      sponsorList: userIds,
      exporterList: [], // Assuming you manage exporterList separately
      dashboardCharts: [chartId],
    })
      .then((response) => {
        console.log('Successfully submitted', response.message);
      })
      .catch((error) => {
        console.error('Submission failed', error);
      });

    setDialogOpen(false);
  };

  const getSelectedUserNames = (chartId: number) => {
    const selectedUsers = selectedUsersMap[chartId] || [];
    return selectedUsers.length > 0 ? `擁有權限者：共 ${selectedUsers.length} 人` : '設置交辦權限';
  };

  return (
    <>
      <div className={styles.theTable}>
        <div className={styles.theList}>
          <table className="custom-scrollbar">
            <thead>
              <tr>
                <th>圖表名稱</th>
                <th>交辦事項權限設置</th>
              </tr>
            </thead>
            <tbody>
              {charts.map((chart) => (
                <tr key={chart.id}>
                  <td>{chart.name}</td>
                  <td>
                    <Button variant="contained" color="primary" onClick={() => handleOpenDialog(chart.id)}>
                      {getSelectedUserNames(chart.id)}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <UserPickerDialog open={dialogOpen} onClose={handleCloseDialog} onSubmit={handleSubmit} chartId={currentChart} />
    </>
  );
};

export default AssignTaskControl;
