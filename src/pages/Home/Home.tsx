import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout'; // Import Layout type directly
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

const ResponsiveGridLayout = WidthProvider(Responsive);

const Home: React.FC = () => {
  const [layout, setLayout] = useState([
    { i: 'lineChart', x: 0, y: 0, w: 4, h: 4 },
    { i: 'barChart', x: 4, y: 0, w: 4, h: 4 },
    { i: 'doughnutChart', x: 8, y: 0, w: 4, h: 4 },
  ]);

  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(null);

  useEffect(() => {
    // Initial data fetching can go here
  }, [selectedDashboard]);

  const handleExport = async (chartId: number, requestData: string[]): Promise<{ result: boolean; errorCode: string; data: Blob }> => {
    try {
      const permissionResponse = await getExportPermission(chartId);
      if (!permissionResponse.result) {
        alert(`Failed to get export permission: ${permissionResponse.errorCode}`);
        return { result: false, errorCode: permissionResponse.errorCode, data: new Blob() };
      }

      const exportResponse = await exportData(chartId, requestData);
      if (!exportResponse.result) {
        alert(`Failed to export data: ${exportResponse.errorCode}`);
        return { result: false, errorCode: exportResponse.errorCode, data: new Blob() };
      }

      const blob = new Blob([exportResponse.data], { type: 'application/octet-stream' });
      saveAs(blob, 'exported_data.csv');

      alert('Data exported successfully!');
      return { result: true, errorCode: '', data: blob };
    } catch (error) {
      console.error('Export error:', error);
      alert('An error occurred during export. Please try again.');
      return { result: false, errorCode: 'unknown', data: new Blob() };
    }
  };

  return (
    <div className='wrapper'>
      <div className="Home">
        <DashboardSidebar onSelectDashboard={setSelectedDashboard} />
        <div className='main_container'>
          <div className='theContent'>
            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: layout }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={30}
              onLayoutChange={(layout: React.SetStateAction<{ i: string; x: number; y: number; w: number; h: number; }[]>)  => setLayout(layout)}
            >
              <div key="lineChart" className="dataCard">
                <ChartWithDropdown exportData={handleExport} chartId={1} requestData={["data1", "data2"]}>
                  <LineChart />
                </ChartWithDropdown>
              </div>
              <div key="barChart" className="dataCard">
                <ChartWithDropdown exportData={handleExport} chartId={2} requestData={["data1", "data2"]}>
                  <BarChart />
                </ChartWithDropdown>
              </div>
              <div key="doughnutChart" className="dataCard">
                <ChartWithDropdown exportData={handleExport} chartId={3} requestData={["data1", "data2"]}>
                  <DoughnutChart />
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
