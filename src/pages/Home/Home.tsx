import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import LineChart from '../../component/Chart/LineChart';
import DashboardSidebar from '../../component/Dashboard/DashboardSidebar';
import { saveAs } from 'file-saver';
import { exportData, getExportPermission } from '../../services/exportService';
import ChartService from '../../services/ChartService';
import ChartWithDropdown from '../../component/Dashboard/ChartWithDropdown';
import styles from './Home.module.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Home: React.FC = () => {
  const [layout, setLayout] = useState<any[]>([]);
  const [selectedChartData, setSelectedChartData] = useState<any>(null);
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(null);
  const [charts, setCharts] = useState<any[]>([]);
  const [availableCharts, setAvailableCharts] = useState<any[]>([]);
  const [currentChartId, setCurrentChartId] = useState<number | null>(null);
  const [selectedCharts, setSelectedCharts] = useState<{ id: number, name: string }[]>([]);
  const [canAssign, setCanAssign] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [syncTime, setSyncTime] = useState<string>('');

  // Calculate chart layout dynamically based on screen size
  const calculateLayout = (charts: any[]) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const columns = 12; // Fixed 12-column grid
    const chartWidth = 6; // 每个图表的宽度设置为4个网格单位
    const maxChartsPerRow = Math.floor(columns / chartWidth); // 每行最多放置的图表数

    return charts.map((chart: any, index: number) => {
      const layoutItem = {
        i: `chart-${chart.id}`,
        x: (index % maxChartsPerRow) * chartWidth, // 确保这始终是一个数字
        y: Math.floor(index / maxChartsPerRow),
        w: chartWidth,
        h: 1.9,
      };
      console.log(layoutItem); // 日志验证
      return layoutItem;
    });
  };


  // Fetch available charts on component mount
  useEffect(() => {
    const fetchAvailableCharts = async () => {
      try {
        const response = await ChartService.getAvailableCharts();
        setAvailableCharts(response.data);
      } catch (error) {
        console.error('Failed to fetch available charts:', error);
      }
    };
    fetchAvailableCharts();
  }, []);

  // Fetch dashboard charts when a dashboard is selected
  const fetchDashboardCharts = async () => {
    if (selectedDashboard) {
      setLoading(true);
      setError(false);
      try {
        const response = await ChartService.getDashboardCharts(Number(selectedDashboard));
        if (response.result && Array.isArray(response.data)) {
          setCharts(response.data);
          setSelectedCharts(response.data.map((chart: any) => ({ id: chart.id, name: chart.name })));
          const newLayout = calculateLayout(response.data);
          setLayout(newLayout);
          if (response.data.length > 0) {
            setCurrentChartId(response.data[0].id);
          }
        } else {
          setCharts([]);
          setSelectedCharts([]);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard charts:', error);
        setCharts([]);
        setSelectedCharts([]);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDashboardCharts();
  }, [selectedDashboard]);

  // Fetch sync time
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

  // Setup polling to fetch dashboard charts every 10 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchDashboardCharts();
    }, 600000); // 10 minutes

    return () => clearInterval(intervalId);
  }, [selectedDashboard]);

  // Handle chart export
  const handleExport = async (chartId: number, requestData: string[]): Promise<{ result: boolean; errorCode: string; data: Blob }> => {
    try {
        const permissionResponse = await getExportPermission(chartId);
        if (!permissionResponse.result) {
            return { result: false, errorCode: permissionResponse.errorCode, data: new Blob() }; // Return a Blob to match the type
        }

        const exportResponse = await exportData(chartId, { exporterList: requestData, dashboardCharts: [chartId] });
        if (!exportResponse.result) {
            return { result: false, errorCode: exportResponse.errorCode, data: new Blob() }; // Return a Blob to match the type
        }

        const blob = new Blob([exportResponse.data], { type: 'application/octet-stream' });
        saveAs(blob, 'exported_data.csv');
        alert('數據匯出成功！');

        return { result: true, errorCode: '', data: blob }; // Return the blob as data
    } catch (error) {
        console.error('匯出錯誤:', error);
        alert('匯出過程中發生錯誤。請再試一次。');
        return { result: false, errorCode: 'EXPORT_ERROR', data: new Blob() }; // Return an error code and a Blob
    }
};

  // Handle chart selection
  const handleChartSelect = (chartId: number) => {
    setCurrentChartId(chartId);
    const chartData = charts.find(chart => chart.id === chartId);
    if (chartData) {
      setSelectedCharts(prev => {
        if (prev.find(chart => chart.id === chartId)) {
          return prev.filter(chart => chart.id !== chartId);
        } else {
          return [...prev, { id: chartId, name: chartData.name }];
        }
      });
    }
  };

  // Handle adding a new chart
  const handleAddChart = async (chartsToAdd: any[]) => {
    if (!selectedDashboard) {
      alert('Please select a dashboard first.');
      return;
    }

    setLoading(true);
    try {
      const newCharts = await Promise.all(chartsToAdd.map(async (chart: any) => {
        const chartData = {
          name: chart.name || 'New Chart',
          scriptFile: null,
          imageFile: null,
        };
        return await ChartService.createChart(chartData.name, chartData.scriptFile, chartData.imageFile);
      }));

      const chartIds = newCharts.map((chart: any) => chart.id);
      await ChartService.addChartsToDashboard(Number(selectedDashboard), chartIds);

      setCharts(prevCharts => [...prevCharts, ...newCharts]);
      const newLayout = calculateLayout(newCharts);
      console.log(newLayout);
      setLayout(prevLayout => [...prevLayout, ...newLayout]);
    } catch (error) {
      console.error('Error adding chart:', error);
      alert('An error occurred while adding the chart.');
    } finally {
      setLoading(false);
    }
  };

  const handleLayoutChange = (layout: any[]) => {
    setLayout(layout);
  };

  // 处理图表大小调整后停止的事件
  const handleResizeStop = (layout: any[]) => {
    setLayout(layout);
    const updatedCharts = charts.map(chart => {
      const item = layout.find(l => l.i === `chart-${chart.id}`);
      if (item) {
        const newWidth = (item.w / 12) * 100; // Convert grid units to percentage
        return {
          ...chart,
          width: newWidth,
        };
      }
      return chart;
    });
    setCharts(updatedCharts);
  };
  
  return (
    <div className='wrapper'>
      <div className="Home">
        <DashboardSidebar
          onSelectDashboard={setSelectedDashboard}
          onAddChart={handleAddChart}
          currentUserId={''}
        />
        <div className={styles.dashboard_container}>
          {loading && <div className={styles.loadingMsg}></div>}
          {error && <div className={styles.errorMsg}>{error}</div>}
          <div className='theContent'>
            <ResponsiveGridLayout
              layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 12, sm: 8, xs: 6, xxs: 2 }}  // Maintain a grid with 12 columns on large screens
              onLayoutChange={handleLayoutChange}
              onResizeStop={handleResizeStop} // 添加此事件处理函数
            >
              {charts.map(chart => (
               <div key={`chart-${chart.id}`} className={styles.dataCard} data-grid={{ i: `chart-${chart.id}`, ...layout.find(l => l.i === `chart-${chart.id}`) }}>
                  <img src={chart.chartImage} alt={chart.name} className={styles.chartImage} />
                  <ChartWithDropdown
                    exportData={handleExport}
                    chartId={currentChartId || 0}
                    requestData={[]}
                    onChartSelect={() => handleChartSelect(chart.id)}
                    currentUserId={''} // Replace with actual user ID
                    canAssign={canAssign} // Update based on your logic
                    selectedDashboardId={selectedDashboard ? Number(selectedDashboard) : undefined}
                  >
                    {selectedChartData ? <LineChart data={selectedChartData} /> : <p></p>}
                  </ChartWithDropdown>
                </div>
              ))}
            </ResponsiveGridLayout>
            <div className={styles.syncTime}>
              {syncTime ? `最後同步時間: ${new Date(syncTime).toLocaleString()}` : 'Fetching sync time...'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
