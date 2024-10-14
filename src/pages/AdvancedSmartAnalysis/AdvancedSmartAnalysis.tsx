// import React, { useEffect, useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import SmartHTML from '../../component/AdvancedSmartAnalysis/SmartHTML';
// import SmartDialogue from '../../component/AdvancedSmartAnalysis/SmartDialogue';
// import styles from './AdvancedSmartAnalysis.module.css';
// import ChartService from '../../services/ChartService';
// import Draggable from 'react-draggable';
// import chatIcon from '../../assets/icon/chat.png'

// const AdvancedSmartAnalysis: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const dashboardId = searchParams.get('dashboardId');
//   const chartId = searchParams.get('chartId');
//   const [chartHTML, setChartHTML] = useState<string>('');
//   const [aiSuggestion, setAiSuggestion] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   useEffect(() => {
//     if (chartId && dashboardId) {
//       const fetchChartData = async () => {
//         try {
//           const response = await ChartService.getChartData(Number(chartId));
//           if (response.result) {
//             setChartHTML(response.data.chartHTML);
//           } else {
//             console.error('Failed to fetch chart data:', response.message);
//           }
//         } catch (error) {
//           console.error('Error fetching chart data:', error);
//         }
//       };

//       const fetchAIAnalysisAndSuggestion = async () => {
//         try {
//           setIsLoading(true);
//           const aiResponse = await ChartService.getAIAnalysis(Number(chartId), Number(dashboardId));
//           if (aiResponse.result) {
//             const suggestionResponse = await ChartService.getAISuggestion(Number(chartId), Number(dashboardId));
//             if (suggestionResponse.result) {
//               setAiSuggestion(suggestionResponse.data.suggestion);
//             } else {
//               console.error('Failed to fetch AI suggestion:', suggestionResponse.message);
//             }
//           } else {
//             console.error('Failed to fetch AI analysis:', aiResponse.message);
//           }
//         } catch (error) {
//           console.error('Error fetching AI analysis or suggestion:', error);
//         } finally {
//           setIsLoading(false);
//         }
//       };

//       fetchChartData();
//       fetchAIAnalysisAndSuggestion();

//       const intervalId = setInterval(() => {
//         fetchChartData();
//         fetchAIAnalysisAndSuggestion();
//       }, 10 * 60 * 1000);

//       return () => clearInterval(intervalId);
//     }
//   }, [chartId, dashboardId]);



//   const [showDialogue, setShowDialogue] = useState(false);
//   const [isMobileView, setIsMobileView] = useState(window.innerWidth < 800);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobileView(window.innerWidth < 800);
//     };

//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);


//   const toggleContent = () => {
//     setShowDialogue((prev) => !prev);
//   };
//   return (

//     <div className={styles.SmartAnalysisContainer}>


//       {isMobileView ? (
//         <>
//           {!showDialogue ? (
//             <SmartHTML chartHTML={chartHTML} />

//           ) : (
//             chartId && <SmartDialogue aiSuggestion={aiSuggestion} chartId={Number(chartId)} isLoading={isLoading} />

//           )}

//           {/* 拖動按鈕 */}
//           <Draggable>
//             <button className={styles.floatingButton} onClick={toggleContent}>
//               <img src={chatIcon} alt="" />
//             </button>
//           </Draggable>
//         </>
//       ) : (
//         <>
//           <SmartHTML chartHTML={chartHTML} />
//           {chartId && <SmartDialogue aiSuggestion={aiSuggestion} chartId={Number(chartId)} isLoading={isLoading} />}
//         </>
//       )}
//     </div>
//   );
// };

// export default AdvancedSmartAnalysis;  

//src\pages\AdvancedSmartAnalysis\AdvancedSmartAnalysis.tsx
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

  useEffect(() => {
    if (chartId && dashboardId) {
      const fetchChartData = async () => {
        try {
          console.log('AdvancedSmartAnalysis chartId:', chartId); // 输出 chartId
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
          setIsLoading(true);
          const aiResponse = await ChartService.getAIAnalysis(Number(chartId), Number(dashboardId));
          if (aiResponse.result) {
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
        } finally {
          setIsLoading(false);
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
            chartId && <SmartDialogue aiSuggestion={aiSuggestion} chartId={Number(chartId)} isLoading={isLoading} />
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
          {chartId && <SmartDialogue aiSuggestion={aiSuggestion} chartId={Number(chartId)} isLoading={isLoading} />}
          {/* <SmartDialogue aiSuggestion={aiSuggestion} chartId={Number(chartId)} isLoading={isLoading} /> */}
        </>
      )}
    </div>
  );
};

export default AdvancedSmartAnalysis;