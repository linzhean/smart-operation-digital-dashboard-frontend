import React from 'react';
import SmartHTML from '../../component/AdvancedSmartAnalysis/SmartHTML';
import SmartDialogue from '../../component/AdvancedSmartAnalysis/SmartDialogue';
import styles from './AdvancedSmartAnalysis.module.css';

const AdvancedSmartAnalysis: React.FC = () => {
  return (
    <div className={styles.SmartAnalysisContainer}>
      <SmartHTML />
      <SmartDialogue />
    </div>
  );
};

export default AdvancedSmartAnalysis;