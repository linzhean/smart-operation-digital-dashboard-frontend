import { useState, useEffect } from 'react';
import { User } from '../services/types/userManagement';
import { 
  fetchUsersByGroupId, 
  addUserToGroup, 
  removeUserFromGroup, 
  deleteGroup, 
  updateGroupChartPermissions,
  fetchChartsByGroupId 
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

  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        // Fetch users and charts for the group
        const [userList, chartsResponse] = await Promise.all([
          fetchUsersByGroupId(groupId),
          fetchChartsByGroupId(groupId) // Fetch charts and permissions by groupId
        ]);

        setMemberData(userList);

        if (Array.isArray(chartsResponse)) {
          setCharts(chartsResponse);

          // Initialize chart permissions based on fetched charts
          const initialPermissions: { [key: number]: boolean } = {};
          chartsResponse.forEach((chart) => {
            initialPermissions[chart.id] = false; // Default to false, adjust as needed
          });
          setChartPermissions(initialPermissions);
        } else {
          throw new Error('Unexpected charts response format');
        }
      } catch (error) {
        console.error('获取群组和图表信息失败:', error);
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
        console.error('获取所有用户失败:', error);
      }
    };

    fetchAllUsers();
  }, []);

  const handleRemove = async (id: string, name: string) => {
    if (window.confirm(`您确定要将【${name}】从群组中移除吗？`)) {
      try {
        await removeUserFromGroup(groupId, id);
        setMemberData(prevData => prevData.filter(member => member.userId !== id));
      } catch (error) {
        console.error('移除用户失败:', error);
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
      console.error('添加用户到群组失败:', error);
    }
  };

  const updateChartPermissions = async (chartId: number, newState: boolean) => {
    try {
      await updateGroupChartPermissions(groupId, chartId, newState);
      setChartPermissions(prev => ({
        ...prev,
        [chartId]: newState
      }));
    } catch (error) {
      console.error('更新图表权限失败:', error);
    }
  };

  const toggleChartPermission = (chartId: string | number) => {
    const id = typeof chartId === 'string' ? parseInt(chartId, 10) : chartId;
    const currentState = chartPermissions[id];
    const newState = !currentState;
    if (window.confirm(`您确定要将【${id}】的状态更改为${newState ? '允许' : '禁用'}吗？`)) {
      updateChartPermissions(id, newState);
    }
  };

  const handleDeleteGroup = async () => {
    if (window.confirm('您确定要删除这个群组吗？')) {
      try {
        await deleteGroup(groupId);
        onDeleteGroup(groupId);
      } catch (error) {
        console.error('删除群组失败:', error);
      }
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
