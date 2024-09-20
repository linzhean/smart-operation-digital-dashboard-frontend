import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SmartHTML from '../../component/AdvancedSmartAnalysis/SmartHTML';
import SmartDialogue from '../../component/AdvancedSmartAnalysis/SmartDialogue';
import styles from './AdvancedSmartAnalysis.module.css';
import ChartService from '../../services/ChartService';

const AdvancedSmartAnalysis: React.FC = () => {
  const [searchParams] = useSearchParams();
  const dashboardId = searchParams.get('dashboardId');
  const chartId = searchParams.get('chartId');
  const [chartHTML, setChartHTML] = useState<string>('');
  const [aiSuggestion, setAiSuggestion] = useState<string>('');

  useEffect(() => {
    if (chartId && dashboardId) {
      const fetchChartData = async () => {
        try {
          const response = await ChartService.getChartData(Number(chartId));
          if (response.result) {
            setChartHTML(response.data.chartHTML);
          } else {
            console.error('Failed to fetch chart data:', response.message);
          }
        } catch (error) {
          console.error('Error fetching chart data:', error);
        }
      };

      const fetchAIAnalysisAndSuggestion = async () => {
        try {
          const aiResponse = await ChartService.getAIAnalysis(Number(chartId), Number(dashboardId));
          if (aiResponse.result) {
            console.log('AI analysis fetched');
            const suggestionResponse = await ChartService.getAISuggestion(Number(chartId), Number(dashboardId));
            if (suggestionResponse.result) {
              setAiSuggestion(suggestionResponse.data.suggestion);
            } else {
              console.error('Failed to fetch AI suggestion:', suggestionResponse.message);
            }
          } else {
            console.error('Failed to fetch AI analysis:', aiResponse.message);
          }
        } catch (error) {
          console.error('Error fetching AI analysis or suggestion:', error);
        }
      };

      fetchChartData();
      fetchAIAnalysisAndSuggestion();

      const intervalId = setInterval(() => {
        fetchChartData();
        fetchAIAnalysisAndSuggestion();
      }, 10 * 60 * 1000); 

      return () => clearInterval(intervalId);
    }
  }, [chartId, dashboardId]);

  return (
    <div className={styles.SmartAnalysisContainer}>
      <SmartHTML chartHTML={chartHTML} />
      {chartId && <SmartDialogue aiSuggestion={aiSuggestion} chartId={Number(chartId)} />}  {/* 傳遞 chartId 和 aiSuggestion */}
    </div>
  );
};

export default AdvancedSmartAnalysis;