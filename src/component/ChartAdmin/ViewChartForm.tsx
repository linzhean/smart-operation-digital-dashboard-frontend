import React from 'react';
import styles from './ViewChartForm.module.css';
import { Stack } from '@mui/material';

interface ViewChartFormProps {
  chartName: string;
  chartCodeFile: string;
  chartImage: string;
  onClose: () => void;
}

const ViewChartForm: React.FC<ViewChartFormProps> = ({ chartName, chartCodeFile, chartImage, onClose }) => {
  return (
    <div>
      <div className={styles.formOverlay} onClick={onClose}></div>
      <div className={styles.checkFormContent}>
        <h2>新增圖表</h2>
        <form>

          <div className={styles.newKPIlabelGroup}>
            <label htmlFor='newKpiName'>圖表名稱</label>
            <input
              placeholder='請輸入新圖表的名稱'
              id='newKpiName'
              type="text"
              value={chartName}
              className={styles.newKpiNameInput}
            />
          </div>

          <div className={styles.newKpiCodeGroup}>
            <Stack>
              <p
                className={styles.newCodeFile}
              >
                {chartCodeFile}
              </p>
            </Stack>
          </div>

          <div className={styles.newKpiImgGroup}>
            <img src={chartImage} className={styles.viewChartImg} alt='示意圖缺失'></img>
          </div>



          <div className={styles.newKPIbuttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancel}>取消</button>
            <button type="submit" className={styles.submit}>提交</button>
          </div>
        </form>

      </div >

    </div >

  );
};

export default ViewChartForm;
