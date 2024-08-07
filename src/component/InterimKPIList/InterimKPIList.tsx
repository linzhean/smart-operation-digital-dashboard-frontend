import React, { useState, useEffect } from 'react';
import Sidebar from '../InterimKPISidebar/InterimKPISidebar';
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
    console.log('Fetching applications...'); // 添加日志
    fetchApplications();
  }, [selectedStatus]);

  const fetchApplications = async () => {
    try {
      const statusKey = statusMap[selectedStatus] || 0;
      console.log('Fetching applications with status:', statusKey); // 输出请求参数
      const response = await getApplications(statusKey.toString(), 0); // 将 nowPage 设置为 0
      console.log('API response:', response); // 输出 API 响应
      if (response.result && Array.isArray(response.data)) {
        setApplications(response.data); // 更新状态
      } else {
        console.error('Unexpected API response format:', response);
        alert(response.message || '获取申请数据失败');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      alert('获取申请数据失败');
    }
  };

  const handleEmailClick = (data: ApplicationData) => {
    setFormData(data);
    setIsFormVisible(true);
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
  };

  const handleApprove = async (id: number, groupId: number) => {
    try {
      console.log('Sending approval request', id, groupId);
      const response = await updateApplication(id, { applyStatus: 1 }, groupId);
      console.log('Approve response:', response);
      if (response.result) {
        alert('申請已批准');
        fetchApplications();
      } else {
        alert(response.message || '批准申請失敗');
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('批准申請失敗');
    }
  };  
  
  const handleDelete = async (id: number, groupId: number) => {
    try {
      const response = await deleteApplication(id, groupId);
      console.log('Delete response:', response); // 输出响应
      if (response.result) {
        alert('申請已刪除');
        fetchApplications();
      } else {
        alert(response.message || '刪除申請失敗');
      }
    } catch (error) {
      console.error('Delete error:', error); // 输出错误信息
      alert('刪除申請失敗');
    }
  };
  
  const handleClose = async (id: number, groupId: number) => {
    try {
      const response = await closeApplication(id, groupId);
      console.log('Close response:', response); // 输出响应
      if (response.result) {
        alert('申請已關閉');
        fetchApplications();
      } else {
        alert(response.message || '關閉申請失敗');
      }
    } catch (error) {
      console.error('Close error:', error); // 输出错误信息
      alert('關閉申請失敗');
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
                {Array.isArray(applications) && applications.map((app) => (
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
                        <button className={styles.approveButton} onClick={() => app.id && app.groupId && handleApprove(app.id, app.groupId)}>核准</button>
                        <button className={styles.deleteButton} onClick={() => app.id && app.groupId && handleDelete(app.id, app.groupId)}>刪除</button>
                        </>
                      ) : selectedStatus === '正在啓用' ? (
                        <button className={styles.closeButton} onClick={() => app.id && app.groupId && handleClose(app.id, app.groupId)}>關閉</button>
                      ) : (
                        <button className={styles.deleteButton} onClick={() => app.id && app.groupId && handleDelete(app.id, app.groupId)}>刪除</button>
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
                      <button type="button" onClick={handleCloseForm} className={styles.cancel}>關閉</button>
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
