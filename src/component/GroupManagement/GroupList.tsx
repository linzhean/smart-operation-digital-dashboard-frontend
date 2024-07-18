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
import { fetchUsersByGroupId, addUserToGroup, removeUserFromGroup, deleteGroup } from '../../services/GroupApi'; // 添加 deleteGroup 引入
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
      <DialogTitle style={{ color: 'black', fontSize: '1.5rem', fontWeight: 'bold', width: 'auto', padding: '15px 24px 0px' }}>
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
              placeholder="關鍵字搜尋..."
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

const GroupList: React.FC<{ groupId: number }> = ({ groupId }) => {
  const [activeButton, setActiveButton] = useState('memberControl');
  const [memberData, setMemberData] = useState<User[]>([]);
  const [availableMembers, setAvailableMembers] = useState<User[]>([]);
  const [showMemberPicker, setShowMemberPicker] = useState(false);

  //圖表權限設定
  const [graphToggleStates, setGraphToggleStates] = useState<{ [key: string]: 'allow' | 'deny' }>({
    生產率: 'deny',
    廢品率: 'deny',
    產能利用率: 'deny',
  });

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
    if (window.confirm(`您確定要將【${name}】從群組中移除嗎？`)) {
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

  // 點擊修改狀態必須跳確認框
  // const toggleGraphState = (graphName: string) => {
  //   const newState = graphToggleStates[graphName] === 'allow' ? 'deny' : 'allow';
  //   if (window.confirm(`您確定要將【${graphName}】權限設置為${newState === 'allow' ? '允許' : '禁用'}嗎？`)) {
  //     setGraphToggleStates((prevStates) => ({
  //       ...prevStates,
  //       [graphName]: newState,
  //     }));
  //   }
  // };

  // 上面才是真的 這個是為了看一下consolelog
  const toggleGraphState = (graphName: string) => {
    const newState: 'allow' | 'deny' = graphToggleStates[graphName] === 'allow' ? 'deny' : 'allow';
    if (window.confirm(`您確定要將【${graphName}】權限設置為${newState === 'allow' ? '允許' : '禁用'}嗎？`)) {
      setGraphToggleStates((prevStates) => {
        const updatedStates: { [key: string]: 'allow' | 'deny' } = {
          ...prevStates,
          [graphName]: newState,
        };
        console.log('Updated graphToggleStates:', updatedStates);
        return updatedStates;
      });
    }
  };

  const handleDeleteGroup = async () => {
    if (window.confirm('您確定要刪除這個群組嗎？')) {
      try {
        await deleteGroup(groupId);
        // 放這裡
      } catch (error) {
        console.error('Failed to delete group:', error);
      }
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
          群組成員
          <span></span><span></span><span></span><span></span>
        </button>
        <button
          id="graphControl"
          onClick={() => handleButtonClick('graphControl')}
          className={activeButton === 'graphControl' ? styles.filterActive : ''}
        >
          群組可視圖表
          <span></span><span></span><span></span><span></span>
        </button>
      </div>

      <div className={styles.theTable}>
        {/* 顯示的是成員列表 */}
        {activeButton === 'memberControl' && (
          <>
            <Button variant="contained" color="primary" onClick={() => setShowMemberPicker(true)} className={styles.addButton}>
              新增成員
            </Button>
            <Button variant="contained" color="secondary" onClick={handleDeleteGroup} className={styles.deleteGroupButton}>
              刪除群組
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
                    <th>員編</th>
                    <th>姓名</th>
                    <th>信箱</th>
                    <th>部門</th>
                    <th>職稱</th>
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

        {/* 顯示群組可視圖表 */}
        {activeButton === 'graphControl' && (
          <div className={styles.theList}>
            <table className="custom-scrollbar">
              <thead>
                <tr>
                  <th>圖表名稱</th>
                  <th>狀態</th>
                </tr>
              </thead>
              <tbody>
                {/* 渲染【所有】可以用的圖表，在右側選擇個別圖表是否允許或禁用 */}
                {['生產率', '廢品率', '產能利用率'].map((item, index) => (
                  <tr key={index}>
                    <td>{item}</td>
                    <td>
                      <button
                        className={`${styles.toggleButton} ${graphToggleStates[item] === 'allow' ? styles.allow : styles.deny}`}
                        onClick={() => toggleGraphState(item)}
                      >
                        {graphToggleStates[item] === 'allow' ? '目前狀態：允許' : '目前狀態：禁用'}
                      </button>
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
