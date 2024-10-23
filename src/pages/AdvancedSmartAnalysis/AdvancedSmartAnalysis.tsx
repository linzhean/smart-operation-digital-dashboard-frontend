import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SmartHTML from '../../component/AdvancedSmartAnalysis/SmartHTML';
import SmartDialogue from '../../component/AdvancedSmartAnalysis/SmartDialogue';
import styles from './AdvancedSmartAnalysis.module.css';
import ChartService from '../../services/ChartService';
import Draggable from 'react-draggable';
import chatIcon from '../../assets/icon/chat.png';
import analyticsIcon from '../../assets/icon/statistics.png';

const AdvancedSmartAnalysis: React.FC = () => {
  const [searchParams] = useSearchParams();
  const dashboardId = searchParams.get('dashboardId');
  const chartId = searchParams.get('chartId');
  const [chartHTML, setChartHTML] = useState<string>('');
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiAnalysisId, setAiAnalysisId] = useState<number | null>(null);
  const [aiAnalysisData, setAiAnalysisData] = useState<any[]>([]); 

  useEffect(() => {
    if (chartId) {
      const fetchChartData = async () => {
        try {
          console.log('AdvancedSmartAnalysis chartId:', chartId);
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

      // 首次加载时获取数据
      fetchChartData();

      // 每10分钟刷新 SmartHTML
      const intervalId = setInterval(() => {
        fetchChartData();
      }, 10 * 60 * 1000);

      return () => clearInterval(intervalId);
    }
  }, [chartId]);

  // 只在首次加载时获取 SmartDialogue 的 useEffect
  useEffect(() => {
    if (chartId && dashboardId) {
      const fetchAIAnalysisAndSuggestion = async () => {
        try {
          setIsLoading(true);
          const aiResponse = await ChartService.getAIAnalysis(Number(chartId), Number(dashboardId));
          if (aiResponse.result && aiResponse.data.length > 0) {
            setAiAnalysisData(aiResponse.data); // 保存所有分析數據
            setAiAnalysisId(aiResponse.data[0].id);  // 设置 AI 分析的 ID
          } else {
            const suggestionResponse = await ChartService.getAISuggestion(Number(chartId), Number(dashboardId));
            if (suggestionResponse.result) {
              setAiAnalysisData([{ content: suggestionResponse.data.suggestion, id: suggestionResponse.data.id }]); // 保存建議數據
              setAiAnalysisId(suggestionResponse.data.id);
            }
          }
        } finally {
          setIsLoading(false);
        }
      };

      // 只在首次加载时获取数据
      fetchAIAnalysisAndSuggestion();
    }
  }, [chartId, dashboardId]);

  useEffect(() => {
    console.log('Fetched dashboardId:', dashboardId);
    console.log('Fetched chartId:', chartId);
  }, [chartId, dashboardId]);

  const [showDialogue, setShowDialogue] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 800);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 800);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleContent = () => {
    setShowDialogue((prev) => !prev);
  };

  const handleDragStop = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <div className={styles.SmartAnalysisContainer}>
      {isMobileView ? (
        <>
          {!showDialogue ? (
            <SmartHTML chartHTML={chartHTML} />
          ) : (
            chartId && <SmartDialogue aiAnalysisData={aiAnalysisData} chartId={Number(chartId)} isLoading={isLoading}  aiAnalysisId={aiAnalysisId} />
          )}

          <Draggable
            position={position}
            onStop={handleDragStop}
          >
            <button className={styles.floatingButton} onClick={toggleContent}>
              {!showDialogue ? (
                <img src={chatIcon} alt="對話" />
              ) : (
                <img src={analyticsIcon} alt="分析" />
              )}
            </button>
          </Draggable>
        </>
      ) : (
        <>
          <SmartHTML chartHTML={chartHTML} />
          {chartId && <SmartDialogue aiAnalysisData={aiAnalysisData} chartId={Number(chartId)} isLoading={isLoading}  aiAnalysisId={aiAnalysisId} />}
        </>
      )}
    </div>
  );
};

export default AdvancedSmartAnalysis;