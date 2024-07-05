import React, { useState } from 'react';
import styles from './AssignExportControl.module.css';

const AssignExportControl: React.FC = () => {

  const [activeButton, setActiveButton] = useState<string>('AssignPermission');

  // 按鈕點擊事件
  const handleButtonClick = (buttonId: string) => {
    setActiveButton(buttonId);
  };

  return (
    <>
      <div className={styles.filterButton}>
        {/* 匯出權限管理按鈕 */}
        <button
          id="ExportPermission"
          onClick={() => handleButtonClick('ExportPermission')}
          className={activeButton === 'ExportPermission' ? styles.filterActive : ''}
        >
          匯出權限管理
          {/* 裝飾不要刪 */}
          <span></span><span></span><span></span><span></span>
        </button>

        {/* 交辦權限管理按鈕 */}
        <button
          id="AssignPermission"
          onClick={() => handleButtonClick('AssignPermission')}
          className={activeButton === 'AssignPermission' ? styles.filterActive : ''}
        >
          交辦權限管理
          {/* 裝飾別刪 */}
          <span></span><span></span><span></span><span></span>
        </button>
      </div>

      {/* 表格部分 */}
      <div className={styles.theTable}>
        <div className={styles.theList}>
          <table className="custom-scrollbar">
            <thead>
              <tr>
                <th>圖表名稱</th>
                <th>個別權限設置</th>
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
                    <span>擁有權限者：林哲安與其他???人</span>
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
