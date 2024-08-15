// hooks/useGroupList.ts
import { useState, useEffect } from 'react';
import { User } from '../services/types/userManagement';
import { fetchUsersByGroupId, addUserToGroup, removeUserFromGroup, deleteGroup, updateGroupChartPermissions } from '../services/GroupApi';
import ChartService from '../services/ChartService';
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
        const [userList, chartsResponse] = await Promise.all([
          fetchUsersByGroupId(groupId),
          ChartService.getAllCharts()
        ]);

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

  const toggleChartPermission = (chartId: string | number) => {
    const id = typeof chartId === 'string' ? parseInt(chartId, 10) : chartId;
    const currentState = chartPermissions[id];
    const newState = !currentState;
    if (window.confirm(`您確定要將【${id}】的狀態更改為${newState ? '允許' : '禁用'}嗎？`)) {
      updateChartPermissions(id, newState);
    }
  };

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
