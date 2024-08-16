import React, { useState } from 'react';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import styles from './dashBoardForm.module.css';
import closeIcon from '../../assets/icon/X.svg'
import './dateTime.css'

interface MultiStepFormProps {
  onClose: () => void;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const handleClose = () => {

    onClose();
  };
  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const previousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleApplyMore = () => {
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const kpiOptions = [
    "生產率",
    "產能利用率",
    "廢品率", "生產率",
    "產能利用率",
    "廢品率", "生產率",
    "產能利用率",
    "廢品率", "生產率",
    "產能利用率",
    "廢品率", "生產率",
    "產能利用率",
    "廢品率",
  ];

  const formData = {
    applicant: "張三",
    guarantor: "李四",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    content: "這裡是申請內容",
  };

  return (
    <div className={styles.overlay}>
      <form id={styles.msform}>
        <div onClick={handleClose} className={`${styles.closeForm}`}><img src={closeIcon} alt="關閉表單" /></div>
        <ul id={styles.progressbar}>
          <li className={currentStep >= 0 ? styles.active : ''}>設定名稱</li>
          <li className={currentStep >= 1 ? styles.active : ''}>選擇圖表</li>
          <li className={currentStep >= 2 ? styles.active : ''}>說明文字</li>
        </ul>

        <fieldset style={{ display: currentStep === 0 ? 'block' : 'none' }}>
          <h2 className={styles.fsTitle}>請輸入新儀表板的名稱</h2>
          <input type="text" name="name" placeholder="例如：生產儀表板" />
          <input type="button" name="next" className={`${styles.actionButton} ${styles.next} ${styles.firstNext}`} value="下一步" onClick={nextStep} />
        </fieldset>

        <fieldset style={{ display: currentStep === 1 ? 'block' : 'none' }}>
          <h2 className={styles.fsTitle}>選擇圖表</h2>
          <h3 className={styles.fsSubtitle}>選擇想顯示在此儀表板的圖表 <br />
            <button type="button" className={styles.applyMore} onClick={handleApplyMore}>或是點此申請更多</button>
          </h3>
          <div className={styles.theKPIs}>
            {kpiOptions.map((kpi, index) => (
              <div key={index} className={styles.checkboxWrapper}>
                <input type="checkbox" id={`kpi-${index}`} name="kpis" value={kpi} className={styles.kpiInputs} />
                <label htmlFor={`kpi-${index}`}>{kpi}</label>
              </div>
            ))}
          </div>
          <div className={styles.buttonGroup}>
            <input type="button" name="previous" className={`${styles.actionButton} ${styles.previous}`} value="上一步" onClick={previousStep} />
            <input type="button" name="next" className={`${styles.actionButton} ${styles.next}`} value="下一步" onClick={nextStep} />
          </div>
        </fieldset>

        <fieldset style={{ display: currentStep === 2 ? 'block' : 'none' }}>
          <h2 className={styles.fsTitle}>請輸入儀表板說明文字</h2>
          <h3 className={styles.fsSubtitle}>非必填</h3>
          <textarea name="dashboardDescription" placeholder="例如：了解生產狀況"></textarea>
          <div className={styles.buttonGroup}>
            <input type="button" name="previous" className={`${styles.actionButton} ${styles.previous}`} value="上一步" onClick={previousStep} />
            <input type="button" name="submit" className={`${styles.actionButton} ${styles.finish}`} value="完成" />
          </div>
        </fieldset>
      </form>

      {isFormVisible && (
        <>
          <div className={styles.formOverlay} onClick={handleCloseForm}></div>
          <div className={styles.checkFormContent}>
            <div id="appliedForm">
              <h2>申請表單</h2>
              <form>
                <label htmlFor="applicant">申請人:</label>
                <input type="text" id="applicant" name="applicant" />

                <label htmlFor="guarantor">保證人:</label>
                <input type="text" id="guarantor" name="guarantor" />

                <label htmlFor="startDate">開始日期:</label>
                <Datetime
                  dateFormat="YYYY-MM-DD"
                  timeFormat={true}  // 需不需要日期後面的時間? 需要>true 不需要>false
                  closeOnSelect={true}
                  inputProps={{ id: "startDate", name: "startDate" }}

                />

                <label htmlFor="endDate">結束日期:</label>
                <Datetime
                  dateFormat="YYYY-MM-DD"
                  timeFormat={true}
                  closeOnSelect={true}
                  inputProps={{ id: "endDate", name: "endDate" }}
                />

                <label htmlFor="content">申請內容:</label>
                <textarea id="content" name="content" className={styles.theTextarea} />

                <div className={styles.buttonContainer}>
                  <button type="button" onClick={handleCloseForm} className={styles.cancel}>關閉</button>
                  <button type="button" onClick={handleCloseForm} className={styles.submit}>提交</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MultiStepForm;
