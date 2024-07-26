import React, { useState, useEffect } from 'react';
import Sidebar from '../InterimKPISidebar/InterimKPISidebar';
import styles from './InterimKPIList.module.css';
import { ApplicationData } from '../../services/types/userManagement';
import { getApplications, updateApplication, deleteApplication } from '../../services/application';

interface InterimKPIListProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

const statusMap: { [key: string]: string } = {
  '已關閉': '0',
  '申請未通過': '1',
  '申請已通過': '2',
  '正在啓用': '3',
};

const InterimKPIList: React.FC<InterimKPIListProps> = ({ selectedStatus, onStatusChange }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState<Partial<ApplicationData>>({});
  const [applications, setApplications] = useState<ApplicationData[]>([]);

  useEffect(() => {
    fetchApplications();
  }, [selectedStatus]);

  const fetchApplications = async () => {
    try {
      const statusKey = statusMap[selectedStatus] || '';
      const response = await getApplications(statusKey, 1);
      if (response.result && response.data) {
        setApplications(response.data);
      } else {
        alert(response.message || 'Failed to fetch applications');
      }
    } catch (error) {
      alert('Failed to fetch applications');
    }
  };

  const handleEmailClick = (data: ApplicationData) => {
    setFormData(data);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const handleApprove = async (id: number) => {
    try {
      const response = await updateApplication(id, { applyStatus: 'PASSED' });
      if (response.result) {
        alert('Application approved successfully');
        fetchApplications();
      } else {
        alert(response.message || 'Failed to approve application');
      }
    } catch (error) {
      alert('Failed to approve application');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteApplication(id);
      if (response.result) {
        alert('Application deleted successfully');
        fetchApplications();
      } else {
        alert(response.message || 'Failed to delete application');
      }
    } catch (error) {
      alert('Failed to delete application');
    }
  };

  return (
    <div className="wrapper">
      <Sidebar onStatusChange={onStatusChange} selectedStatus={selectedStatus} />
      <div className={`${styles.content} main_container`}>
        <div className={`${styles.theContent} theContent`}>
          <h2 className={styles.h2}>申請記錄 - {selectedStatus}</h2>
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
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.applicant}</td>
                    <td>{app.guarantor}</td>
                    <td>{app.startDate.split(' ')[0]}<br />{app.startDate.split(' ')[1]}</td>
                    <td>{app.endDate.split(' ')[0]}<br />{app.endDate.split(' ')[1]}</td>
                    <td>
                      <span className={styles.emailIcon} onClick={() => handleEmailClick(app)}>📧</span>
                    </td>
                    <td>
                      {selectedStatus === '申請未通過' ? (
                        <>
                          <button className={styles.approveButton} onClick={() => app.id && handleApprove(app.id)}>核准</button>
                          <button className={styles.deleteButton} onClick={() => app.id && handleDelete(app.id)}>刪除</button>
                        </>
                      ) : (
                        <button className={styles.deleteButton} onClick={() => app.id && handleDelete(app.id)}>刪除</button>
                      )}
                    </td>
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
                      <input type="text" id="applicant" name="applicant" value={formData.applicant} disabled />
                      <label htmlFor="guarantor">保證人:</label>
                      <input type="text" id="guarantor" name="guarantor" value={formData.guarantor} disabled />
                      <label htmlFor="startDate">開始日期:</label>
                      <input type="text" id="startDate" name="startDate" value={formData.startDate} disabled />
                      <label htmlFor="endDate">結束日期:</label>
                      <input type="text" id="endDate" name="endDate" value={formData.endDate} disabled />
                      <label htmlFor="content">申請內容:</label>
                      <textarea id="content" name="content" value={formData.content} disabled />
                      <button type="button" onClick={handleCloseForm}>關閉</button>
                    </form>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterimKPIList;
