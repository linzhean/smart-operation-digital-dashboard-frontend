// src/Hook/useChartWithDropdown.tsx
import { useState, useEffect } from 'react';
import ChartService from '../services/ChartService';
import { createEmail, sendChatMessage } from '../services/mailService';
import { getAssignedTaskSponsors } from '../services/AssignedTaskService';
import { createApplication } from '../services/application';
import { fetchAllUsers } from '../services/UserAccountService';
import { useNavigate } from 'react-router-dom';

export function useChartWithDropdown(
  exportData: (chartId: number, requestData: string[]) => Promise<{
    [x: string]: any; result: boolean; errorCode: string; data: Blob;
  }>,
  chartId: number,
  requestData: string[],
  currentUserId: string
) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChartSelectModalOpen, setIsChartSelectModalOpen] = useState(false);
  const [isRequestKpiModalOpen, setIsRequestKpiModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [charts, setCharts] = useState<any[]>([]);
  const [selectedCharts, setSelectedCharts] = useState<{ id: number, name: string }[]>([]);
  const [selectedKPIs, setSelectedKPIs] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [requestContent, setRequestContent] = useState('');
  const [sponsor, setSponsor] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [interactiveCharts, setInteractiveCharts] = useState<any[]>([]);
  const [currentChartId, setCurrentChartId] = useState<number | null>(null);
  const [kpiRequestChartId, setKpiRequestChartId] = useState<number | null>(null);
  const [canAssign, setCanAssign] = useState<boolean>(true); // 添加這個狀態
  const [selectedDashboardId, setSelectedDashboardId] = useState<number | null>(null);
  const [isAdvancedAnalysisModalOpen, setIsAdvancedAnalysisModalOpen] = useState(false);
  const [chartHTML, setChartHTML] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [showAIAnalysisModal, setShowAIAnalysisModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sponsorList, setSponsorList] = useState<string[]>([]);
  const [loadingSponsors, setLoadingSponsors] = useState<boolean>(true);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [showNoPermissionMsg, setShowNoPermissionMsg] = useState(false);

  // 獲取所有可用的圖表
  useEffect(() => {
    const fetchCharts = async () => {
      if (selectedDashboardId) { // Ensure dashboardId is available
        try {
          const response = await ChartService.getAvailableCharts(selectedDashboardId);
          if (Array.isArray(response.data)) {
            setCharts(response.data);
            if (response.data.length > 0) {
              setCanAssign(response.data[0].canAssign);
              console.log('Fetched canAssign value:', response.data[0].canAssign);
            }
          } else {
            console.error('獲取圖表失敗:', response.message);
          }
        } catch (error) {
          console.error('獲取圖表失敗:', error);
        }
      } else {
        console.warn('No dashboardId available to fetch charts.');
      }
    };
  
    fetchCharts(); // Initial fetch
  
    const intervalId = setInterval(() => {
      fetchCharts();
    }, 10 * 60 * 1000); // Every 10 minutes
  
    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [selectedDashboardId]); // Dependency array includes selectedDashboardId

  // 獲取所有用戶
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await fetchAllUsers();
        setUsers(userList);
      } catch (error) {
        console.error('獲取用戶失敗:', error);
      }
    };

    fetchUsers(); // 初始获取一次

    const intervalId = setInterval(() => {
      fetchUsers();
    }, 10 * 60 * 1000); // 每 10 分钟执行一次

    return () => clearInterval(intervalId); // 清除定时器
  }, []);


  useEffect(() => {
    const fetchChartHTML = async (id: number) => {
      try {
        const response = await ChartService.getChartData(id);
        if (response.data) {
          setChartHTML(response.data);
        } else {
          console.error('Failed to fetch chart HTML:', response.message);
        }
      } catch (error) {
        console.error('Error fetching chart HTML:', error);
      }
    };

    if (chartId) {
      fetchChartHTML(chartId); // 初始获取一次

      const intervalId = setInterval(() => {
        fetchChartHTML(chartId);
      }, 10 * 60 * 1000); // 每 10 分钟执行一次

      return () => clearInterval(intervalId); // 清除定时器
    }
  }, [chartId]);

  useEffect(() => {
    const fetchSponsors = async () => {
      setLoadingSponsors(true);
      try {
        const response = await getAssignedTaskSponsors(chartId);
        // Check if response.data is defined and has sponsorList
        if (response.data && response.data.sponsorList) {
          setSponsorList(response.data.sponsorList);
        } else {
          console.warn('Sponsor list is not available in the response:', response);
        }
      } catch (error) {
        console.error('Error fetching sponsors:', error);
      } finally {
        setLoadingSponsors(false);
      }
    };

    if (chartId) {
      fetchSponsors();
    }
  }, [chartId]);

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  const handleExportWrapper = async (currentChartId?: any, requestData?: string[]) => {
    setLoading(true);
    try {
      await handleExport();
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const result = await exportData(chartId, requestData);
      if (!result.result) {
        alert(`導出失敗: ${result.message}`); // Use message instead of errorCode
      } else {
        // Handle successful export, e.g., trigger file download
      }
    } catch (error) {
      console.error('導出過程中發生錯誤:', error);
    } finally {
      setIsDropdownOpen(false);
    }
  };

  const handleDelegateWrapper = () => {
    setIsModalOpen(true);
  };

  const handleDelegate = () => {
    setIsModalOpen(true);
  };

  const handleChartSelect = (id?: number) => {
    setCurrentChartId(id || null);
    setIsChartSelectModalOpen(true);
    setIsDropdownOpen(false);
  };

  const closeModal = () => setIsModalOpen(false);
  const closeChartSelectModal = () => setIsChartSelectModalOpen(false);
  const closeRequestKpiModal = () => setIsRequestKpiModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chartId) {
      alert('請先選擇一個圖表。');
      return;
    }

    try {
      const assignedTask = {
        chartId,
        name: subject,
        receiver: selectedUser || '',
        firstMessage: {
          content: message,
        },
      };

      // 創建郵件
      const createdEmail = await createEmail(assignedTask);
      console.log('創建郵件響應:', createdEmail);

      if (createdEmail && createdEmail.id) {
        // 如果郵件創建成功，則發送聊天消息
        await sendChatMessage(createdEmail.id, {
          mailId: createdEmail.id,
          messageId: Date.now(),
          content: message,
          available: "true",
          createId: currentUserId,
          createDate: formatDate(new Date()),
          modifyId: currentUserId,
          modifyDate: formatDate(new Date()),
        });

        // 设置响应消息
        setResponseMessage(createdEmail.message || null); // 假设 createdEmail.message 是响应中的消息
        setIsModalOpen(false);
      } else {
        throw new Error('創建郵件失敗，且無法取得錯誤訊息。');
      }
    } catch (error: any) {
      console.error('提交委派任務時出錯:', error);
      if (error?.response?.data?.message) {
        alert(`交辦失敗: ${error.response.data.message}`);
      } else {
        alert('成功。');
      }
    }
  };

  const fetchChartData = async (chartId: number) => {
    try {
      const response = await ChartService.getChartData(chartId);
      console.log('Fetch Chart Data Response:', response); // Add this line
      if (response.result) {
        return response.data;
      } else {
        console.error('Failed to fetch chart data:', response.message);
        alert('Failed to fetch chart data. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      alert('Error fetching chart data. Please try again later.');
    }
    return null;
  };

  const handleAdvancedAnalysis = async (dashboardId: number) => {
    try {
      const dashboardChartsResponse = await ChartService.getDashboardCharts(dashboardId);
      if (dashboardChartsResponse.result && Array.isArray(dashboardChartsResponse.data)) {
        const chartsWithData = await Promise.all(
          dashboardChartsResponse.data.map(async (chart: any) => {
            const chartData = await fetchChartData(chart.id);
            return { ...chart, data: chartData };
          })
        );
        setInteractiveCharts(chartsWithData);

        // 確保使用 ChartWithDropdown 中的正確 chartId
        const url = `/advanced-analysis?dashboardId=${dashboardId}&chartId=${chartId}`;
        window.open(url, '_blank');
        console.log('ChartWithDropdown chartId:', chartId);
      } else {
        console.error('無法獲取儀表板圖表:', dashboardChartsResponse.message);
        alert('無法獲取儀表板圖表。請稍後再試。');
      }
    } catch (error) {
      console.error('進行進階分析時發生錯誤:', error);
      alert('進行進階分析時發生錯誤。請稍後再試。');
    }
  };

  const handleAIAnalysis = async (dashboardId: number, chartId: number) => {
    if (!dashboardId) {
      alert('Dashboard ID is undefined.');
      return;
    }

    setLoading(true); // Set loading to true when operation starts
    try {
      const dashboardChartsResponse = await ChartService.getDashboardCharts(dashboardId);

      if (dashboardChartsResponse.result && Array.isArray(dashboardChartsResponse.data)) {
        const firstChart = dashboardChartsResponse.data[0];

        if (firstChart && firstChart.id) {
          const aiResponse = await ChartService.getAIAnalysis(firstChart.id, dashboardId);

          if (aiResponse.result) {
            // Extract the suggestion from the data object
            const suggestionText = aiResponse.data.suggestion;

            // Optional: Attempt to handle or sanitize suggestionText if it contains unprintable characters
            const sanitizedSuggestion = sanitizeText(suggestionText);

            setAiSuggestion(sanitizedSuggestion); // Save the suggestion text to state
            setShowAIAnalysisModal(true); // Show the modal
          } else {
            alert(`Failed to get AI analysis: ${aiResponse.message}`);
          }
        } else {
          alert('No charts found in the dashboard.');
        }
      } else {
        console.error('Failed to fetch dashboard charts:', dashboardChartsResponse.message);
        alert('Failed to fetch dashboard charts. Please try again later.');
      }
    } catch (error) {
      console.error('Failed to get AI analysis:', error);
      alert('Error during AI analysis. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false after operation
    }
  };

  const sanitizeText = (text: string): string => {
    return text.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
  };

  useEffect(() => {
    console.log('Updated interactiveCharts:', interactiveCharts);
  }, [interactiveCharts]);

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleStartDateChange = (date: Date | null) => setStartDate(date);
  const handleEndDateChange = (date: Date | null) => setEndDate(date);
  const openAdvancedAnalysisModal = () => setIsAdvancedAnalysisModalOpen(true);
  const closeAdvancedAnalysisModal = () => setIsAdvancedAnalysisModalOpen(false);

  return {
    isDropdownOpen,
    toggleDropdown,
    handleExport,
    handleDelegate,
    handleChartSelect,
    isModalOpen,
    closeModal,
    handleSubmit,
    isChartSelectModalOpen,
    closeChartSelectModal,
    isRequestKpiModalOpen,
    closeRequestKpiModal,
    handleStartDateChange,
    handleEndDateChange,
    startDate,
    endDate,
    sponsor,
    requestContent,
    email,
    subject,
    message,
    charts,
    selectedCharts,
    selectedKPIs,
    setEmail,
    setSubject,
    setMessage,
    setSelectedCharts,
    setSelectedKPIs,
    setRequestContent,
    setSponsor,
    setStartDate,
    setEndDate,
    setIsDropdownOpen,
    setIsModalOpen,
    setIsChartSelectModalOpen,
    setIsRequestKpiModalOpen,
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    setInteractiveCharts,
    interactiveCharts,
    handleAdvancedAnalysis,
    updateCurrentChartId: setCurrentChartId,
    currentChartId,
    kpiRequestChartId,
    setKpiRequestChartId,
    canAssign,
    isAdvancedAnalysisModalOpen,
    setIsAdvancedAnalysisModalOpen,
    chartHTML,
    setChartHTML,
    showModal,
    aiSuggestion,
    setShowModal,
    setAiSuggestion,
    showAIAnalysisModal,
    setShowAIAnalysisModal,
    handleAIAnalysis,
    setLoading,
    loading,
    handleExportWrapper,
    handleDelegateWrapper,
    sponsorList,
    loadingSponsors,
    responseMessage,
    showNoPermissionMsg
  };
}
