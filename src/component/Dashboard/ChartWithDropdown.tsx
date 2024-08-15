import React, { useEffect, useState } from 'react';
import styles from './ChartWithDropdown.module.css';
import { useChartWithDropdown } from '../../Hook/useChartWithDropdown'; // Adjust the path as necessary
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchAllUsers } from '../../services/UserAccountService'; // Adjust the path as necessary
import more from '../../assets/icon/KPImoreBlue.svg';

interface ChartWithDropdownProps {
  children: React.ReactNode;
  exportData: (chartId: number, requestData: string[]) => Promise<{ result: boolean; errorCode: string; data: Blob; }>;
  chartId: number;
  requestData: string[];
  onChartSelect: (chartId: number) => void;
  currentUserId: string;
}

const ChartWithDropdown: React.FC<ChartWithDropdownProps> = ({ children, exportData, chartId, requestData, onChartSelect, currentUserId }) => {
  const handleDropdownClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const {
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
    email, // Maintain the email state for UI, but not for backend submission
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
    users, // Add users state
    setUsers, // Add setUsers method
    selectedUser, // Add selectedUser state
    setSelectedUser, // Add setSelectedUser method
    interactiveCharts, // Add interactiveCharts state
    setInteractiveCharts, // Add setInteractiveCharts method
    handleAdvancedAnalysis // Add handleAdvancedAnalysis method
  } = useChartWithDropdown(exportData, chartId, requestData, currentUserId);

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
  }, [setUsers]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <div className={styles.dropdownContainer} onClick={handleDropdownClick}>
          <button onClick={toggleDropdown} className={styles.dropdownButton}>
            <img src={more} alt="" />
          </button>
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <button onClick={handleExport}>匯出</button>
              <button onClick={handleDelegate}>交辦</button>
              <button onClick={handleChartSelect}>選擇圖表</button>
              <button onClick={handleAdvancedAnalysis}>進階分析</button>
            </div>
          )}
        </div>
      </div>
      {children}

      {selectedCharts.map(chart => (
        <div key={chart.id} className={styles.selectedChart}>
          <p>Chart ID: {chart.id}</p>
          <p>Chart Name: {chart.name}</p>
        </div>
      ))}

      {/* Modal for delegating tasks */}
      {isModalOpen && (
        <>
          <div className={styles.modalOverlay} onClick={closeModal}></div>
          <div className={styles.modal}>
            <form onSubmit={handleSubmit}>
              <h2>交辦任務</h2>
              <label>
                主題:
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  required
                />
              </label>
              <label>
                指定人:
                <select
                  value={selectedUser || ''}
                  onChange={e => setSelectedUser(e.target.value)}
                  required
                >
                  <option value="">選擇指定人</option>
                  {users.map(user => (
                    <option key={user.userId} value={user.userId}>
                      {user.userName}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                收件人:
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                消息內容:
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                />
              </label>
              <button type="submit">提交</button>
              <button type="button" onClick={closeModal}>取消</button>
            </form>
          </div>
        </>
      )}

      {/* Modal for selecting charts */}
      {isChartSelectModalOpen && (
        <div className={styles.modal}>
          <h2>選擇圖表</h2>
          {charts.map(chart => (
            <div key={chart.id}>
              <input
                type="checkbox"
                checked={selectedKPIs.includes(chart.id)}
                onChange={() => handleKpiSelection(chart.id)}
              />
              <span>{chart.name}</span>
            </div>
          ))}
          <button onClick={confirmChartSelection}>確認</button>
          <button onClick={handleRequestKpi}>請求 KPI</button>
          <button onClick={closeChartSelectModal}>取消</button>
        </div>
      )}

      {/* Modal for KPI request */}
      {isRequestKpiModalOpen && (
        <div className={styles.modal}>
          <form onSubmit={handleRequestSubmit}>
            <h2>請求 KPI</h2>
            <label>
              開始日期:
              <DatePicker selected={startDate} onChange={handleStartDateChange} />
            </label>
            <label>
              結束日期:
              <DatePicker selected={endDate} onChange={handleEndDateChange} />
            </label>
            <label>
              保證人:
              <select
                value={selectedUser || ''}
                onChange={e => setSelectedUser(e.target.value)}
                required
              >
                <option value="">選擇保證人</option>
                {users.map(user => (
                  <option key={user.userId} value={user.userId}>
                    {user.userName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              請求內容:
              <textarea
                value={requestContent}
                onChange={e => setRequestContent(e.target.value)}
                required
              />
            </label>
            <button type="submit">提交</button>
            <button type="button" onClick={closeRequestKpiModal}>取消</button>
          </form>
        </div>
      )}

      {Array.isArray(interactiveCharts) && interactiveCharts.length > 0 && (
        <div className={styles.modal}>
          <h2>進階分析</h2>
          {interactiveCharts.map(chart => (
            <div key={chart.id}>
              <h3>{chart.name}</h3>
              {/* Render interactive chart component here */}
              <img src={chart.interactiveUrl} alt={chart.name} />
            </div>
          ))}
          <button onClick={() => setInteractiveCharts([])}>關閉</button>
        </div>
      )}
    </div>
  );
};

export default ChartWithDropdown;
