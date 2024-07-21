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
          console.error('API 返回的数据格式不正确:', response);
          setMemberData([]);
        }
      } catch (error) {
        console.error('获取群组用户失败:', error);
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
          console.error('API 返回的用户列表格式不正确:', users);
          setAllUsers([]);
        }
      } catch (error) {
        console.error('获取所有用户失败:', error);
        setAllUsers([]);
      }
    };

    fetchAllUsers();
  }, []);

  // Remove a user from the group
  const handleRemove = async (id: string, name: string) => {
    if (window.confirm(`你确定要将成员 ${name} 移除群组吗？`)) {
      try {
        await removeUserFromGroup(groupId, parseInt(id, 10));
        setMemberData(prevData => prevData.filter(member => member.userId !== id));
      } catch (error) {
        console.error('移除用户失败:', error);
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
      console.error('添加用户到群组失败:', error);
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
          群组内成员
        </button>
        <button
          id="graphControl"
          onClick={() => handleButtonClick('graphControl')}
          className={activeButton === 'graphControl' ? styles.filterActive : ''}
        >
          群组可视图表
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
              新增成员
            </Button>
            {showMemberPicker && (
              <UserPickerDialog
                open={showMemberPicker}
                onClose={() => setShowMemberPicker(false)}
                onSubmit={handleAddMember}
                groupId={groupId}
                users={allUsers.filter(user => !memberData.some(member => member.userId === user.userId))}
                selectedUsers={[]} // 假设开始时为空数组
              />
            )}
            <div className={styles.theList}>
              <table className="custom-scrollbar">
                <thead>
                  <tr>
                    <th>姓名</th>
                    <th>所属部门</th>
                    <th>职务</th>
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
                  <th>图表名称</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {['图表A', '图表B', '图表C'].map((item, index) => (
                  <tr key={index}>
                    <td>{item}</td>
                    <td>操作按钮</td>
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
