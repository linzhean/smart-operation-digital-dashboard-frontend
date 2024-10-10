//src\pages\Home\Home.tsx
import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import LineChart from '../../component/Chart/LineChart';
import DashboardSidebar from '../../component/Dashboard/DashboardSidebar';
import { saveAs } from 'file-saver';
import { exportData, getExportPermission, setExportPermission } from '../../services/exportService';
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
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // 计算图表布局
  const calculateLayout = (charts: any[]) => {
    const columns = 12; // 固定 12 列网格
    const chartWidth = 6; // 每个图表宽度设置为 6 个网格单位
    const maxChartsPerRow = Math.floor(columns / chartWidth); // 每行最多放置的图表数

    return charts.map((chart: any, index: number) => ({
      i: `chart-${chart.id}`,
      x: (index % maxChartsPerRow) * chartWidth,
      y: Math.floor(index / maxChartsPerRow),
      w: chartWidth,
      h: 1.9,
    }));
  };

  // 获取可用图表
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

 // 获取仪表盘图表
const fetchDashboardCharts = async () => {
  if (selectedDashboard) {
    setLoading(true);
    try {
      const response = await ChartService.getDashboardCharts(Number(selectedDashboard));
      if (response.result && Array.isArray(response.data)) {
        setCharts(response.data);
        setLayout(calculateLayout(response.data));

        const firstChart = response.data[0];
        if (firstChart && 'canAssign' in firstChart) {
          if (firstChart.canAssign !== false) {
            setCanAssign(false);
          } else {
            setCanAssign(true);
          }
        } else {
          setCanAssign(false); // 如果没有有效的数据，默认设为 false
        }
      }
    } catch (error) {
      console.error('獲取圖表失敗:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }
};

  console.log(canAssign); // 檢查這裡是否為 true

  useEffect(() => {
    fetchDashboardCharts();
  }, [selectedDashboard]);

  useEffect(() => {
    if (currentChartId !== null) {
      const selectedChart = charts.find(chart => chart.id === currentChartId);
      if (selectedChart) {
        setCanAssign(selectedChart.canAssign);
      }
    }
  }, [currentChartId, charts]);
  

  // 获取同步时间
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

  // 设置轮询以获取仪表盘图表
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchDashboardCharts();
    }, 600000); // 每 10 分钟

    return () => clearInterval(intervalId);
  }, [selectedDashboard]);

  // Handle chart export
  const handleExport = async (chartId: number, requestData: string[]): Promise<{ result: boolean; errorCode: string; data: Blob }> => {
    try {
      // 1. 檢查匯出權限
      const permissionResponse = await getExportPermission(chartId);
      if (!permissionResponse.result) {
        setExportMessage(`匯出失敗: ${permissionResponse.message}`);
        return { result: false, errorCode: permissionResponse.errorCode, data: new Blob() };
      }

      const setPermissionResponse = await setExportPermission(chartId, {
        sponsorList: [],
        exporterList: requestData,
        dashboardCharts: [chartId]
      });
      if (!setPermissionResponse.result) {
        setExportMessage(`匯出失敗: ${setPermissionResponse.message}`);
        return { result: false, errorCode: setPermissionResponse.errorCode, data: new Blob() };
      }

      // 2. 發送匯出請求並處理 Blob 回應
      const exportResponse = await exportData(chartId, { exporterList: requestData, dashboardCharts: [chartId] });
      if (!exportResponse.result) {
        return { result: false, errorCode: exportResponse.errorCode, data: new Blob() };
      }

      // 3. 使用 Blob 保存 XLSX 文件
      const blob = new Blob([exportResponse.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `exported_data_${chartId}.xlsx`);

      alert('數據匯出成功！');
      return { result: true, errorCode: '', data: blob };
    } catch (error) {
      console.error('匯出錯誤:', error);
      alert('匯出過程中發生錯誤。請再試一次。');
      return { result: false, errorCode: 'EXPORT_ERROR', data: new Blob() };
    }
  };

  const handleChartSelect = (chartId: number) => {
    setCurrentChartId(chartId);
    const chartData = charts.find(chart => chart.id === chartId);
    if (chartData) {
      console.log(`Selected Chart: ${chartData.name}, Can Assign: ${chartData.canAssign}`);
      setCanAssign(chartData.canAssign); // 更新 canAssign 狀態
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

      setCharts(prevCharts => {
        const updatedCharts = [...prevCharts, ...chartsToAdd];
        setLayout(calculateLayout(updatedCharts)); // 更新布局
        return updatedCharts;
    });

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

  // 处理图表大小调整
  const handleResizeStop = (layout: any[]) => {
    setLayout(layout);
    const updatedCharts = charts.map(chart => {
      const item = layout.find(l => l.i === `chart-${chart.id}`);
      if (item) {
        const newWidth = (item.w / 12) * 100; // 将网格单位转换为百分比宽度
        const newHeight = item.h * 50; // 根据布局高度计算新的高度
        return {
          ...chart,
          width: newWidth,
          height: newHeight,
        };
      }
      return chart;
    });
    setCharts(updatedCharts);

    // 调整 iframe 大小
    updatedCharts.forEach(chart => {
      const iframe = document.getElementById(`iframe-${chart.id}`) as HTMLIFrameElement;
      if (iframe) {
        sendResizeMessage(iframe, updatedCharts.find(c => c.id === chart.id).width, updatedCharts.find(c => c.id === chart.id).height);
      }
    });
  };

  // 父窗口发送调整大小消息
  const sendResizeMessage = (iframe: HTMLIFrameElement, width: number, height: number) => {
    iframe.contentWindow?.postMessage({
      type: 'resizeChart',
      width,
      height,
    }, '*');
  };

  window.addEventListener('message', (event) => {
    if (event.data.type === 'resizeChart') {
      const { width, height } = event.data;
      // 假設你想調整圖表的大小
      const chart = document.getElementById('chart');
      if (chart) {
        chart.style.width = `${width}px`;
        chart.style.height = `${height}px`;
      }
    }
  });

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
          {exportMessage && <div className={styles.exportMessage}>{exportMessage}</div>}
          <div className='theContent'>
            <ResponsiveGridLayout
              layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 12, sm: 8, xs: 6, xxs: 2 }}  // Maintain a grid with 12 columns on large screens
              onLayoutChange={handleLayoutChange}
              onResizeStop={handleResizeStop} // 添加此事件处理函数
              isDraggable={false}
              isResizable={true}
            >
              {charts.map(chart => (
                <div key={`chart-${chart.id}`} className={styles.dataCard} data-grid={{ i: `chart-${chart.id}`, ...layout.find(l => l.i === `chart-${chart.id}`) }}>
                  <iframe
                    id={`iframe-${chart.id}`} // 為 iframe 添加唯一 ID
                    src={chart.chartImage}
                    title={chart.name}
                    className={styles.chartIframe}
                    frameBorder="0"
                  />
                  <ChartWithDropdown
                    exportData={handleExport}
                    chartId={chart.id}
                    requestData={[]}
                    onChartSelect={() => handleChartSelect(chart.id)}
                    currentUserId={''} // Replace with actual user ID
                    canAssign={chart.canAssign} // Update based on your logic
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
