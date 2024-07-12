import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { makeStyles } from '@mui/styles';
import styles from './GroupList.module.css';

// 邏輯:在打開 UserPickerDialog 對話框時，
// 過濾掉已經在 選中數組 中的用戶，這樣Picker對話框中的用戶列表只包含未選中的用戶
// 避免重複選擇
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

// 所有用戶數據
const fakeUsers: User[] = [
  { id: '321', name: 'Tom Brown', email: 'tom.brown@example.com', department: 'Sales', position: 'Salesperson' },
  { id: '654', name: 'Emma White', email: 'emma.white@example.com', department: 'IT', position: 'Developer' },
  { id: '987', name: 'Olivia Black', email: 'olivia.black@example.com', department: 'Support', position: 'Support Agent' },
  { id: '123', name: 'John Doe', email: 'john.doe@example.com', department: 'Engineering', position: 'Engineer' },
  { id: '456', name: 'Jane Smith', email: 'jane.smith@example.com', department: 'Marketing', position: 'Manager' },
  { id: '789', name: 'Alice Johnson', email: 'alice.johnson@example.com', department: 'HR', position: 'Recruiter' },
];

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

const GroupList: React.FC = () => {
  const [activeButton, setActiveButton] = useState('memberControl');
  const [memberData, setMemberData] = useState<User[]>([
    // 【被選中】假用戶數據
    { id: '123', name: 'John Doe', email: 'john.doe@example.com', department: 'Engineering', position: 'Engineer' },
    { id: '456', name: 'Jane Smith', email: 'jane.smith@example.com', department: 'Marketing', position: 'Manager' },
    { id: '789', name: 'Alice Johnson', email: 'alice.johnson@example.com', department: 'HR', position: 'Recruiter' },
  ]);

  const [availableMembers, setAvailableMembers] = useState<User[]>(fakeUsers);
  const [showMemberPicker, setShowMemberPicker] = useState(false);

  useEffect(() => {
    setAvailableMembers(fakeUsers);
  }, []);

  const handleButtonClick = (buttonId: string) => {
    setActiveButton(buttonId);
  };

  const handleRemove = (id: string, name: string) => {
    if (window.confirm(`你確定要將成員 ${name} 移除群組嗎？`)) {
      setMemberData(prevData => prevData.filter(member => member.id !== id));
    }
  };

  const handleAddMember = (newMembers: User[]) => {
    setMemberData(prevData => [...prevData, ...newMembers]);
    setAvailableMembers(prevData => prevData.filter(member => !newMembers.some(newMember => newMember.id === member.id)));
  };

  return (
    <>
      {/* 右側部分 */}
      <div className={styles.filterButton}>
        {/* 切換表格按鈕 */}
        <button
          id="memberControl"
          onClick={() => handleButtonClick('memberControl')}
          className={activeButton === 'memberControl' ? styles.filterActive : ''}
        >
          群組內成員
          {/* 裝飾不要刪!!!!! */}
          <span></span><span></span><span></span><span></span>
        </button>

        {/* 交辦權限管理按鈕 */}
        <button
          id="graphControl"
          onClick={() => handleButtonClick('graphControl')}
          className={activeButton === 'graphControl' ? styles.filterActive : ''}
        >
          群組可視圖表
          {/* 裝飾別刪!!!!!!! */}
          <span></span><span></span><span></span><span></span>
        </button>
      </div>

      <div className={styles.theTable}>
        {activeButton === 'memberControl' && (
          <>
            <Button variant="contained" color="primary" onClick={() => setShowMemberPicker(true)} className={styles.addButton}>
              新增成員
            </Button>
            {showMemberPicker && (
              <UserPickerDialog
                open={showMemberPicker}
                users={availableMembers.filter(member => !memberData.some(selected => selected.id === member.id))}
                onClose={() => setShowMemberPicker(false)}
                onSubmit={handleAddMember}
              />
            )}
            <Button variant="contained" color="primary" onClick={() => setShowMemberPicker(true)} >
              刪除表單
            </Button>
            <div className={styles.theList}>
              <table className="custom-scrollbar">
                <thead>
                  <tr>
                    <th>工號</th>
                    <th>姓名</th>
                    <th>信箱</th>
                    <th>所屬部門</th>
                    <th>職務</th>
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
                  <th>圖表名稱</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {['圖表A', '圖表B', '圖表C'].map((item, index) => (
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
