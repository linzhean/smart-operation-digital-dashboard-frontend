//src\component\ChartAdmin\ViewChartForm.tsx
import React, { useEffect, useState }  from 'react';
import styles from './ChartAdminForm.module.css';
import { Stack } from '@mui/material';
import ChartService from '../../services/ChartService';

interface ViewChartFormProps {
  chartId: number;
  chartName: string;
  chartCodeFile: string;
  chartImage: string;
  showcaseImage: string;  
  onClose: () => void;
}

const ViewChartForm: React.FC<ViewChartFormProps> = ({ chartId,chartName, chartCodeFile, showcaseImage, chartImage, onClose }) => {

  const [chartData, setChartData] = useState({
    chartName: '',
    chartCodeFile: '',
    chartImage: '',
    showcaseImage: '',
  });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const data = await ChartService.getChartData(chartId);
        setChartData({
          chartName: data.name,
          chartCodeFile: data.codeFile,
          chartImage: data.image,
          showcaseImage: data.showcaseImage,
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, [chartId]);
  
  return (
    <div>
      <div className={styles.formOverlay} onClick={onClose}></div>
      <div className={styles.checkFormContent}>
        <h2>查看圖表</h2>
        <form>
          <div className={styles.newKPIlabelGroup}>
            <label htmlFor='newKpiName'>圖表名稱</label>
            <input
              placeholder='圖表名稱'
              id='newKpiName'
              type="text"
              value={chartName}
              readOnly
              className={styles.newKpiNameInput}
            />
          </div>

          <div className={styles.newKpiCodeGroup}>
            <Stack>
              <p
                className={styles.newCodeFile}
              >
                圖表程式碼 {chartCodeFile}
              </p>
            </Stack>
          </div>

          <div className={styles.newKpiImgGroup}>
            <img src={showcaseImage} className={styles.viewChartImg} alt='示意圖缺失'></img>
          </div>
          <div className={styles.newKPIbuttonGroup}>
            <button type="button" onClick={onClose} className={styles.cancel}>關閉</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewChartForm;
