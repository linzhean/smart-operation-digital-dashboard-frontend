import { useState, useEffect } from 'react';
import ChartService from '../services/ChartService';
import { createEmail } from '../services/mailService';
import { createApplication } from '../services/application';
import { getAssignedTaskSponsors } from '../services/AssignedTaskService';

export function useChartWithDropdown(exportData: (chartId: number, requestData: string[]) => Promise<{ result: boolean; errorCode: string; data: Blob; }>, chartId: number, requestData: string[]) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChartSelectModalOpen, setIsChartSelectModalOpen] = useState(false);
  const [isRequestKpiModalOpen, setIsRequestKpiModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [charts, setCharts] = useState<any[]>([]);
  const [selectedCharts, setSelectedCharts] = useState<number[]>([]);
  const [selectedKPIs, setSelectedKPIs] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [requestContent, setRequestContent] = useState('');
  const [sponsor, setSponsor] = useState('');

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const response = await ChartService.getAvailableCharts();
        setCharts(response.data);
      } catch (error) {
        console.error('獲取圖表時出錯:', error);
        alert('獲取圖表失敗。請稍後再試。');
      }
    };

    fetchCharts();
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  const handleExport = async () => {
    try {
      const result = await exportData(chartId, requestData);
      if (!result.result) {
        alert(`匯出失敗: ${result.errorCode}`);
      } else {
        // 處理匯出成功的邏輯，例如觸發文件下載
      }
    } catch (error) {
      console.error('匯出過程中出錯:', error);
      alert('匯出過程中發生錯誤。請重試。');
    } finally {
      setIsDropdownOpen(false);
    }
  };

  const handleDelegate = () => {
    setIsModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleChartSelect = () => {
    setIsChartSelectModalOpen(true);
    setIsDropdownOpen(false);
  };

  const closeModal = () => setIsModalOpen(false);
  const closeChartSelectModal = () => setIsChartSelectModalOpen(false);
  const closeRequestKpiModal = () => setIsRequestKpiModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCharts.length === 0) {
      alert('請選擇一個圖表。');
      return;
    }

    try {
      const assignedTask = {
        chartId: selectedCharts[0],
        name: subject,
        defaultProcessor: email,
        available: true,
      };

      await getAssignedTaskSponsors(assignedTask.chartId);

      const newEmail = {
        assignedTaskId: selectedCharts[0],
        chartId: chartId,
        name: subject,
        status: "ASSIGN",
        publisher: 'user-id',
        receiver: email,
        emailSendTime: new Date().toISOString(),
        available: true,
        createId: 'user-id',
        createDate: new Date().toISOString(),
        modifyId: 'user-id',
        modifyDate: new Date().toISOString(),
        firstMessage: {
          id: 0,
          mailId: 0,
          messageId: 0,
          content: message,
          available: 'true',
          createId: 'user-id',
          createDate: new Date().toISOString(),
          modifyId: 'user-id',
          modifyDate: new Date().toISOString(),
        },
        messageList: []
      };

      await createEmail(newEmail);
      alert('交辦和郵件發送成功！');
    } catch (error) {
      console.error('交辦和郵件發送時出錯:', error);
      alert('交辦和郵件發送失敗。請重試。');
    } finally {
      closeModal();
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !sponsor) {
      alert('請提供開始日期、結束日期和保證人。');
      return;
    }

    try {
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();
      
      console.log('startDate:', startDateStr);
      console.log('endDate:', endDateStr);

      const kpiRequest = {
        chartId,
        requestContent,
        startDate: startDateStr,
        endDate: endDateStr,
        sponsor,
      };

      await createApplication(kpiRequest, {});
      alert('KPI 請求提交成功！');
    } catch (error) {
      console.error('提交 KPI 請求時出錯:', error);
      alert('提交 KPI 請求失敗。請重試。');
    } finally {
      closeRequestKpiModal();
    }
  };

  const handleKpiSelection = (kpiId: number) => {
    setSelectedKPIs(prevSelectedKPIs =>
      prevSelectedKPIs.includes(kpiId)
        ? prevSelectedKPIs.filter(id => id !== kpiId)
        : [...prevSelectedKPIs, kpiId]
    );
  };

  const confirmChartSelection = async () => {
    if (selectedKPIs.length === 0) {
      alert('請選擇至少一個圖表。');
      return;
    }

    const listDTO = {
      dashboardCharts: selectedKPIs,
      sponsorList: [], // 提供實際的贊助人列表
      exporterList: [] // 提供實際的導出人列表
    };

    try {
      // 替換 dashboardId 為實際值或從 props 中獲取
      const dashboardId = 123; // 需要根據實際情況設置
      await ChartService.createChart(dashboardId, listDTO.sponsorList, listDTO.exporterList, listDTO.dashboardCharts);
      alert('圖表選擇成功！');
    } catch (error) {
      console.error('提交圖表選擇時出錯:', error);
      alert('提交圖表選擇失敗。請重試。');
    } finally {
      setIsChartSelectModalOpen(false);
    }
  };

  const handleRequestKpi = () => {
    setIsRequestKpiModalOpen(true);
    setIsChartSelectModalOpen(false);
  };

  const handleStartDateChange = (date: Date | null) => setStartDate(date);
  const handleEndDateChange = (date: Date | null) => setEndDate(date);

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
    setIsModalOpen,
    setIsChartSelectModalOpen,
    setIsRequestKpiModalOpen,
  };
}
