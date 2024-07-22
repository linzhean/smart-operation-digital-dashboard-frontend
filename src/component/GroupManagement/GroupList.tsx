import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { fetchUsersByGroupId, addUserToGroup, removeUserFromGroup } from '../../services/GroupApi';
import { User } from '../../services/types/userManagement';
import { getUsers } from '../../services/userManagementServices';
import UserPickerDialog from './memberControlUserPicker';
import styles from './GroupList.module.css';

interface GroupListProps {
  groupId: number;
  activeButton: string;
  handleButtonClick: (buttonId: string) => void;
}

const GroupList: React.FC<GroupListProps> = ({ groupId, activeButton, handleButtonClick }) => {
  const [memberData, setMemberData] = useState<User[]>([]);
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Fetch users of the current group
  useEffect(() => {
    const fetchGroupUsers = async () => {
      try {
        const response = await fetchUsersByGroupId(groupId);
        if (Array.isArray(response)) {
          setMemberData(response);
        } else {
          console.error('API 返回的數據不正確:', response);
          setMemberData([]);
        }
      } catch (error) {
        console.error('獲取群組用戶失敗:', error);
      }
    };

    fetchGroupUsers();
  }, [groupId]);

  // Fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const users = await getUsers();
        if (Array.isArray(users)) {
          setAllUsers(users);
        } else {
          console.error('API 返回的用戶格式不正確:', users);
          setAllUsers([]);
        }
      } catch (error) {
        console.error('獲取所有用戶失敗:', error);
        setAllUsers([]);
      }
    };

    fetchAllUsers();
  }, []);

  // Remove a user from the group
  const handleRemove = async (id: string, name: string) => {
    if (window.confirm(`您確定要將【${name}】從群組中移除嗎？`)) {
      try {
        await removeUserFromGroup(groupId, parseInt(id, 10));
        setMemberData(prevData => prevData.filter(member => member.userId !== id));
      } catch (error) {
        console.error('移除用戶失敗:', error);
      }
    }
  };

  // Add new members to the group
  const handleAddMember = async (newMembers: User[]) => {
    try {
      await Promise.all(newMembers.map(user =>
        addUserToGroup({ userId: user.userId, groupId: groupId })
      ));
      setMemberData(prevData => [...prevData, ...newMembers]);
    } catch (error) {
      console.error('添加用戶到群組失敗:', error);
    }
  };

  return (
    <div>
      <div className={styles.filterButton}>
        <button
          id="memberControl"
          onClick={() => handleButtonClick('memberControl')}
          className={activeButton === 'memberControl' ? styles.filterActive : ''}
        >
          群組成員
        </button>
        <button
          id="graphControl"
          onClick={() => handleButtonClick('graphControl')}
          className={activeButton === 'graphControl' ? styles.filterActive : ''}
        >
          群組可視圖表
        </button>
      </div>

      <div className={styles.theTable}>
        {activeButton === 'memberControl' && (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowMemberPicker(true)}
              className={styles.addButton}
            >
              新增成員
            </Button>
            {showMemberPicker && (
              <UserPickerDialog
                open={showMemberPicker}
                onClose={() => setShowMemberPicker(false)}
                onSubmit={handleAddMember}
                groupId={groupId}
                users={allUsers.filter(user => !memberData.some(member => member.userId === user.userId))}
                selectedUsers={[]}
              />
            )}
            <div className={styles.theList}>
              <table className="custom-scrollbar">
                <thead>
                  <tr>
                    <th>姓名</th>
                    <th>所屬部門</th>
                    <th>職稱</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {memberData.map(member => (
                    <tr key={member.userId}>
                      <td>{member.userName}</td>
                      <td>{member.department}</td>
                      <td>{member.position || '未指定'}</td>
                      <td>
                        <Button variant="outlined" onClick={() => handleRemove(member.userId, member.userName)}>
                          移除
                        </Button>
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
                {['生產率', '產能利用率', '廢品率'].map((item, index) => (
                  <tr key={index}>
                    <td>{item}</td>
                    <td>操作</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupList;
