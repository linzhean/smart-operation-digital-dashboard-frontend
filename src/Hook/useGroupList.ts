import { useState, useEffect } from 'react';
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
import ChartService from '../services/ChartService'; // Import the ChartService

interface UseGroupListParams {
  groupId: number;
  onDeleteGroup: (groupId: number) => void;
}

const useGroupList = ({ groupId, onDeleteGroup }: UseGroupListParams) => {
  const [memberData, setMemberData] = useState<User[]>([]);
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  const [showChartPicker, setShowChartPicker] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [charts, setCharts] = useState<{ id: number; chartName: string; chartGroupId: number }[]>([]);
  const [allCharts, setAllCharts] = useState<{ id: number; name: string }[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const [userList, chartsResponse, allChartsResponse] = await Promise.all([
          fetchUsersByGroupId(groupId),
          fetchChartsByGroupId(groupId),
          ChartService.getAllCharts(),
        ]);

        console.log('Fetched user list:', userList);
        console.log('Fetched charts response:', chartsResponse);
        console.log('Fetched all charts response:', allChartsResponse);

        setMemberData(userList);
        // 更新charts状态以匹配图表名称
        setCharts(chartsResponse.map(chart => ({
          id: chart.chartId, // 确保id字段匹配
          chartName: chart.chartName, // 使用chartName字段
          chartGroupId: chart.chartGroupId,
        })));
        setAllCharts(allChartsResponse.data.map((chart: { id: number; name: string }) => ({
          id: chart.id,
          name: chart.name,
        })));

        console.log('Charts in useGroupList:', chartsResponse);
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };

    fetchGroupData();
  }, [groupId]);

  const handleAddMember = async (selectedUsers: User[]) => {
    try {
      await Promise.all(
        selectedUsers.map(user => addUserToGroup({ userId: user.userId, groupId }))
      );
      const updatedMembers = await fetchUsersByGroupId(groupId);
      setMemberData(updatedMembers);
      setShowMemberPicker(false);
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleRemove = async (userId: number, userName: string) => {
    if (window.confirm(`確定要移除 ${userName} 嗎？`)) {
      try {
        await removeUserFromGroup(userId);
        const updatedMembers = await fetchUsersByGroupId(groupId);
        setMemberData(updatedMembers);
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
      const updatedCharts = await fetchChartsByGroupId(groupId);
      setCharts(updatedCharts.map(chart => ({
        id: chart.chartId, // 确保id字段匹配
        chartName: chart.chartName, // 使用chartName字段
        chartGroupId: chart.chartGroupId,
      })));
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

        const updatedCharts = await fetchChartsByGroupId(groupId);
        setCharts(updatedCharts.map(chart => ({
          id: chart.chartId, // 确保id字段匹配
          chartName: chart.chartName, // 使用chartName字段
          chartGroupId: chart.chartGroupId,
        })));
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
