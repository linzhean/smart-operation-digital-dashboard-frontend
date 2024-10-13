//src\component\AdvancedSmartAnalysis\SmartHTML.tsx
import React, { useState, useEffect } from 'react';
import styles from './SmartHTML.module.css';
import ChartService from '../../services/ChartService';

interface SmartHTMLProps {
  chartHTML: string;
}

const SmartHTML: React.FC<SmartHTMLProps> = ({ chartHTML }) => {
  const [syncTime, setSyncTime] = useState<string>('');

  useEffect(() => {
    const fetchSyncTime = async () => {
      try {
        const response = await ChartService.getSyncTime();
        if (response.data && response.data.lastSyncTime) {
          setSyncTime(response.data.lastSyncTime);
        }
      } catch (error) {
        console.error('Failed to fetch sync time:', error);
      }
    };

    fetchSyncTime();
  }, []);

  return (
    <div className={styles.iFrameContainer}>
      {chartHTML ? (
        <iframe
          src={chartHTML}
          title="Smart Viewer"
          className={styles.iframe}
        ></iframe>
      ) : (
        <div className='loadingMsg'></div>
      )}

      <div className={styles.syncTime}>
        {syncTime ? `最後同步時間: ${new Date(syncTime).toLocaleString()}` : 'Fetching sync time...'}
      </div>
    </div>
  );
};

export default SmartHTML;

