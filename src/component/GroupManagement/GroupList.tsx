import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import UserPickerDialog from './memberControlUserPicker';
import { fetchUsersByGroupId, addUserToGroup, removeUserFromGroup, deleteGroup, updateGroupChartPermissions } from '../../services/GroupApi';
import ChartService from '../../services/ChartService';
import { getUsers } from '../../services/userManagementServices';
import styles from './GroupList.module.css';
import moreInfo from '../../assets/icon/more.svg';
import { User } from '../../services/types/userManagement';

interface GroupListProps {
  groupId: number;
  activeButton: string;
  handleButtonClick: (buttonId: string) => void;
  onDeleteGroup: (groupId: number) => void;
}

const GroupList: React.FC<GroupListProps> = ({ groupId, activeButton, handleButtonClick, onDeleteGroup }) => {
  const [memberData, setMemberData] = useState<User[]>([]);
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [chartPermissions, setChartPermissions] = useState<{ [key: number]: boolean }>({});
  const [charts, setCharts] = useState<{ id: number; name: string }[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Fetch group details and charts
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const [userList, chartsResponse] = await Promise.all([
          fetchUsersByGroupId(groupId),
          ChartService.getAllCharts()
        ]);

        // Validate and set userList and chartsResponse
        setMemberData(userList);

        if (chartsResponse.result && Array.isArray(chartsResponse.data)) {
          setCharts(chartsResponse.data);

          const initialPermissions: { [key: number]: boolean } = {};
          chartsResponse.data.forEach((chart: { id: number }) => {
            initialPermissions[chart.id] = false;
          });
          setChartPermissions(initialPermissions);
        } else {
          throw new Error('Unexpected charts response format');
        }
      } catch (error) {
        console.error('獲取群組和圖表信息失敗:', error);
      }
    };

    fetchGroupData();
  }, [groupId]);

  // Fetch all users
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const userList = await getUsers();
        setAllUsers(userList);
      } catch (error) {
        console.error('獲取所有用戶失敗:', error);
      }
    };

    fetchAllUsers();
  }, []);

  // Remove user from group
  const handleRemove = async (id: string, name: string) => {
    if (window.confirm(`您確定要將【${name}】從群組中移除嗎？`)) {
      try {
        await removeUserFromGroup(groupId, id);
        setMemberData(prevData => prevData.filter(member => member.userId !== id));
      } catch (error) {
        console.error('移除用戶失敗:', error);
      }
    }
  };

  // Add new members to group
  const handleAddMember = async (newMembers: User[]) => {
    try {
      await Promise.all(newMembers.map(user =>
        addUserToGroup({ userId: user.userId, groupId })
      ));
      setMemberData(prevData => [...prevData, ...newMembers]);
    } catch (error) {
      console.error('添加用戶到群組失敗:', error);
    }
  };

  // Update chart permissions
  const updateChartPermissions = async (chartId: number, newState: boolean) => {
    try {
      await updateGroupChartPermissions(groupId, chartId, newState);
      setChartPermissions(prev => ({
        ...prev,
        [chartId]: newState
      }));
    } catch (error) {
      console.error('更新圖表權限失敗:', error);
    }
  };

  // Toggle chart permission state
  const toggleChartPermission = (chartId: string | number) => {
    const id = typeof chartId === 'string' ? parseInt(chartId, 10) : chartId;
    const currentState = chartPermissions[id];
    const newState = !currentState;
    if (window.confirm(`您確定要將【${id}】的狀態更改為${newState ? '允許' : '禁用'}嗎？`)) {
      updateChartPermissions(id, newState);
    }
  };

  // Delete group
  const handleDeleteGroup = async () => {
    if (window.confirm('您確定要刪除這個群組嗎？')) {
      try {
        await deleteGroup(groupId);
        onDeleteGroup(groupId);
      } catch (error) {
        console.error('刪除群組失敗:', error);
      }
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
            <div className={styles.buttons}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowMemberPicker(true)}
                className={styles.addButton}
              >
                新增成員
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDeleteGroup}
                className={styles.deleteGroupButton}
              >
                刪除群組
              </Button>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                className={styles.dropdownButton}
              >
                <img src={moreInfo} alt="操作" />
              </IconButton>
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={isMenuOpen}
                onClose={handleMenuClose}
                className={styles.dropdownMenu}
              >
                <MenuItem onClick={() => { setShowMemberPicker(true); handleMenuClose(); }}>新增成員</MenuItem>
                <MenuItem onClick={() => { handleDeleteGroup(); handleMenuClose(); }}>刪除群組</MenuItem>
              </Menu>
            </div>
            {showMemberPicker && (
              <UserPickerDialog
                open={showMemberPicker}
                onClose={() => setShowMemberPicker(false)}
                onSubmit={handleAddMember}
                groupId={groupId}
                users={Array.isArray(allUsers) ? allUsers.filter(user => !memberData.some(member => member.userId === user.userId)) : []}
                selectedUsers={[]}
                onAddSelectedMembers={handleAddMember}
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
                  {memberData.length > 0 ? (
                    memberData.map(member => (
                      <tr key={member.userId}>
                        <td>{member.userName}</td>
                        <td>{member.department}</td>
                        <td>{member.position || '未指定'}</td>
                        <td>
                          <Button
                            variant="outlined"
                            onClick={() => handleRemove(member.userId, member.userName)}
                          >
                            移除
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4}>沒有成員</td></tr>
                  )}
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
                {charts.length > 0 ? (
                  charts.map(chart => (
                    <tr key={chart.id}>
                      <td>{chart.name}</td>
                      <td>
                        <button
                          className={`${styles.toggleButton} ${chartPermissions[chart.id] ? styles.allow : styles.deny}`}
                          onClick={() => toggleChartPermission(chart.id)}
                        >
                          {chartPermissions[chart.id] ? '應許' : '禁止'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={2}>沒有圖表</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupList;
