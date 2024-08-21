import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import LineChart from '../../component/Chart/LineChart';
import BarChart from '../../component/Chart/BarChart';
import DoughnutChart from '../../component/Chart/DoughnutChart';
import DashboardSidebar from '../../component/Dashboard/DashboardSidebar';
import { saveAs } from 'file-saver';
import { exportData, getExportPermission } from '../../services/exportService';
import ChartWithDropdown from '../../component/Dashboard/ChartWithDropdown';
import ChartService from '../../services/ChartService';
import styles from './Home.module.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Home: React.FC = () => {
  const [layout, setLayout] = useState<any[]>([]);
  const [selectedChartData, setSelectedChartData] = useState<any>(null);
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(null);
  const [charts, setCharts] = useState<any[]>([]); // 用於追蹤已新增的圖表

  useEffect(() => {
    if (selectedDashboard) {
      const fetchDashboardCharts = async () => {
        try {
          const dashboardCharts = await ChartService.getDashboardCharts(Number(selectedDashboard));
          if (Array.isArray(dashboardCharts)) {
            setCharts(dashboardCharts);
            const newLayout = dashboardCharts.map((chart: any, index: number) => ({
              i: `chart-${chart.id}`,
              x: (index * 4) % 12,
              y: Math.floor(index / 3) * 4,
              w: 4,
              h: 4,
            }));
            setLayout(newLayout);
          } else {
            console.error('Dashboard charts is not an array:', dashboardCharts);
            setCharts([]);
          }
        } catch (error) {
          console.error('Failed to fetch dashboard charts:', error);
          setCharts([]);
        }
      };
      fetchDashboardCharts();
    } else {
      setLayout([]);
      setCharts([]);
    }
  }, [selectedDashboard]);

  const handleExport = async (chartId: number, requestData: string[]): Promise<{ result: boolean; errorCode: string; data: Blob }> => {
    try {
      const permissionResponse = await getExportPermission(chartId);
      if (!permissionResponse.result) {
        alert(`無法獲取匯出權限: ${permissionResponse.errorCode}`);
        return { result: false, errorCode: permissionResponse.errorCode, data: new Blob() };
      }

      const exportResponse = await exportData(chartId, { exporterList: requestData, dashboardCharts: [chartId] });
      if (!exportResponse.result) {
        alert(`匯出數據失敗: ${exportResponse.errorCode}`);
        return { result: false, errorCode: exportResponse.errorCode, data: new Blob() };
      }

      const blob = new Blob([exportResponse.data], { type: 'application/octet-stream' });
      saveAs(blob, 'exported_data.csv');

      alert('數據匯出成功！');
      return { result: true, errorCode: '', data: blob };
    } catch (error) {
      console.error('匯出錯誤:', error);
      alert('匯出過程中發生錯誤。請再試一次。');
      return { result: false, errorCode: 'unknown', data: new Blob() };
    }
  };

  const handleChartSelect = async (chartId: number) => {
    try {
      const chartData = await ChartService.getChartData(chartId);
      setSelectedChartData(chartData.data);
    } catch (error) {
      console.error('選擇圖表時失敗:', error);
      alert('選擇圖表時發生錯誤。請再試一次。');
    }
  };

  const handleAddChart = () => {
    if (selectedDashboard) {
      // 新增圖表到儀表板的邏輯
      const newChartId = Date.now(); // 替代的新圖表 ID
      setLayout(prevLayout => [...prevLayout, { i: `chart-${newChartId}`, x: 0, y: 0, w: 4, h: 4 }]);
      setCharts(prevCharts => [...prevCharts, { id: newChartId, name: `Chart ${newChartId}` }]); // 將新圖表添加到狀態中
    } else {
      alert('請先選擇一個儀表板。');
    }
  };

  return (
    <div className='wrapper'>
      <div className="Home">
        <DashboardSidebar onSelectDashboard={setSelectedDashboard} />
        <div className={styles.dashboard_container}>
          <button
            onClick={handleAddChart}
            className={styles.addChartButton}
            disabled={!selectedDashboard} // Disable button if no dashboard is selected
          >
            新增圖表
          </button>
          <div className='theContent'>
            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            >
              {charts.map(chart => (
                <div key={`chart-${chart.id}`} className={styles.dataCard}>
                  <ChartWithDropdown exportData={handleExport} chartId={chart.id} requestData={[]} onChartSelect={handleChartSelect} currentUserId={''}>
                    {/* 根據圖表類型動態渲染圖表組件 */}
                    <LineChart data={selectedChartData} /> {/* 根據圖表類型進行調整 */}
                  </ChartWithDropdown>
                </div>
              ))}
            </ResponsiveGridLayout>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
