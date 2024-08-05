// Hook/useChartWithDropdown.ts
import { useState, useEffect } from 'react';
import ChartService from '../services/ChartService';
import { createEmail, Email } from '../services/mailService';
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
  const [selectedCharts, setSelectedCharts] = useState<{ id: number, name: string }[]>([]);
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
            chartId: selectedCharts[0].id,
            name: subject,
            defaultProcessor: email,
            available: true,
        };
  
        await getAssignedTaskSponsors(assignedTask.chartId);
  
        // Adjust email object to match Omit<Email, 'id'>
        const emailData: Omit<Email, 'id'> = {
          assignedTaskId: assignedTask.chartId,
          chartId: selectedCharts[0].id,
          name: subject,
          status: "ASSIGN",
          publisher: email,
          receiver: email,
          emailSendTime: formatDate(new Date()), // Updated
          available: true,
          createId: "currentUserId",
          createDate: formatDate(new Date()), // Updated
          modifyId: "currentUserId",
          modifyDate: formatDate(new Date()), // Updated
          firstMessage: {
              id: 0,
              mailId: assignedTask.chartId,
              messageId: 0,
              content: message,
              available: "string",
              createId: "currentUserId",
              createDate: formatDate(new Date()), // Updated
              modifyId: "currentUserId",
              modifyDate: formatDate(new Date()), // Updated
          },
          messageList: []  // Adjust as needed
      };
      
  
        await createEmail(emailData);
  
        setIsModalOpen(false);
    } catch (error) {
        console.error('提交交辦任務時出錯:', error);
        alert('提交交辦任務失敗。請重試。');
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

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const requestData = {
        startDateStr: formatDate(startDate),
        endDateStr: formatDate(endDate),
        sponsor,
        requestContent,
        selectedKPIs,
      };
      await createApplication(requestData); // Provide empty params object
      setIsRequestKpiModalOpen(false);
    } catch (error) {
      console.error('提交 KPI 請求時出錯:', error);
      alert('提交 KPI 請求失敗。請重試。');
    }
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