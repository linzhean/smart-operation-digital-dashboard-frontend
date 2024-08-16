import React, { useState, useEffect } from 'react';
import styles from './dashBoardForm.module.css';
import closeIcon from '../../assets/icon/X.svg';
import ChartService from '../../services/ChartService';
import { createApplication } from '../../services/application';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DashboardService from '../../services/DashboardService';
import { fetchAllUsers } from '../../services/UserAccountService';

interface MultiStepFormProps {
  onClose: () => void;
  exportData: (chartId: number, requestData: string[]) => Promise<{ result: boolean; errorCode: string; data: Blob; }>;
  currentUserId: string;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ onClose, exportData, currentUserId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardDescription, setDashboardDescription] = useState('');
  const [charts, setCharts] = useState<any[]>([]);
  const [selectedKPIs, setSelectedKPIs] = useState<number[]>([]);
  const [selectedCharts, setSelectedCharts] = useState<{ id: number, name: string }[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [requestContent, setRequestContent] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

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

  const handleKpiSelection = (kpiId: number) => {
    setSelectedKPIs(prev => prev.includes(kpiId) ? prev.filter(id => id !== kpiId) : [...prev, kpiId]);
  };

  const confirmChartSelection = () => {
    const selectedChartsData = charts.filter(chart => selectedKPIs.includes(chart.id));
    setSelectedCharts(selectedChartsData);
    setCurrentStep(2);
  };

  const handleRequestKpi = () => {
    setIsFormVisible(true);
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
        setIsFormVisible(false);
      } else {
        alert('請求提交失敗：' + response.message);
      }
    } catch (error) {
      console.error('提交 KPI 請求時出錯:', error);
      alert('提交 KPI 請求失敗。請重試。');
    }
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

  const handleClose = () => {
    onClose();
  };

  const handleApplyMore = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const handleSubmit = async () => {
    if (dashboardName) {
      try {
        const newDashboard = await DashboardService.createDashboard({
          name: dashboardName,
          description: dashboardDescription,
        });
        console.log('New Dashboard Created:', newDashboard);
        onClose();
      } catch (error) {
        console.error('Failed to create dashboard:', error);
      }
    }
  };

  const previousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.formContainer} onClick={(e) => e.stopPropagation()}>
        <form id={styles.msform}>
          <div onClick={handleClose} className={styles.closeForm}>
            <img src={closeIcon} alt="關閉表單" />
          </div>
          <ul id={styles.progressbar}>
            <li className={currentStep >= 0 ? styles.active : ''}>設定名稱</li>
            <li className={currentStep >= 1 ? styles.active : ''}>選擇圖表</li>
            <li className={currentStep >= 2 ? styles.active : ''}>說明文字</li>
          </ul>

          {currentStep === 0 && (
            <fieldset>
              <h2 className={styles.fstitle}>儀表板名稱</h2>
              <input
                type="text"
                name="dashboardName"
                placeholder="請輸入儀表板名稱"
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
                required
              />
              <button type="button" onClick={() => setCurrentStep(1)}>下一步</button>
            </fieldset>
          )}

          {currentStep === 1 && (
            <fieldset>
              <h2 className={styles.fsTitle}>選擇圖表</h2>
              <h3 className={styles.fsSubtitle}>
                選擇想顯示在此儀表板的圖表
                <br />
                <button type="button" className={styles.applyMore} onClick={handleApplyMore}>或是點此申請更多</button>
              </h3>
              <div className={styles.theKPIs}>
                {charts.map(chart => (
                  <div key={chart.id} className={styles.checkboxWrapper}>
                    <input
                      type="checkbox"
                      checked={selectedKPIs.includes(chart.id)}
                      onChange={() => handleKpiSelection(chart.id)}
                      className={styles.kpiInputs}
                    />
                    <label htmlFor={`kpi-${chart.id}`}>{chart.name}</label>
                  </div>
                ))}
              </div>
              <div className={styles.buttonGroup}>
              <button type="button" className={styles.actionButton} onClick={previousStep}>上一步</button>
              <button type="button" className={styles.actionButton} onClick={confirmChartSelection}>下一步</button>
              </div>
            </fieldset>
          )}

          {currentStep === 2 && (
            <fieldset>
              <h2 className={styles.fsTitle}>說明文字</h2>
              <h3 className={styles.fsSubtitle}>非必填</h3>
              <label>
                説明內容:
                <textarea
                  name="requestContent"
                  value={requestContent}
                  onChange={(e) => setRequestContent(e.target.value)}
                  required
                />
              </label>
              <div className={styles.buttonGroup}>
                <button type="button" className={styles.actionButton} onClick={previousStep}>上一步</button>
                <button type="button" className={styles.actionButton} onClick={handleSubmit}>完成</button>
              </div>
            </fieldset>
          )}
        </form>

        {isFormVisible && (
          <div className={styles.checkFormContainer}>
            <div className={styles.formOverlay} onClick={handleCloseForm}></div>
            <div className={styles.checkFormContent}>
              <form onSubmit={handleRequestSubmit}>
                <label>
                  選擇負責人:
                  <select
                    value={selectedUser || ''}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    required
                  >
                    <option value="">請選擇</option>
                    {users.map(user => (
                      <option key={user.userId} value={user.userId}>
                        {user.userName}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  開始日期:
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="選擇開始日期"
                    required
                  />
                </label>
                <label>
                  結束日期:
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="選擇結束日期"
                    required
                  />
                </label>
                <label>
                  申請原因:
                  <textarea
                    name="requestContent"
                    value={requestContent}
                    onChange={(e) => setRequestContent(e.target.value)}
                    required
                  />
                </label>
                <button type="submit">提交申請</button>
                <button type="button" onClick={handleCloseForm}>取消</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
