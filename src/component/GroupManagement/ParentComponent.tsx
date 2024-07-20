import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import UserPickerDialog from './memberControlUserPicker';
import { User } from '../../services/types/userManagement';
import { getUserList } from '../../services/userManagementServices'; // 确保导入路径正确

const ParentComponent: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]); // 新的状态变量

  // 获取用户数据
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUserList(); // 使用 list 端点
        setUsers(fetchedUsers);
      } catch (error: any) {
        console.error('无法获取用户:', error.message);
      }
    };

    fetchUsers();
  }, [selectedGroupIds]); // 当 selectedGroupIds 变化时重新获取用户数据

  // 打开对话框
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  // 关闭对话框
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // 提交选中的用户
  const handleSubmitUsers = (selectedUsers: User[]) => {
    console.log('选中的用户:', selectedUsers);
    setSelectedUsers(selectedUsers);
    // 处理提交逻辑
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpenDialog}>
        选择用户
      </Button>
      <UserPickerDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmitUsers}
        users={users}
        selectedUsers={selectedUsers}
        groupId={0} // groupId 可以用在需要的地方
      />
      <div>
        <h3>已选择的用户:</h3>
        {selectedUsers.length > 0 ? (
          <ul>
            {selectedUsers.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        ) : (
          <p>未选择用户</p>
        )}
      </div>
    </div>
  );
};

export default ParentComponent;
