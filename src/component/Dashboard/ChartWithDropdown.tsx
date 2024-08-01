import React, { useState, useEffect } from 'react';
import styles from './ChartWithDropdown.module.css';
import { createAssignedTask } from '../../services/AssignedTaskService';
import ChartService from '../../services/ChartService';
import { createEmail } from '../../services/mailService';
import { createApplication } from '../../services/application'; // 导入 createApplication 函数
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
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
        console.error('获取图表时出错:', error);
        alert('获取图表失败。请稍后再试。');
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
        alert(`数据导出失败: ${result.errorCode}`);
      } else {
        // 处理导出成功的情况（例如，下载文件）
      }
    } catch (error) {
      console.error('导出时出错:', error);
      alert('导出过程中发生错误。请重试。');
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

  const handleRequestKPI = () => {
    setIsRequestModalOpen(true);
    setIsDropdownOpen(false);
  };

  const closeModal = () => setIsModalOpen(false);
  const closeChartSelectModal = () => setIsChartSelectModalOpen(false);
  const closeRequestModal = () => setIsRequestModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCharts.length === 0) {
      alert('请选择一个图表。');
      return;
    }

    try {
      const assignedTask = {
        chartId: selectedCharts[0], // 使用第一个选中的图表ID
        name: subject,
        defaultProcessor: email,
        available: true,
      };

      await createAssignedTask(assignedTask);

      const newEmail = {
        assignedTaskId: selectedCharts[0], // 使用第一个选中的图表ID
        chartId: chartId,
        name: subject,
        status: "ASSIGN",
        publisher: 'user-id', // 替换为实际的用户 ID
        receiver: email,
        emailSendTime: new Date().toISOString(),
        available: true,
        createId: 'user-id', // 替换为实际的用户 ID
        createDate: new Date().toISOString(),
        modifyId: 'user-id', // 替换为实际的用户 ID
        modifyDate: new Date().toISOString(),
        firstMessage: {
          id: 0,
          mailId: 0,
          messageId: 0,
          content: message,
          available: 'true',
          createId: 'user-id', // 替换为实际的用户 ID
          createDate: new Date().toISOString(),
          modifyId: 'user-id', // 替换为实际的用户 ID
          modifyDate: new Date().toISOString(),
        },
        messageList: []
      };

      await createEmail(newEmail);
      alert('任务已委派，邮件已成功发送！');
    } catch (error) {
      console.error('委派任务或发送邮件时出错:', error);
      alert('委派任务或发送邮件失败。请重试。');
    } finally {
      closeModal();
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !sponsor) {
      alert('请同时选择开始日期和结束日期，并提供一个赞助人。');
      return;
    }

    try {
      const kpiRequest = {
        chartId,
        requestContent,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        sponsor,
      };

      await createApplication(kpiRequest, {}); // 调整为使用 createApplication
      alert('KPI 请求已成功提交！');
    } catch (error) {
      console.error('提交 KPI 请求时出错:', error);
      alert('提交 KPI 请求失败。请重试。');
    } finally {
      closeRequestModal();
    }
  };

  const handleKpiSelection = (kpiId: number) => {
    setSelectedKPIs((prevSelectedKPIs) =>
      prevSelectedKPIs.includes(kpiId)
        ? prevSelectedKPIs.filter((id) => id !== kpiId)
        : [...prevSelectedKPIs, kpiId]
    );
  };

  const confirmChartSelection = () => {
    setSelectedCharts(selectedKPIs);
    closeChartSelectModal();
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <div className={styles.dropdownContainer}>
          <button onClick={toggleDropdown} className={styles.dropdownButton}>
            :
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

      {selectedCharts.map((chartId) => (
        <div key={chartId} className={styles.selectedChart}>
          {/* 根据图表ID渲染相应的图表组件 */}
          <h3>图表 ID: {chartId}</h3>
          {/* 在这里添加图表渲染逻辑 */}
        </div>
      ))}

      {isModalOpen && (
        <div className={styles.modal}>
          <form onSubmit={handleSubmit} className={styles.modalContent}>
            <h2>交辦事項</h2>
            <div className={styles.formGroup}>
              <label>郵件信箱：</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>主题:</label>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>内容:</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
            </div>
            <button type="submit">提交</button>
            <button type="button" onClick={closeModal}>取消</button>
          </form>
        </div>
      )}

      {isChartSelectModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>選擇圖表</h2>
            <ul>
              {charts.map((chart) => (
                <li key={chart.id}>
                  <input
                    type="checkbox"
                    id={`chart-${chart.id}`}
                    onChange={() => handleKpiSelection(chart.id)}
                    checked={selectedKPIs.includes(chart.id)}
                  />
                  <label htmlFor={`chart-${chart.id}`}>{chart.name}</label>
                </li>
              ))}
            </ul>
            <button onClick={confirmChartSelection}>確認</button>
            <button onClick={closeChartSelectModal}>取消</button>
          </div>
        </div>
      )}

      {isRequestModalOpen && (
        <div className={styles.modal}>
          <form onSubmit={handleRequestSubmit} className={styles.modalContent}>
            <h2>请求 KPI</h2>
            <div className={styles.formGroup}>
              <label>开始日期：</label>
              <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
            </div>
            <div className={styles.formGroup}>
              <label>结束日期：</label>
              <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
            </div>
            <div className={styles.formGroup}>
              <label>赞助人：</label>
              <input type="text" value={sponsor} onChange={(e) => setSponsor(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>请求内容：</label>
              <textarea value={requestContent} onChange={(e) => setRequestContent(e.target.value)} required></textarea>
            </div>
            <button type="submit">提交请求</button>
            <button type="button" onClick={closeRequestModal}>取消</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChartWithDropdown;
