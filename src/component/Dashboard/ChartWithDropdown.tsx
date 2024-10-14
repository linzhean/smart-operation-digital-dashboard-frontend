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
  canAssign: boolean;
  selectedDashboardId?: number;
}

const ChartWithDropdown: React.FC<ChartWithDropdownProps> = ({ children, exportData, chartId, requestData, canAssign, onChartSelect, currentUserId, selectedDashboardId }) => {

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
    isAdvancedAnalysisModalOpen,
    setIsAdvancedAnalysisModalOpen,
    chartHTML,
    setChartHTML,
    setLoading,
    loading,
    handleExportWrapper,
    handleDelegateWrapper,
    sponsorList,
    loadingSponsors,
    responseMessage,
    showNoPermissionMsg
  } = useChartWithDropdown(exportData, chartId, requestData, currentUserId);

  useEffect(() => {
    if (interactiveCharts.length > 0) {
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
  // 交辦事項
  const AssignForm = (
    <>
      <div className={styles.modalOverlay} onClick={closeModal}></div>
      <div className={styles.modal}>
        {showNoPermissionMsg ? (
          <p className={styles.noPermissionMsg}>您沒有權限交辦此圖表</p>
        ) : (
          <form onSubmit={handleSubmit} className={styles.AssignForm}>
            <h2>撰寫郵件交辦</h2>
            <div>
              {responseMessage && <p className={styles.responseMessage}>{responseMessage}</p>}
            </div>
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
        )}
      </div>
    </>
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownElement = document.querySelector(`.${styles.dropdownContainer}`);
      const dropdownMenuElement = document.querySelector(`.${styles.dropdownMenu}`);

      if (dropdownElement && !dropdownElement.contains(event.target as Node) &&
        dropdownMenuElement && !dropdownMenuElement.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <div
            className={styles.dropdownContainer}
          >
            {/* <button
              onClick={() => {
                setIsDropdownOpen(true);
              }}
              className={styles.dropdownButton}
            > */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen((prev) => !prev);
              }}
              className={styles.dropdownButton}
            >
              {/* 等待樣式 */}
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

                <button onClick={() => handleExportWrapper()}>匯出</button>

                <button onClick={() => handleDelegateWrapper()}>交辦</button>

                <button className={styles.lastButton} onClick={() => handleAdvancedAnalysisWrapper()}>進階分析</button>

              </div>
            )}
          </div>
        </div>
        {children}
        {/* 交辦的表單 */}
        {isModalOpen && canAssign && (ReactDOM.createPortal(AssignForm, document.getElementById('portal-root')!))}
        {/* 進階分析 */}
        {isAdvancedAnalysisModalOpen && (interactiveCharts.length > 0) && ReactDOM.createPortal(advancedAnalysis, document.getElementById('portal-root')!)}
      </div >
    </>
  );
};

export default ChartWithDropdown;