import React, { useState } from 'react';
import styles from './InterimKPIList.module.css';

interface ApplicationData {
  applicant: string;
  guarantor: string;
  startDate: string;
  endDate: string;
  reason: string;
}

const Table: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState<Partial<ApplicationData>>({});

  const handleEmailClick = (data: ApplicationData) => {
    setFormData(data);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const applications: ApplicationData[] = [
    { applicant: 'Amy', guarantor: 'Cindy', startDate: '2024/02/03 17:40:00', endDate: '2024/02/29 17:40:00', reason: '我剛入職，還在新人試用期，期持與理解1111111111111。我要參加一個國際會議，請求假期我要參加一個國際會議，請求假期我要參加一個國際會議，請求假期我要參加一個國際會議，請求假期我要參加一個國際會議，請求假期我要參加一個國際會議，請求假期我要參加一個國際會議，請求假期我要參加一個國際會議，請求假期我要參加一個國際會議，請求假期我要參加一個國際會議，請求假期我要參加一個國際會議，請求假期我要參加一個國際會議，請求假期我要參加一個國際會議，請求假期我要參加一個國際會議，請求假期我要參加一個國際會議，請求假期' },
    { applicant: 'Bob', guarantor: 'Linda', startDate: '2024/03/01 09:00:00', endDate: '2024/03/15 18:00:00', reason: '我需要處理家庭緊急情況，請求批准假期。' },
    { applicant: 'Cathy', guarantor: 'John', startDate: '2024/04/10 12:30:00', endDate: '2024/04/20 16:45:00', reason: '我要參加一個重要的培訓課程。' },
    { applicant: 'David', guarantor: 'Anna', startDate: '2024/05/05 08:00:00', endDate: '2024/05/25 17:00:00', reason: '健康問題需要就醫，特此請假。' },
    { applicant: 'Eva', guarantor: 'Mark', startDate: '2024/06/02 10:15:00', endDate: '2024/06/12 15:30:00', reason: '家庭聚會，希望參加。' },
    { applicant: 'Frank', guarantor: 'Nina', startDate: '2024/07/01 11:00:00', endDate: '2024/07/11 14:00:00', reason: '有重要的個人事務需要處理。' },
    { applicant: 'Grace', guarantor: 'Oscar', startDate: '2024/08/20 09:30:00', endDate: '2024/09/01 18:00:00', reason: '我要參加一個國際會議，請求假期。' },
    { applicant: 'Henry', guarantor: 'Paula', startDate: '2024/09/15 08:45:00', endDate: '2024/09/30 17:00:00', reason: '需要時間來照顧家人。' },
    { applicant: 'Ivy', guarantor: 'Quincy', startDate: '2024/10/05 10:00:00', endDate: '2024/10/20 16:00:00', reason: '我正在處理個人健康問題，請批准假期。' },
    { applicant: 'Jack', guarantor: 'Rachel', startDate: '2024/11/10 09:00:00', endDate: '2024/11/25 17:00:00', reason: '希望參加專業培訓，以提高技能。' }
  ];

  return (
    <><h2>申請記錄</h2>
      <div className={styles.thePermissionList}>
        <table className={styles.customScrollbar}>
          <thead>
            <tr>
              <th>申請人</th>
              <th>保證人</th>
              <th>開始日</th>
              <th>到期日</th>
              <th>申請內容</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, index) => (
              <tr key={index}>
                <td>{app.applicant}</td>
                <td>{app.guarantor}</td>
                <td>{app.startDate.split(' ')[0]}<br />{app.startDate.split(' ')[1]}</td>
                <td>{app.endDate.split(' ')[0]}<br />{app.endDate.split(' ')[1]}</td>
                <td>
                  <span className={styles.emailIcon} onClick={() => handleEmailClick(app)}>📧</span>
                </td>
                <td><button className={styles.deleteButton}>刪除</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        {isFormVisible && (
          <>
            <div className={styles.formOverlay} onClick={handleCloseForm}></div>
            <div className={styles.checkFormContent}>
              <div id="appliedForm">
                <h2>申請表單</h2>
                <form>
                  <label htmlFor="applicant">申請人:</label>
                  <br />
                  <input
                    type="text"
                    id="applicant"
                    name="applicant"
                    value={formData.applicant}
                    disabled
                  />
                  <br />

                  <label htmlFor="guarantor">保證人:</label>
                  <br />
                  <input type="text" id="guarantor" name="guarantor" value={formData.guarantor} disabled /><br />

                  <label htmlFor="time">時間:</label>
                  <input type="text" id="time" name="time" value={`${formData.startDate} 至 ${formData.endDate}`} disabled /><br />

                  <label htmlFor="reason">理由:</label>
                  <br />
                  <div id="reason" className={styles.reason}>{formData.reason}</div>

                  <div className={styles.buttonContainer}>
                    <button type="button" id="cancel" className={styles.cancel} onClick={handleCloseForm}>取消</button>
                    <button type="button" id="submit" className={styles.submit} disabled>提交</button>
                  </div>

                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Table;
