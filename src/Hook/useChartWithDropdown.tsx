// src/Hook/useChartWithDropdown.tsx
import { useState, useEffect } from 'react';
import ChartService from '../services/ChartService';
import { createEmail, sendChatMessage } from '../services/mailService';
import { createApplication } from '../services/application';
import { fetchAllUsers } from '../services/UserAccountService';

export function useChartWithDropdown(
  exportData: (chartId: number, requestData: string[]) => Promise<{ result: boolean; errorCode: string; data: Blob; }>,
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

  // 獲取所有可用的圖表
  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const response = await ChartService.getAvailableCharts();
        if (Array.isArray(response.data)) {
          setCharts(response.data);
          // 假設 response.data[0] 是我們要處理的圖表
          if (response.data.length > 0) {
            setCanAssign(response.data[0].canAssign); // 根據圖表數據設定 canAssign
          }
        } else {
          console.error('獲取圖表失敗:', response.message);
        }
      } catch (error) {
        console.error('獲取圖表失敗:', error);
      }
    };
    fetchCharts();
  }, []);

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
    fetchUsers();
  }, [setUsers]);  

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
      fetchChartHTML(chartId);
    }
  }, [chartId]);

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  const handleExport = async () => {
    try {
      const result = await exportData(chartId, requestData);
      if (!result.result) {
        alert(`導出失敗: ${result.errorCode}`);
      } else {
        // 處理成功導出的情況，例如觸發文件下載
      }
    } catch (error) {
      console.error('導出過程中發生錯誤:', error);
    } finally {
      setIsDropdownOpen(false);
    }
  };

  const handleDelegate = () => {
    setIsModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleChartSelect = (id?: number) => {
    setCurrentChartId(id || null); // 更新圖表 ID
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
  
      const createdEmail = await createEmail(assignedTask);
      console.log('創建郵件響應:', createdEmail); // 打印響應
  
      if (createdEmail && createdEmail.id) {
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
      } else {
        throw new Error('創建郵件失敗。');
      }
  
      setIsModalOpen(false);
    } catch (error) {
      console.error('提交委派任務時出錯:', error);
    }
  };    

  const handleKpiSelection = (kpiId: number) => {
    setSelectedKPIs(prev => {
      if (prev.includes(kpiId)) {
        return prev.filter(id => id !== kpiId);
      } else {
        return [...prev, kpiId];
      }
    });
  };

  const confirmChartSelection = () => {
    const selectedChartsData = charts.filter(chart => selectedKPIs.includes(chart.id));
    setSelectedCharts(selectedChartsData);
    setIsChartSelectModalOpen(false);
  };

  const handleRequestKpi = () => {
    setIsRequestKpiModalOpen(true);
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (kpiRequestChartId === null) {
      alert('請選擇一個圖表。');
      return;
    }

    try {
      const requestData = {
        chartId: kpiRequestChartId,
        applicant: currentUserId,
        guarantor: selectedUser || '',
        startDateStr: formatDate(startDate),
        endDateStr: formatDate(endDate),
        reason: requestContent,
      };
      const response = await createApplication(requestData);
      if (response.result) {
        alert('請求提交成功');
        setIsRequestKpiModalOpen(false);
        setKpiRequestChartId(null); // 提交後重置
      } else {
        alert('請求提交失敗: ' + response.message);
      }
    } catch (error) {
      console.error('提交 KPI 請求時出錯:', error);
      alert('提交 KPI 請求失敗。請重試。');
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
        setInteractiveCharts(chartsWithData); // 更新状态
        // 获取图表的 HTML 链接
        const firstChart = chartsWithData[0]; // 获取第一个图表的 HTML 链接
        if (firstChart?.data?.chartHTML) {
          // 新建标签页并打开链接
          window.open(firstChart.data.chartHTML, '_blank');
        }
      } else {
        console.error('Failed to fetch dashboard charts:', dashboardChartsResponse.message);
        alert('Failed to fetch dashboard charts. Please try again later.');
      }
    } catch (error) {
      console.error('Error during advanced analysis:', error);
      alert('Error during advanced analysis. Please try again later.');
    }
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
    handleKpiSelection,
    confirmChartSelection,
    handleRequestKpi,
    isRequestKpiModalOpen,
    closeRequestKpiModal,
    handleRequestSubmit,
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
    setChartHTML
  };
}
