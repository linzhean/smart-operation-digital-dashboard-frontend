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
  const [users, setUsers] = useState<any[]>([]);
  const [canAssign, setCanAssign] = useState<boolean>(true);

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

  useEffect(() => {
    if (selectedDashboard) {
      const fetchDashboardCharts = async () => {
        try {
          const response = await ChartService.getDashboardCharts(Number(selectedDashboard));
          if (response.result && Array.isArray(response.data)) {
            setCharts(response.data);
            setSelectedCharts(response.data.map((chart: any) => ({
              id: chart.id,
              name: chart.name,
            })));
            const newLayout = response.data.map((chart: any, index: number) => ({
              i: `chart-${chart.id}`,
              x: (index * 4) % 12,
              y: Math.floor(index / 3) * 4,
              w: 4,
              h: 4,
            }));
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
        }
      };
      fetchDashboardCharts();
    } else {
      setLayout([]);
      setCharts([]);
      setSelectedCharts([]);
    }
  }, [selectedDashboard]);

  const handleExport = async (chartId: number, requestData: string[]) => {
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

  const handleAddChart = async (chartsToAdd: any[]) => {
    if (!selectedDashboard) {
      alert('Please select a dashboard first.');
      return;
    }

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
      const newLayout = newCharts.map((chart: any, index: number) => ({
        i: `chart-${chart.id}`,
        x: (charts.length * 4 + index * 4) % 12,
        y: Math.floor((charts.length + index) / 3) * 4,
        w: 4,
        h: 4,
      }));
      setLayout(prevLayout => [...prevLayout, ...newLayout]);

    } catch (error) {
      console.error('Error adding chart:', error);
      alert('An error occurred while adding the chart.');
    }
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
          <div className='theContent'>
            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            >
              {charts.map(chart => (
                <div key={`chart-${chart.id}`} className={styles.dataCard} data-grid={{ i: `chart-${chart.id}`, x: 0, y: 0, w: 4, h: 4 }}>
                  <img src={chart.chartImage} alt={chart.name} className={styles.chartImage} />
                  <ChartWithDropdown
                    exportData={handleExport}
                    chartId={currentChartId || 0}
                    requestData={[]}
                    onChartSelect={() => handleChartSelect(chart.id)}
                    currentUserId={''} // Replace with actual user ID
                    canAssign={canAssign} // Update based on your logic
                    selectedDashboardId={selectedDashboard ? Number(selectedDashboard) : undefined} // Pass selectedDashboardId correctly
                  >
                    {selectedChartData ? <LineChart data={selectedChartData} /> : <p></p>}
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


