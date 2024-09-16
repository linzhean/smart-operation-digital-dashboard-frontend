import React from 'react';
import styles from './SmartHTML.module.css';

interface SmartHTMLProps {
  chartHTML: string;
}

const SmartHTML: React.FC<SmartHTMLProps> = ({ chartHTML }) => {
  return (
    <div className={styles.iFrameContainer}>
      {chartHTML ? (
        <iframe
          src={chartHTML}
          title="Smart Viewer"
          className={styles.iframe}
        ></iframe>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SmartHTML;
