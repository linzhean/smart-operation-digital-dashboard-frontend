import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { makeStyles } from '@mui/styles';
import styles from './GroupList.module.css';
import { fetchUsersByGroupId, addUserToGroup, removeUserFromGroup } from '../../services/GroupApi';
import { User } from '../../services/types/userManagement';
import { getUsers } from '../../services/userManagementServices';

const useStyles = makeStyles({
  dialogPaper: {
    width: '50%',
    height: '50%',
    maxHeight: '80%',
    maxWidth: '80%',
  },
});

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
      <DialogTitle style={{ color: 'black', fontSize: '1.5rem', fontWeight: 'bold', width: 'auto', padding: '10px 24px 0px 24px' }}>
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
              label="选择用户"
              placeholder="或输入文字以查找..."
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSubmit} color="primary">
          确认
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const GroupList: React.FC<{ groupId: number }> = ({ groupId }) => {
  const [activeButton, setActiveButton] = useState('memberControl');
  const [memberData, setMemberData] = useState<User[]>([]);
  const [availableMembers, setAvailableMembers] = useState<User[]>([]);
  const [showMemberPicker, setShowMemberPicker] = useState(false);

  useEffect(() => {
    const fetchGroupUsers = async () => {
      try {
        const users = await fetchUsersByGroupId(groupId);
        setMemberData(users);
        const allUsers: User[] = await getUsers(); // 從 API 加載所有用戶
        setAvailableMembers(allUsers.filter(user => !users.some(member => member.id === user.id)));
      } catch (error) {
        console.error('Failed to fetch group users:', error);
      }
    };

    fetchGroupUsers();
  }, [groupId]);

  const handleButtonClick = (buttonId: string) => {
    setActiveButton(buttonId);
  };

  const handleRemove = async (id: any, name: string) => {
    if (window.confirm(`你确定要将成员 ${name} 移除群组吗？`)) {
      try {
        await removeUserFromGroup(groupId, id); // API 調用刪除用戶
        setMemberData(prevData => prevData.filter(member => member.id !== id));
      } catch (error) {
        console.error('Failed to remove user from group:', error);
      }
    }
  };

  const handleAddMember = async (newMembers: User[]) => {
    try {
      await Promise.all(newMembers.map(user => addUserToGroup(groupId, Number(user.id))));
      setMemberData(prevData => [...prevData, ...newMembers]);
      setAvailableMembers(prevData => prevData.filter(member => !newMembers.some(newMember => newMember.id === member.id)));
    } catch (error) {
      console.error('Failed to add users to group:', error);
    }
  };

  return (
    <>
      <div className={styles.filterButton}>
        <button
          id="memberControl"
          onClick={() => handleButtonClick('memberControl')}
          className={activeButton === 'memberControl' ? styles.filterActive : ''}
        >
          群组内成员
          <span></span><span></span><span></span><span></span>
        </button>
        <button
          id="graphControl"
          onClick={() => handleButtonClick('graphControl')}
          className={activeButton === 'graphControl' ? styles.filterActive : ''}
        >
          群组可视图表
          <span></span><span></span><span></span><span></span>
        </button>
      </div>

      <div className={styles.theTable}>
        {activeButton === 'memberControl' && (
          <>
            <Button variant="contained" color="primary" onClick={() => setShowMemberPicker(true)} className={styles.addButton}>
              新增成员
            </Button>
            {showMemberPicker && (
              <UserPickerDialog
                open={showMemberPicker}
                users={availableMembers.filter(member => !memberData.some(selected => selected.id === member.id))}
                onClose={() => setShowMemberPicker(false)}
                onSubmit={handleAddMember}
              />
            )}
            <div className={styles.theList}>
              <table className="custom-scrollbar">
                <thead>
                  <tr>
                    <th>工号</th>
                    <th>姓名</th>
                    <th>邮箱</th>
                    <th>所属部门</th>
                    <th>职务</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {memberData.map((member, index) => (
                    <tr key={index}>
                      <td>{member.id}</td>
                      <td>{member.name}</td>
                      <td>{member.email}</td>
                      <td>{member.department}</td>
                      <td>{member.position}</td>
                      <td>
                        <button
                          className={styles.removeButton}
                          onClick={() => handleRemove(member.id, member.name)}
                        >
                          移除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {activeButton === 'graphControl' && (
          <div className={styles.theList}>
            <table className="custom-scrollbar">
              <thead>
                <tr>
                  <th>图表名称</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {['图表A', '图表B', '图表C'].map((item, index) => (
                  <tr key={index}>
                    <td>{item}</td>
                    <td>
                      移除
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default GroupList;