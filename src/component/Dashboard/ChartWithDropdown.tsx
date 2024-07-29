import React, { useState, ReactNode } from 'react';
import styles from './ChartWithDropdown.module.css';
import { createAssignedTask } from '../../services/AssignedTaskService';

interface ChartWithDropdownProps {
  children: ReactNode;
  exportData: (chartId: number, requestData: string[]) => Promise<{ result: boolean; errorCode: string; data: Blob; }>;
  chartId: number;
  requestData: string[];
}

const ChartWithDropdown: React.FC<ChartWithDropdownProps> = ({ children, exportData, chartId, requestData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleExport = () => {
    exportData(chartId, requestData);
    setIsDropdownOpen(false);
  };

  const handleDelegate = () => {
    setIsModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prepare the assigned task object
      const assignedTask = {
        chartId,
        name: subject, // Assuming subject is the name of the task
        defaultProcessor: email, // Assuming email is the default processor
        available: true, // Adjust as needed
      };
      
      await createAssignedTask(assignedTask);
      alert('Task assigned successfully!');
    } catch (error) {
      console.error('Failed to assign task:', error);
      alert('Failed to assign task. Please try again.');
    } finally {
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chart}>
        {children}
        <div className={styles.dropdown}>
          <button className={styles.dropdownButton} onClick={toggleDropdown}>
            ⋮
          </button>
          {isDropdownOpen && (
            <ul className={styles.dropdownMenu}>
              <li onClick={handleExport}>匯出資料</li>
              <li onClick={handleDelegate}>交辦</li>
            </ul>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <span className={styles.close} onClick={closeModal}>
              &times;
            </span>
            <h2>撰寫任務內容</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>收件人:</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>主題:</label>
                <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label>内容:</label>
                <textarea required value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
              </div>
              <button type="submit">送出</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartWithDropdown;
