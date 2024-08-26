import React, { useEffect, useState } from 'react';
import styles from './ChartWithDropdown.module.css';
import { useChartWithDropdown } from '../../Hook/useChartWithDropdown'; // Adjust the path as necessary
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchAllUsers } from '../../services/UserAccountService'; // Adjust the path as necessary
import more from '../../assets/icon/KPImoreBlue.svg';
import ReactDOM from 'react-dom';
import { useRef } from 'react';

interface ChartWithDropdownProps {
  children: React.ReactNode;
  exportData: (chartId: number, requestData: string[]) => Promise<{ result: boolean; errorCode: string; data: Blob; }>;
  chartId: number;
  requestData: string[];
  onChartSelect: (chartId: number) => void;
  currentUserId: string;
  canAssign: boolean; // Add this prop to handle assignment
}

const ChartWithDropdown: React.FC<ChartWithDropdownProps> = ({ children, exportData, chartId, requestData, onChartSelect, currentUserId }) => {

  const {
    // isDropdownOpen,
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
    // setIsDropdownOpen,
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
    handleAdvancedAnalysis, // Add handleAdvancedAnalysis method
    canAssign,
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

  // 設定Menu
  const [hoverTime, setHoverTime] = useState(0);
  const hoverInterval = useRef<number | null>(null);
  const hoverMenuTimeout = useRef<number | null>(null);
  const closeMenuTimeout = useRef<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMenuMouseEnter = () => {
    if (closeMenuTimeout.current) {
      clearTimeout(closeMenuTimeout.current);
    }
    setHoverTime(0);
    hoverInterval.current = window.setInterval(() => {
      setHoverTime(prev => {
        if (prev < 1) { // 更新進度至0.9
          return prev + 0.1; // 每0.1秒更新一次進度
        } else {
          clearInterval(hoverInterval.current!);
          setIsDropdownOpen(true);
          toggleDropdown();
          return prev;
        }
      });
    }, 100);

    hoverMenuTimeout.current = window.setTimeout(() => {
      if (!isDropdownOpen) {
        setIsDropdownOpen(true);
        toggleDropdown();
      }
    }, 1000);
  };

  const handleMenuMouseLeave = () => {
    if (hoverMenuTimeout.current) {
      clearTimeout(hoverMenuTimeout.current);
    }
    if (hoverInterval.current) {
      clearInterval(hoverInterval.current);
    }

    closeMenuTimeout.current = window.setTimeout(() => {
      setHoverTime(0);
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
        toggleDropdown();
      }
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (hoverMenuTimeout.current) {
        clearTimeout(hoverMenuTimeout.current);
      }
      if (closeMenuTimeout.current) {
        clearTimeout(closeMenuTimeout.current);
      }
      if (hoverInterval.current) {
        clearInterval(hoverInterval.current);
      }
    };
  }, []);


  // 設定button
  const hoverTimeouts = useRef<{ [key: string]: NodeJS.Timeout | null }>({
    export: null,
    delegate: null,
    advancedAnalysis: null,
  });

  const [hoverProgress, setHoverProgress] = useState<{ [key: string]: number }>({
    export: 0,
    delegate: 0,
    advancedAnalysis: 0,
  });

  const handleMouseEnter = (action: string, callback: () => void) => {
    let progress = 0;
    hoverTimeouts.current[action] = setInterval(() => {
      progress += 0.1;
      setHoverProgress(prev => ({ ...prev, [action]: progress }));
      if (progress >= 1) {
        clearInterval(hoverTimeouts.current[action]!);
        callback();
      }
    }, 100);
  };

  const handleMouseLeave = (action: string) => {
    if (hoverTimeouts.current[action]) {
      clearInterval(hoverTimeouts.current[action]!);
      hoverTimeouts.current[action] = null;
    }
    setHoverProgress(prev => ({ ...prev, [action]: 0 }));
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <div
          className={styles.dropdownContainer}
          onMouseEnter={handleMenuMouseEnter}
          onMouseLeave={handleMenuMouseLeave}
        >
          {hoverTime > 0 && (
            <div className={styles.MenuTimerCircle} style={{ '--progress': hoverTime / 1 } as React.CSSProperties} />
          )}
          <button
            onClick={() => {
              toggleDropdown();
            }}
            className={styles.dropdownButton}
          >
            <img src={more} alt="" />
          </button>
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <div
                className={styles.buttonContainer}
                onMouseEnter={() => handleMouseEnter('export', handleExport)}
                onMouseLeave={() => handleMouseLeave('export')}
              >
                <button>匯出</button>
                <div
                  className={styles.timerCircle}
                  style={{ '--progress': hoverProgress.export } as React.CSSProperties}
                />
              </div>

              <div
                className={styles.buttonContainer}
                onMouseEnter={() => handleMouseEnter('delegate', handleDelegate)}
                onMouseLeave={() => handleMouseLeave('delegate')}
              >
                <button disabled={!canAssign}>交辦</button>
                <div
                  className={styles.timerCircle}
                  style={{ '--progress': hoverProgress.delegate } as React.CSSProperties}
                />
              </div>

              <div
                className={styles.buttonContainer}
                onMouseEnter={() => handleMouseEnter('advancedAnalysis', handleAdvancedAnalysis)}
                onMouseLeave={() => handleMouseLeave('advancedAnalysis')}
              >
                <button>進階分析</button>
                <div
                  className={styles.timerCircle}
                  style={{ '--progress': hoverProgress.advancedAnalysis } as React.CSSProperties}
                />
              </div>
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
      {/* 進階分析 */}
      {Array.isArray(interactiveCharts) && interactiveCharts.length > 0 && (ReactDOM.createPortal(advancedAnalysis, document.getElementById('portal-root')!))}

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



    </div>
  );
};

export default ChartWithDropdown;
