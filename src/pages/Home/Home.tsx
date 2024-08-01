import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import LineChart from '../../component/Chart/LineChart';
import BarChart from '../../component/Chart/BarChart';
import DoughnutChart from '../../component/Chart/DoughnutChart';
import DashboardSidebar from '../../component/Dashboard/DashboardSidebar';
import { saveAs } from 'file-saver';
import '../../styles/Home.css';
import { exportData, getExportPermission } from '../../services/exportService';
import ChartWithDropdown from '../../component/Dashboard/ChartWithDropdown';
import ChartService from '../../services/ChartService';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Home: React.FC = () => {
  const [layout, setLayout] = useState([
    { i: 'lineChart', x: 0, y: 0, w: 4, h: 4 },
    { i: 'barChart', x: 4, y: 0, w: 4, h: 4 },
    { i: 'doughnutChart', x: 8, y: 0, w: 4, h: 4 },
  ]);

  const [selectedChartData, setSelectedChartData] = useState<any>(null);
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDashboard) {
      // 基于所选仪表板获取数据
    }
  }, [selectedDashboard]);

  const handleExport = async (chartId: number, requestData: string[]): Promise<{ result: boolean; errorCode: string; data: Blob }> => {
    try {
      const permissionResponse = await getExportPermission(chartId);
      if (!permissionResponse.result) {
        alert(`获取导出权限失败: ${permissionResponse.errorCode}`);
        return { result: false, errorCode: permissionResponse.errorCode, data: new Blob() };
      }

      const exportResponse = await exportData(chartId, { exporterList: requestData, dashboardCharts: [chartId] });
      if (!exportResponse.result) {
        alert(`导出数据失败: ${exportResponse.errorCode}`);
        return { result: false, errorCode: exportResponse.errorCode, data: new Blob() };
      }

      const blob = new Blob([exportResponse.data], { type: 'application/octet-stream' });
      saveAs(blob, 'exported_data.csv');

      alert('数据导出成功!');
      return { result: true, errorCode: '', data: blob };
    } catch (error) {
      console.error('导出错误:', error);
      alert('导出过程中发生错误。请再试一次。');
      return { result: false, errorCode: 'unknown', data: new Blob() };
    }
  };

  const handleChartSelect = async (chartId: number) => {
    try {
      const chartData = await ChartService.getChartData(chartId);
      setSelectedChartData(chartData.data);
    } catch (error) {
      console.error('获取图表数据失败:', error);
      alert('选择图表时发生错误。请再试一次。');
    }
  };

  const requestData = ['exporter1@example.com', 'exporter2@example.com'];

  return (
    <div className='wrapper'>
      <div className="Home">
        <DashboardSidebar onSelectDashboard={setSelectedDashboard} />
        <div className='main_container'>
          <div className='theContent'>
            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            >
              <div key="lineChart" className="dataCard">
                <ChartWithDropdown exportData={handleExport} chartId={1} requestData={requestData} onChartSelect={handleChartSelect}>
                  <LineChart data={selectedChartData} />
                </ChartWithDropdown>
              </div>
              <div key="barChart" className="dataCard">
                <ChartWithDropdown exportData={handleExport} chartId={2} requestData={requestData} onChartSelect={handleChartSelect}>
                  <BarChart data={selectedChartData} />
                </ChartWithDropdown>
              </div>
              <div key="doughnutChart" className="dataCard">
                <ChartWithDropdown exportData={handleExport} chartId={3} requestData={requestData} onChartSelect={handleChartSelect}>
                  <DoughnutChart data={selectedChartData} />
                </ChartWithDropdown>
              </div>
            </ResponsiveGridLayout>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
