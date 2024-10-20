import React, { useState, useEffect } from 'react';
import Sidebar from './InterimKPISidebar';
import styles from './InterimKPIList.module.css';
import { ApplicationData } from '../../services/types/userManagement';
import { getApplications, updateApplication, deleteApplication, closeApplication } from '../../services/application';

interface InterimKPIListProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

const statusMap: { [key: string]: number } = {
  '已關閉': 0,
  '申請未通過': 1,
  '申請已通過': 2,
  '正在啓用': 3,
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
      const statusKey = statusMap[selectedStatus] || 0;
      console.log('statusKey:', statusKey);
      const response = await getApplications(statusKey.toString(), 0);
      console.log('API response:', response);

      if (response.result && Array.isArray(response.data)) {
        response.data.forEach(app => {
          console.log('Application:', app);
          if (app.groupId === undefined) {
            console.warn('groupId 在申請中缺失:', app);
          }
        });
        setApplications(response.data);
      } else {
        console.error('API 響應格式異常:', response);
        alert(response.message || '獲取申請失敗');
      }
    } catch (error) {
      console.error('獲取申請時出錯:', error);
      alert('獲取申請失敗');
    }
  };

  const handleEmailClick = (data: ApplicationData) => {
    console.log('Handling email click', data);
    setFormData(data);
    setIsFormVisible(true);
  };


  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const handleApprove = async (id: number | undefined) => {
    if (id === undefined) {
      console.error('id 尚未定義');
      alert('id 缺失');
      return;
    }
    try {
      const response = await updateApplication(id, { applyStatus: 1 });
      if (response.result) {
        alert('申請已批准');
        fetchApplications();
      } else {
        alert(response.message || '批准申請失敗');
      }
    } catch (error) {
      console.error('批准錯誤:', error);
      alert('批准申請失敗');
    }
  };


  const handleDelete = async (id: number) => {
    try {
      const response = await deleteApplication(id);
      console.log('Delete response:', response);
      if (response.result) {
        alert('申請已刪除');
        fetchApplications();
      } else {
        alert(response.message || '刪除申請失敗');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('刪除申請失敗');
    }
  };

  const handleClose = async (id: number) => {
    try {
      const response = await closeApplication(id);
      console.log('Close response:', response);
      if (response.result) {
        alert('申請已關閉');
        fetchApplications();
      } else {
        alert(response.message || '關閉申請失敗');
      }
    } catch (error) {
      console.error('Close error:', error);
      alert('關閉申請失敗');
    }
  };

  return (
    <div className="wrapper">
      <Sidebar onStatusChange={onStatusChange} selectedStatus={selectedStatus} />
      <div className={`${styles.content} main_container`}>
        <div className={`${styles.theContent} theContent`}>
          <h2 className={styles.h2}>申請記錄 － {selectedStatus}</h2>
          <div className={styles.thePermissionList}>
            <table className={styles.customScrollbar}>
              <thead>
                <tr className={styles.theNoWrapTitle}>
                  <th>申請人</th>
                  <th>保證人</th>
                  <th>開始日</th>
                  <th>到期日</th>
                  <th>申請內容</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(applications) && applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.applicant}</td>
                    <td>{app.guarantor}</td>
                    <td>{app.startDate.split(' ')[0]}<br />{app.startDate.split(' ')[1]}</td>
                    <td>{app.endDate.split(' ')[0]}<br />{app.endDate.split(' ')[1]}</td>
                    <td>
                      <span className={styles.emailIcon} onClick={() => { handleEmailClick(app); }}>📧</span>
                    </td>
                    <td>
                      {selectedStatus === '申請未通過' ? (
                        <>
                          <button
                            className={styles.approveButton}
                            onClick={() => {
                              console.log("Approve button clicked");
                              if (app.id) {
                                handleApprove(app.id);
                              } else {
                                console.error("app.id is undefined", app);
                              }
                            }}
                          >
                            核准
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() => {
                              console.log("Delete button clicked");
                              if (app.id) {
                                handleDelete(app.id);
                              } else {
                                console.error("app.id is undefined", app);
                              }
                            }}
                          >
                            刪除
                          </button>
                        </>
                      ) : selectedStatus === '正在啓用' ? (
                        <button
                          className={styles.deleteButton}
                          onClick={() => {
                            console.log("Close button clicked");
                            if (app.id) {
                              handleClose(app.id);
                            } else {
                              console.error("app.id is undefined", app);
                            }
                          }}
                        >
                          關閉
                        </button>
                      ) : (
                        <button
                          className={styles.deleteButton}
                          onClick={() => {
                            console.log("Delete button clicked");
                            if (app.id) {
                              handleDelete(app.id);
                            } else {
                              console.error("app.id is undefined", app);
                            }
                          }}
                        >
                          刪除
                        </button>
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
                      <textarea id="content" name="content" value={formData.reason} className={styles.theTextarea} />
                      <div className={styles.buttonContainer}>
                        <button type="button" onClick={handleCloseForm} className={styles.cancel}>關閉</button>
                      </div>
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
