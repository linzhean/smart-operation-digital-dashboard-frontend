import { useState, useEffect } from 'react';
import { User } from '../services/types/userManagement';
import { 
  fetchUsersByGroupId, 
  addUserToGroup, 
  removeUserFromGroup, 
  deleteGroup, 
  updateGroupChartPermissions,
  fetchChartsByGroupId,
  removeChartFromGroup
} from '../services/GroupApi';
import { getUsers } from '../services/userManagementServices';

interface UseGroupListParams {
  groupId: number;
  onDeleteGroup: (groupId: number) => void;
}

const useGroupList = ({ groupId, onDeleteGroup }: UseGroupListParams) => {
  const [memberData, setMemberData] = useState<User[]>([]);
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [chartPermissions, setChartPermissions] = useState<{ [key: number]: boolean }>({});
  const [charts, setCharts] = useState<{ id: number; name: string }[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const [userList, chartsResponse] = await Promise.all([
          fetchUsersByGroupId(groupId),
          fetchChartsByGroupId(groupId)
        ]);
  
        setMemberData(userList);
        if (Array.isArray(chartsResponse)) {
          setCharts(chartsResponse);
  
          const initialPermissions: { [key: number]: boolean } = {};
          chartsResponse.forEach(chart => {
            initialPermissions[chart.id] = false;
          });
          setChartPermissions(initialPermissions);
        } else {
          throw new Error('Unexpected charts response format');
        }
      } catch (error) {
        console.error('Failed to fetch group and chart data:', error);
      }
    };
  
    fetchGroupData();
  }, [groupId]);  

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const userList = await getUsers();
        setAllUsers(userList);
      } catch (error) {
        console.error('Failed to fetch all users:', error);
      }
    };

    fetchAllUsers();
  }, []);

  const handleRemove = async (userId: number, name: string) => {
    if (window.confirm(`確定要將 ${name} 從群組中移除嗎？`)) {
      try {
        // Fetch the user data from the group
        const users = await fetchUsersByGroupId(groupId);
        
        if (!Array.isArray(users)) {
          console.error('Unexpected format for users:', users);
          alert('移除用戶失敗，原因：用戶列表格式錯誤');
          return;
        }
        
        // Find the userGroupId for the specific user
        const user = users.find(user => user.userId === userId.toString());
  
        if (user) {
          const userGroupId = user.userGroupId;
  
          if (userGroupId !== undefined) {
            const response = await removeUserFromGroup(userGroupId, userId);
            if (response.result) {
              setMemberData(prevData =>
                prevData.filter(member => Number(member.userId) !== userId)
              );
            } else {
              console.error(`移除用戶失敗: ${response.message}, id = ${userId}`);
              alert(`移除用戶失敗，原因：${response.message}`);
            }
          } else {
            console.error('User group ID not found for user ID:', userId);
            alert('移除用戶失敗，原因：用戶群組 ID 未找到');
          }
        } else {
          console.error('User not found for user ID:', userId);
          alert('移除用戶失敗，原因：找不到用戶');
        }
      } catch (error) {
        console.error('移除用戶失敗:', error);
        alert('移除用戶時發生錯誤，請稍後再試。');
      }
    }
  };      

  const handleAddMember = async (newMembers: User[]) => {
    try {
      await Promise.all(newMembers.map(user =>
        addUserToGroup({ userId: user.userId, groupId })
      ));
      setMemberData(prevData => [...prevData, ...newMembers]);
    } catch (error) {
      console.error('Failed to add users to group:', error);
    }
  };

  const updateChartPermissions = async (chartId: number, newState: boolean) => {
    try {
      if (newState) {
        await updateGroupChartPermissions(groupId, chartId, newState);
        setChartPermissions(prev => ({
          ...prev,
          [chartId]: newState
        }));
      } else {
        await removeChartFromGroup(groupId, chartId); // Remove chart if permission is denied
        setChartPermissions(prev => {
          const { [chartId]: _, ...rest } = prev;
          return rest;
        });
      }
    } catch (error) {
      console.error('Failed to update chart permissions:', error);
    }
  };  

  const toggleChartPermission = (chartId: string | number) => {
    const id = typeof chartId === 'string' ? parseInt(chartId, 10) : chartId;
    const currentState = chartPermissions[id];
    const newState = !currentState;
    if (window.confirm(`Are you sure you want to change the status of chart ${id} to ${newState ? 'enabled' : 'disabled'}?`)) {
      updateChartPermissions(id, newState);
    }
  };  

  const handleDeleteGroup = async () => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      try {
        await deleteGroup(groupId);
        onDeleteGroup(groupId);
      } catch (error) {
        console.error('Failed to delete group:', error);
      }
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setIsMenuOpen(false);
  };

  
  return {
    memberData,
    showMemberPicker,
    setShowMemberPicker,
    allUsers,
    chartPermissions,
    charts,
    anchorEl,
    isMenuOpen,
    handleRemove,
    handleAddMember,
    toggleChartPermission,
    handleDeleteGroup,
    handleMenuOpen,
    handleMenuClose,
  };
};

export default useGroupList;
