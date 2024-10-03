import React, { useState, useEffect } from 'react';
import styles from './dashBoardForm.module.css';
import closeIcon from '../../assets/icon/X.svg';
import ChartService from '../../services/ChartService';
import { createApplication } from '../../services/application';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DashboardService from '../../services/DashboardService';
import { fetchAllUsers } from '../../services/UserAccountService';
import { Dashboard } from '../../services/types/dashboard';
import Tooltip from '@mui/material/Tooltip';

interface MultiStepFormProps {
  onClose: () => void;
  exportData: () => Promise<void>;
  currentUserId: string;
  onDashboardCreated: (dashboard: Dashboard, charts: any[]) => void;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ onClose, exportData, currentUserId, onDashboardCreated }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardDescription, setDashboardDescription] = useState('');
  const [charts, setCharts] = useState<any[]>([]);
  const [selectedKPIs, setSelectedKPIs] = useState<number[]>([]);
  const [selectedCharts, setSelectedCharts] = useState<{ id: number, name: string, observable: boolean }[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [requestContent, setRequestContent] = useState('');
  const [applyReason, setApplyReason] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedChartForApplication, setSelectedChartForApplication] = useState<number | null>(null);
  const [selectedChartId, setSelectedChartId] = useState<number | null>(null);

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
        console.log(userList);
        setUsers(userList);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        alert('Failed to fetch users. Please try again later.');
      }
    };
    fetchUsers();
  }, []);

  const handleKpiSelection = (kpiId: number) => {
    if (charts.find(chart => chart.id === kpiId)?.observable) {
      setSelectedKPIs(prev => prev.includes(kpiId) ? prev.filter(id => id !== kpiId) : [...prev, kpiId]);
    }
  };

  const confirmChartSelection = () => {
    const selectedChartsData = charts.filter(chart => selectedKPIs.includes(chart.id));
    setSelectedCharts(selectedChartsData);
    setCurrentStep(2);
  };

  const handleRequestKpi = (chartId: number) => {
    setSelectedChartForApplication(chartId);
    setIsFormVisible(true);
  };

  const handleChartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedChartId(Number(e.target.value));
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChartId) {
      alert('請選擇一個圖表進行申請。');
      return;
    }

    try {
      const requestData = {
        chartId: selectedChartId,
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
    setSelectedChartForApplication(null);
  };

  const handleSubmit = async () => {
    if (dashboardName) {
      try {
        // 1. 創建新的儀表板
        const newDashboard = await DashboardService.createDashboard({
          name: dashboardName,
          description: dashboardDescription,
        });
        console.log('New Dashboard Created:', newDashboard);

        // 2. 將新創建的儀表板ID轉換為數字類型
        const dashboardId: number = Number(newDashboard.id);

        // 3. 將選擇的圖表新增到儀表板
        const selectedChartIds = selectedCharts.map(chart => chart.id);
        const response = await ChartService.addChartsToDashboard(dashboardId, selectedChartIds);

        console.log('Charts added to dashboard:', response);

        // 4. 更新父組件並關閉表單
        await exportData();
        onDashboardCreated(newDashboard, selectedCharts);
        onClose();

      } catch (error) {
        console.error('Failed to create dashboard or add charts:', error);
        alert('Failed to create dashboard or add charts. Please try again.');
      }
    }
  };

  const previousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <form id={styles.msform}>
          <div onClick={handleClose} className={styles.closeForm}>
            <img src={closeIcon} alt="關閉表單" />
          </div>
          <ul id={styles.progressbar}>
            <Tooltip
              title="無權限"
              arrow
              placement="top"
              leaveDelay={300}
            >
              <li className={currentStep >= 0 ? styles.active : ''}>設定名稱</li>
            </Tooltip>

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
                autoComplete='off'
              />
              <button className={`${styles.actionButton} ${styles.next} ${styles.firstNext}`} type="button" onClick={() => setCurrentStep(1)}>下一步</button>
            </fieldset>
          )}

          {currentStep === 1 && (
            <fieldset>
              <h2 className={styles.fsTitle}>選擇圖表</h2>
              <h3 className={styles.fsSubtitle}>
                選擇想顯示在此儀表板的圖表
                <br />
                <button type="button" className={styles.applyMore} onClick={handleApplyMore}>或是點此申請無權限圖表</button>
              </h3>
              <div className={styles.theKPIs}>
                {charts.map(chart => (
                  <div
                    key={chart.id}
                    className={`${styles.checkboxWrapper} ${!chart.observable ? styles.disabled : ''} ${selectedKPIs.includes(chart.id) ? styles.selected : ''}`}
                  >
                    <div className={styles.LabelImgContainer}>
                      <input
                        type="checkbox"
                        id={`kpi-${chart.id}`}
                        checked={selectedKPIs.includes(chart.id)}
                        onChange={() => handleKpiSelection(chart.id)}
                        disabled={!chart.observable}
                        className={styles.kpiInputs}
                      />
                      <label htmlFor={`kpi-${chart.id}`} className={!chart.observable ? styles.disabledLabel : ''}>
                        {chart.name}
                      </label>
                      {chart.showcaseImage && (
                        <img
                          src={chart.showcaseImage}
                          alt={chart.name}
                          className={styles.showcaseImage}
                        />
                      )}
                    </div>
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
              <h2 className={styles.fsTitle}>填寫儀表板說明文字</h2>
              <h3 className={styles.fsSubtitle}>非必填</h3>
              <textarea
                className={styles.dashboardDescription}
                name="dashboardDescription"
                placeholder="請輸入儀表板說明文字"
                value={dashboardDescription}
                onChange={(e) => setDashboardDescription(e.target.value)}
                required
              />
              <div className={styles.buttonGroup}>
                <button type="button" className={styles.actionButton} onClick={previousStep}>上一步</button>
                <button type="button" className={`${styles.actionButton} ${styles.finish}`} onClick={handleSubmit}>完成</button>
              </div>
            </fieldset>
          )}

        </form>
      </div>

      {isFormVisible && (
        <div className={styles.checkFormContainer}>
          <div className={styles.formOverlay} onClick={handleCloseForm}></div>
          <div onClick={(e) => e.stopPropagation()} className={styles.checkFormContent}>
            <h2>申請KPI圖表</h2>
            <form onSubmit={handleRequestSubmit}>
              <div className={styles.applyKPIlabelGroup}>
                <label htmlFor='KPIapplicant'>申請人</label>
                <input
                  id='KPIapplicant'
                  type="text"
                  value={currentUserId}
                  readOnly
                  className={styles.KPIapplicant}
                />
              </div>

              <div className={styles.applyKPIlabelGroup}>
                <label htmlFor='KPIguarantor'>保證人</label>
                <select
                  id='KPIguarantor'
                  value={selectedUser || ''}
                  onChange={(e) => setSelectedUser(e.target.value)}>

                  <option>請選擇</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id} className={styles.applyKpiOption}>{user.userName}</option>
                  ))}

                </select>
              </div>

              <div className={styles.applyKPIlabelGroup}>
                <label htmlFor="chart-select">選擇圖表:</label>
                <select id="chart-select" value={selectedChartId ?? ''} onChange={handleChartChange}>
                  <option value="" disabled className={styles.applyKpiOption}>請選擇圖表</option>
                  {charts.map(chart => (
                    <option key={chart.id} value={chart.id}>
                      {chart.name} {chart.observable ? '' : '(不可觀察)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.applyKPIlabelGroup}>
                <label htmlFor='KPIstartDate'>開始日期</label>
                <DatePicker
                  id='KPIstartDate'
                  selected={startDate}
                  onChange={date => setStartDate(date)}
                  placeholderText="請選擇開始時間"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="yyyy-MM-dd HH:mm"
                />
              </div>

              <div className={styles.applyKPIlabelGroup}>
                <label htmlFor='KPIendDate'>結束日期</label>
                <DatePicker
                  id='KPIendDate'
                  selected={endDate}
                  onChange={date => setEndDate(date)}
                  placeholderText="請選擇結束時間"
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="yyyy-MM-dd HH:mm"
                />
              </div>

              <div className={styles.LastapplyKPIlabelGroup}>
                <textarea
                  className={styles.applyKPItextarea}
                  placeholder='請填寫此次申請理由'
                  value={requestContent}
                  onChange={(e) => setRequestContent(e.target.value)}
                  required
                />
              </div>

              <div className={styles.KPIbuttonGroup}>
                <button type="button" className={styles.cancel} onClick={handleCloseForm}>取消</button>
                <button type="submit" className={styles.submit}>提交</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div >
  );
};

export default MultiStepForm;
