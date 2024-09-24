//src\component\Dashboard\ChartWithDropdown.tsx
import React, { useEffect, useState } from 'react';
import styles from './ChartWithDropdown.module.css';
import { useChartWithDropdown } from '../../Hook/useChartWithDropdown';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchAllUsers } from '../../services/UserAccountService';
import ReactDOM from 'react-dom';
import { useRef } from 'react';
import DOMPurify from 'dompurify';

interface ChartWithDropdownProps {
  children: React.ReactNode;
  exportData: (chartId: number, requestData: string[]) => Promise<{ result: boolean; errorCode: string; data: Blob; }>;
  chartId: number;
  requestData: string[];
  onChartSelect: (chartId: number) => void;
  currentUserId: string;
  canAssign: boolean; // Add this prop to handle assignment
  selectedDashboardId?: number;
}

const ChartWithDropdown: React.FC<ChartWithDropdownProps> = ({ children, exportData, chartId, requestData, onChartSelect, currentUserId, selectedDashboardId }) => {

  const {
    toggleDropdown,
    handleExport,
    handleDelegate,
    isModalOpen,
    closeModal,
    handleSubmit,
    email,
    subject,
    message,
    charts,
    setEmail,
    setSubject,
    setMessage,
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    interactiveCharts,
    handleAdvancedAnalysis,
    canAssign,
    isAdvancedAnalysisModalOpen,
    setIsAdvancedAnalysisModalOpen,
    chartHTML,
    setChartHTML,
    setLoading,
    loading,
    handleExportWrapper,
    handleDelegateWrapper,
  } = useChartWithDropdown(exportData, chartId, requestData, currentUserId);

  useEffect(() => {
    if (interactiveCharts.length > 0) {
      // Fetch chart HTML content when interactiveCharts are updated
      const fetchChartHTML = async (url: string) => {
        try {
          console.log('Fetching chart HTML from URL:', url);
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'text/html',
            },
            mode: 'cors',
          });
          console.log('Response status:', response.status);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const text = await response.text();
          setChartHTML(text);
        } catch (error) {
          console.error('無法獲取圖表 HTML:', error);
        }
      };

      const chartURL = interactiveCharts[0]?.data?.chartHTML;
      if (chartURL) {
        fetchChartHTML(chartURL);
      }
    }
  }, [interactiveCharts]);

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

  const handleAdvancedAnalysisWrapper = async () => {
    if (selectedDashboardId) {
      setLoading(true);
      try {
        await handleAdvancedAnalysis(selectedDashboardId);
      } catch (error) {
        console.error('Error with advanced analysis:', error);
      } finally {
        setLoading(false);
      }
    } else {
      alert('No Dashboard ID selected.');
    }
  };

  // 交辦事項
  const AssignForm = (
    <>
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
                <option value="" className={styles.applyKpiGroupOption}></option>
                {(users || []).map(user => (
                  <option key={user.userId} value={user.userId} className={styles.applyKpiGroupOption}>
                    {user.userName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.labelGroup}>
            <label htmlFor="chartSelection">選擇圖表</label>
            <div className={styles.select}>
              <select
                id='chartSelection'
                value={chartId || ''}
                onChange={e => onChartSelect(Number(e.target.value))}
                required
              >
                <option value="" className={styles.applyKpiGroupOption}>請選擇圖表</option>
                {(charts || []).map(chart => (
                  <option key={chart.id} value={chart.id} className={styles.applyKpiGroupOption}>
                    {chart.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.labelGroup}>
            <label htmlFor="email">收件人</label>
            <div className={styles.select}>
              <select
                id='email'
                value={email || ''}
                onChange={e => setEmail(e.target.value)}
                required
              >
                <option value="" className={styles.applyKpiGroupOption}></option>
                {(users || []).map(user => (
                  <option key={user.email} value={user.email} className={styles.applyKpiGroupOption}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={`${styles.labelGroup} ${styles.lastlabelGroup} ${styles.noBorderBottom}`}>
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
      </div>
    </>
  );

  // 進階分析 
  const advancedAnalysis = (
    <>
      <div className={styles.modalOverlay} onClick={() => setIsAdvancedAnalysisModalOpen(false)}></div>
      <div className={styles.modal}>
        <div className={styles.advancedAnalysisForm}>
          <h2>進階分析</h2>
          {chartHTML ? (
            <div
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(chartHTML) }}
            />
          ) : (
            <div className={`loadingMsg`}></div>
          )}
          <div className={styles.buttonGroup}>
            <button onClick={() => setIsAdvancedAnalysisModalOpen(false)} className={styles.cancel}>關閉</button>
          </div>
        </div>
      </div>
    </>
  );

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
    <>
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
              <div className={styles.ballcontainer}>
                <div className={`${styles.load} ${loading && styles.nowLoading}`}>
                  <div className={styles.ball}></div>
                  <div className={styles.ball}></div>
                  <div className={styles.ball}></div>
                </div>
              </div>
            </button>
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <div
                  className={styles.buttonContainer}
                  onMouseEnter={() => handleMouseEnter('export', handleExportWrapper)}
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
                  onMouseEnter={() => handleMouseEnter('delegate', handleDelegateWrapper)}
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
                  onMouseEnter={() => handleMouseEnter('advancedAnalysis', handleAdvancedAnalysisWrapper)}
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
        {/* 交辦的表單 */}
        {isModalOpen && (ReactDOM.createPortal(AssignForm, document.getElementById('portal-root')!))}
        {/* 進階分析 */}
        {isAdvancedAnalysisModalOpen && (interactiveCharts.length > 0) && ReactDOM.createPortal(advancedAnalysis, document.getElementById('portal-root')!)}
      </div>
    </>
  );
};

export default ChartWithDropdown;