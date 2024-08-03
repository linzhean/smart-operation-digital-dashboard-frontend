import React, { useState, useEffect } from 'react';
import styles from './ChartWithDropdown.module.css';
import { createAssignedTask } from '../../services/AssignedTaskService';
import ChartService from '../../services/ChartService';
import { createEmail } from '../../services/mailService';
import { createApplication } from '../../services/application';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import more from '../../assets/icon/more.svg'


interface ChartWithDropdownProps {
  children: React.ReactNode;
  exportData: (chartId: number, requestData: string[]) => Promise<{ result: boolean; errorCode: string; data: Blob; }>;
  chartId: number;
  requestData: string[];
  onChartSelect: (chartId: number) => void;
}

const ChartWithDropdown: React.FC<ChartWithDropdownProps> = ({ children, exportData, chartId, requestData, onChartSelect }) => {
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

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

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

      await createAssignedTask(assignedTask);

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
        startDateStr: startDateStr,
        endDateStr: endDateStr,
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

  const confirmChartSelection = () => {
    setSelectedCharts(selectedKPIs);
    setIsRequestKpiModalOpen(true);
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <div className={styles.dropdownContainer}>
          <button onClick={toggleDropdown} className={styles.dropdownButton}>
            <img src={more} alt="" />
          </button>
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <button onClick={handleExport}>匯出</button>
              <button onClick={handleDelegate}>交辦</button>
              <button onClick={handleChartSelect}>選擇圖表</button>
            </div>
          )}
        </div>
      </div>
      {children}

      {selectedCharts.map(chartId => (
        <div key={chartId} className={styles.selectedChart}>
          {/* 根據 chartId 渲染圖表組件 */}
          <h3>圖表 ID: {chartId}</h3>
          {/* 在這裡添加您的圖表渲染邏輯 */}
        </div>
      ))}

      {isModalOpen && (
        <div className={styles.modal}>
          <form onSubmit={handleSubmit} className={styles.modalContent}>
            <h2>交辦</h2>
            <div className={styles.formGroup}>
              <label>電子郵件:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>主題:</label>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>內容:</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
            </div>
            <button type="submit">提交</button>
            <button type="button" onClick={closeModal}>關閉</button>
          </form>
        </div>
      )}

      {isChartSelectModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>選擇圖表</h2>
            <div>
              {charts.map(chart => (
                <div key={chart.id} className={styles.chartOption}>
                  <input
                    type="checkbox"
                    id={`chart-${chart.id}`}
                    checked={selectedKPIs.includes(chart.id)}
                    onChange={() => handleKpiSelection(chart.id)}
                  />
                  <label htmlFor={`chart-${chart.id}`}>{chart.name}</label>
                </div>
              ))}
            </div>
            <button onClick={confirmChartSelection}>請求 KPI</button>
            <button type="button" onClick={closeChartSelectModal}>關閉</button>
          </div>
        </div>
      )}

      {isRequestKpiModalOpen && (
        <div className={styles.modal}>
          <form onSubmit={handleRequestSubmit} className={styles.modalContent}>
            <h2>請求 KPI</h2>
            <div className={styles.formGroup}>
              <label>開始日期:</label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date)}
                dateFormat="yyyy/MM/dd"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>結束日期:</label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date)}
                dateFormat="yyyy/MM/dd"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>請求內容:</label>
              <textarea value={requestContent} onChange={(e) => setRequestContent(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>保證人:</label>
              <input type="text" value={sponsor} onChange={(e) => setSponsor(e.target.value)} required />
            </div>
            <button type="submit">提交</button>
            <button type="button" onClick={closeRequestKpiModal}>關閉</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChartWithDropdown;
