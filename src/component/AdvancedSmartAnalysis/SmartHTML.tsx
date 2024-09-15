import React from 'react';
import styles from './SmartHTML.module.css';

const SmartHTML: React.FC = () => {
  return (
    <div className={styles.iFrameContainer}>
      <iframe
        src="http://140.131.115.153:8080/file/chart_html/%E7%94%A2%E8%83%BD%E5%88%A9%E7%94%A8%E7%8E%87/1479ed7e-416c-4dab-9a7e-342defb24f69.html"
        title="Smart Viewer"
        className={styles.iframe}
      ></iframe>
    </div>
  );
};

export default SmartHTML;