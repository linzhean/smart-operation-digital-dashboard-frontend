import { useState, useEffect, useCallback } from 'react';
import { User } from '../services/types/userManagement';
import {
  fetchUsersByGroupId,
  addUserToGroup,
  removeUserFromGroup,
  deleteGroup,
  updateGroupChartPermissions,
  fetchChartsByGroupId,
  removeChartFromGroup,
} from '../services/GroupApi';
import ChartService from '../services/ChartService';

interface UseGroupListParams {
  groupId: number;
  onDeleteGroup: (groupId: number) => void;
}

const useGroupList = ({ groupId, onDeleteGroup }: UseGroupListParams) => {
  const [memberData, setMemberData] = useState<User[]>([]);
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [showChartPicker, setShowChartPicker] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [charts, setCharts] = useState<{ id: number; name: string; chartGroupId: number }[]>([]);
  const [allCharts, setAllCharts] = useState<{ id: number; name: string }[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const fetchData = useCallback(async () => {
    try {
      const [userList, chartsResponse, allChartsResponse] = await Promise.all([
        fetchUsersByGroupId(groupId),
        fetchChartsByGroupId(groupId),
        ChartService.getAllCharts(),
      ]);
    
      console.log('chartsResponse:', chartsResponse);
    
      // 確保 chartsResponse 是陣列
      setCharts(chartsResponse.map(chart =>  ({
        id: chart.chartId,
        name: chart.chartName,
        chartGroupId: chart.chartGroupId,
      })) );      

      console.log('Fetched users data:', userList);
    
      setMemberData(userList);
      setAllCharts(allChartsResponse.data.map((chart: { id: number; name: string }) => ({
        id: chart.id,
        name: chart.name,
      })));
    } catch (error) {
      console.error('Error fetching group data:', error);
    }
  }, [groupId]);  

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddMember = async (selectedUsers: User[]) => {
    try {
      await Promise.all(
        selectedUsers.map(user => addUserToGroup({ userId: user.userId, groupId }))
      );
      await fetchData(); // Update data after adding members
      setShowMemberPicker(false);
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleRemove = async (userId: string, userName: string) => {
    if (window.confirm(`確定要移除 ${userName} 嗎？`)) {
      try {
        console.log("Attempting to remove:", { userId, memberData });
        const member = memberData.find(member => member.userId === userId);
        if (member && member.userGroupId) {
          console.log("Found member:", member);
          await removeUserFromGroup(member.userGroupId);
          await fetchData(); // Update data after removing member
        } else {
          console.error('無法找到有效的 userGroupId', { member, groupId });
          alert('無法找到有效的 userGroupId，無法移除該成員');
        }
      } catch (error) {
        console.error('Error removing member:', error);
      }
    }
  };   

  const handleAddChart = async (selectedCharts: { id: number; name: string }[]) => {
    try {
      await Promise.all(
        selectedCharts.map(chart => updateGroupChartPermissions(groupId, chart.id, true))
      );
      await fetchData(); // Update data after adding charts
      setShowChartPicker(false);
    } catch (error) {
      console.error('Error adding chart:', error);
    }
  };

  const handleRemoveChart = async (chartId: number) => {
    if (window.confirm('確定要刪除此圖表嗎？')) {
      try {
        const chart = charts.find(c => c.id === chartId);
        if (!chart) {
          throw new Error('Chart not found');
        }

        await removeChartFromGroup(chart.chartGroupId, chartId);
        await fetchData(); // Update data after removing chart
      } catch (error) {
        console.error('Error removing chart:', error);
      }
    }
  };

  const handleDeleteGroup = async () => {
    if (window.confirm('確定要刪除此群組嗎？')) {
      try {
        await deleteGroup(groupId);
        onDeleteGroup(groupId);
      } catch (error) {
        console.error('Error deleting group:', error);
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
    charts,
    allCharts,
    anchorEl,
    isMenuOpen,
    handleRemove,
    handleAddMember,
    handleAddChart,
    handleRemoveChart,
    handleDeleteGroup,
    handleMenuOpen,
    handleMenuClose,
    showChartPicker,
    setShowChartPicker,
  };
};

export default useGroupList;
