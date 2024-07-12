import React, { useState } from 'react';
import styles from './ExportControl.module.css';
import UserPicker from './UserPicker';

const AssignExportControl: React.FC = () => {
  return (
    <>
      {/* 表格部分 */}
      <div className={styles.theTable}>
        <div className={styles.theList}>
          <table className="custom-scrollbar">
            <thead>
              <tr>
                <th>圖表名稱</th>
                <th>匯出資料權限設置</th>
              </tr>
            </thead>
            <tbody>
              {[
                '廢品率',
                '產能利用率',
                '生產進度達成率',
              ].map((item, index) => (
                <tr key={index}>
                  <td>{item}</td>
                  <td>
                    {/* <button>擁有權限者：林哲安與其他???人</button> */}
                    <UserPicker />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AssignExportControl;
