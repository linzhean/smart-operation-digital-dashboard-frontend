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
import { Dashboard } from '../../services/types/dashboard';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Home: React.FC = () => {
  const [layout, setLayout] = useState<any[]>([]);
  const [selectedChartData, setSelectedChartData] = useState<any>(null);
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(null);
  const [charts, setCharts] = useState<any[]>([]);
  const [availableCharts, setAvailableCharts] = useState<any[]>([]);

  // Fetch available charts
  useEffect(() => {
    const fetchAvailableCharts = async () => {
      try {
        const response = await ChartService.getAvailableCharts();
        if (response.result) {
          setAvailableCharts(response.data);
        } else {
          console.error('Failed to fetch available charts:', response.errorCode);
        }
      } catch (error) {
        console.error('Error fetching available charts:', error);
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
            const newLayout = response.data.map((chart: any, index: number) => ({
              i: `chart-${chart.id}`,
              x: (index * 4) % 12,
              y: Math.floor(index / 3) * 4,
              w: 4,
              h: 4,
            }));
            setLayout(newLayout);
          } else {
            console.error('Dashboard charts is not an array:', response);
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
      console.error('Error selecting chart:', error);
      alert('An error occurred while selecting the chart. Please try again.');
    }
  };

  const handleDashboardCreated = (dashboard: Dashboard, newCharts: any[]) => {
    setSelectedDashboard(dashboard.id.toString());
    setCharts(newCharts);
    const newLayout = newCharts.map((chart: any, index: number) => ({
      i: `chart-${chart.id}`,
      x: (index * 4) % 12,
      y: Math.floor(index / 3) * 4,
      w: 4,
      h: 4,
    }));
    setLayout(newLayout);
  };

  const handleAddChart = async (chart: any) => {
    if (!selectedDashboard) {
      alert('Please select a dashboard first.');
      return;
    }

    try {
      // Prepare the chart data
      const chartData = {
        name: chart.name || 'New Chart',
        scriptFile: '', // You may fill in relevant data here
        scriptPath: '', // You may fill in relevant data here
        imageFile: '', // You may fill in relevant data here
        showcaseImage: '', // You may fill in relevant data here
        chartImage: '', // You may fill in relevant data here
        chartHTML: '', // You may fill in relevant data here
        canAssign: true,
        observable: true,
        available: true,
        createId: 'currentUserId', // Replace with actual user ID
        createDate: new Date().toISOString(),
        modifyId: 'currentUserId', // Replace with actual user ID
        modifyDate: new Date().toISOString(),
        chartGroupId: Number(selectedDashboard), // Link to the current dashboard
      };

      // Create the new chart
      const newChart = await ChartService.createChart(chartData);

      // Fetch the newly added chart data
      const fetchedChart = await ChartService.getChartData(newChart.id);

      // Update the charts state
      setCharts(prevCharts => [...prevCharts, fetchedChart]);

      // Update the layout
      const newLayoutItem = {
        i: `chart-${fetchedChart.id}`,
        x: (charts.length * 4) % 12,
        y: Math.floor(charts.length / 3) * 4,
        w: 4,
        h: 4,
      };
      setLayout(prevLayout => [...prevLayout, newLayoutItem]);
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
          onAddChart={handleAddChart}  // Pass function to handle adding charts
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
                <div key={`chart-${chart.id}`} className={styles.dataCard}>
                  {/* Display the chart's showcase image */}
                  <img src={chart.chartImage} alt={chart.name} className={styles.chartImage} />

                  {/* Include ChartWithDropdown for additional functionalities */}
                  <ChartWithDropdown
                    exportData={handleExport}
                    chartId={chart.id}
                    requestData={[]}
                    onChartSelect={() => handleChartSelect(chart.id)}
                    currentUserId={''}
                    canAssign={true}
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
