import React, { useEffect, useState } from 'react';
import styles from './ChartWithDropdown.module.css';
import { useChartWithDropdown } from '../../Hook/useChartWithDropdown'; // Adjust the path as necessary
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchAllUsers } from '../../services/UserAccountService'; // Adjust the path as necessary
import more from '../../assets/icon/KPImoreBlue.svg';
import ReactDOM from 'react-dom';

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

  // 交辦事項
  const AssignForm = (<>
    <div className={styles.modalOverlay} onClick={closeModal}></div>
    <div className={styles.modal}>
      <form onSubmit={handleSubmit} className={styles.AssignForm}>
        <h2>撰寫郵件交辦</h2>
        <div className={styles.labelGroup}>
          <label htmlFor='AssignFormTitle'>標題</label>
          <input
            id='AssignFormTitle'
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            required
          />
        </div>
        <div className={styles.labelGroup}>
          <label htmlFor='AssignFormPersonInCharge'>指定負責人</label>
          <div className={styles.select}>
            <select
              id='AssignFormPersonInCharge'
              value={selectedUser || ''}
              onChange={e => setSelectedUser(e.target.value)}
              required
            >
              <option value=""></option>
              {users.map(user => (
                <option key={user.userId} value={user.userId}>
                  {user.userName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.labelGroup}>
          <label htmlFor="email">收件人</label>
          <input
            id='email'
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={`${styles.labelGroup} ${styles.lastlabelGroup}`}>
          <textarea
            placeholder="請輸入郵件內容..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />
        </div>
        <div className={styles.buttonGroup}>
          <button type="button" onClick={closeModal} className={styles.cancel}>取消</button>
          <button type="submit" className={styles.submit}>提交</button>
        </div>
      </form>
    </div></>)

  // 進階分析 
  const advancedAnalysis = (
    <>
      <div className={styles.modalOverlay} onClick={closeModal}></div>
      <div className={styles.modal}>
        <div className={styles.advancedAnalysisForm}>
          <h2>進階分析</h2>
          {interactiveCharts.map(chart => (
            <div key={chart.id}>
              <h3>{chart.name}</h3>
              <img src={chart.interactiveUrl} alt={chart.name} />
            </div>
          ))}
          <div className={styles.buttonGroup}>
            <button onClick={() => setInteractiveCharts([])} className={styles.cancel}>關閉</button>
          </div>
        </div>
      </div>
    </>
  )

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

      {/* 交辦的表單 */}
      {isModalOpen && (ReactDOM.createPortal(AssignForm, document.getElementById('portal-root')!))}

      {/* Modal for sting charts */}
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

      {Array.isArray(interactiveCharts) && interactiveCharts.length > 0 && (ReactDOM.createPortal(advancedAnalysis, document.getElementById('portal-root')!))}


    </div>
  );
};

export default ChartWithDropdown;
