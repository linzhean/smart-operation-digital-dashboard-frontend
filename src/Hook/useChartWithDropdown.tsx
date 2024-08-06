//src\Hook\useChartWithDropdown.tsx
import { useState, useEffect } from 'react';
import ChartService from '../services/ChartService';
import { createEmail, Email } from '../services/mailService';
import { createApplication } from '../services/application';
import { getAssignedTaskSponsors } from '../services/AssignedTaskService';
import { fetchAllUsers } from '../services/UserAccountService'; // Add this import

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
  const [users, setUsers] = useState<any[]>([]); // Add users state
  const [selectedUser, setSelectedUser] = useState<string | null>(null); // Add selectedUser state

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const response = await ChartService.getAvailableCharts();
        setCharts(response.data);
      } catch (error) {
        console.error('Failed to fetch charts:', error);
        alert('Failed to fetch charts. Please try again later.');
      }
    };
    fetchCharts();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userList = await fetchAllUsers();
        setUsers(userList);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        alert('Failed to fetch users. Please try again later.');
      }
    };
    fetchUsers();
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  const handleExport = async () => {
    try {
      const result = await exportData(chartId, requestData);
      if (!result.result) {
        alert(`Export failed: ${result.errorCode}`);
      } else {
        // Handle successful export, e.g., trigger file download
      }
    } catch (error) {
      console.error('Error during export:', error);
      alert('An error occurred during export. Please try again.');
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
      alert('Please select a chart.');
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

      const emailData: Omit<Email, 'id'> = {
        assignedTaskId: assignedTask.chartId,
        chartId: selectedCharts[0].id,
        name: subject,
        status: "ASSIGN",
        publisher: email,
        receiver: email,
        emailSendTime: formatDate(new Date()),
        available: true,
        createId: currentUserId,
        createDate: formatDate(new Date()),
        modifyId: currentUserId,
        modifyDate: formatDate(new Date()),
        firstMessage: {
          id: 0,
          mailId: assignedTask.chartId,
          messageId: 0,
          content: message,
          available: "string",
          createId: currentUserId,
          createDate: formatDate(new Date()),
          modifyId: currentUserId,
          modifyDate: formatDate(new Date()),
        },
        messageList: []
      };

      await createEmail(emailData);

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error submitting delegate task:', error);
      alert('Failed to submit delegate task. Please try again.');
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
    if (selectedCharts.length === 0) {
      alert('請選擇一個圖表。');
      return;
    }
  
    try {
      const requestData = {
        chartId: selectedCharts[0].id,
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
      } else {
        alert('請求提交失敗：' + response.message);
      }
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
    users,
    setUsers,
    selectedUser,
    setSelectedUser
  };
}
