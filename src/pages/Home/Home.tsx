import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import LineChart from '../../component/Chart/LineChart';
import BarChart from '../../component/Chart/BarChart';
import DoughnutChart from '../../component/Chart/DoughnutChart';
import DashboardSidebar from '../../component/Dashboard/DashboardSidebar';
import { saveAs } from 'file-saver'; // Import saveAs function
import '../../styles/Home.css';
import { exportData, getExportPermission } from '../../services/exportService';

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

  const handleExport = async () => {
    try {
      // Replace with actual logic to fetch export permission and data
      const chartId = 1; // Example chartId
      const requestData = ["data1", "data2"]; // Example request data

      // Example of calling backend to get export permission
      const permissionResponse = await getExportPermission(chartId);
      if (!permissionResponse.result) {
        alert(`Failed to get export permission: ${permissionResponse.errorCode}`);
        return;
      }

      // Example of calling backend to export data
      const exportResponse = await exportData(chartId, requestData);
      if (!exportResponse.result) {
        alert(`Failed to export data: ${exportResponse.errorCode}`);
        return;
      }

      // Example of generating a file to download
      const blob = new Blob([exportResponse.data], { type: 'application/octet-stream' });
      saveAs(blob, 'exported_data.csv'); // Save as CSV file, change file type as needed

      alert('Data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('An error occurred during export. Please try again.');
    }
  };

  return (
    <div className='wrapper'>
      <div className="Home">
        <DashboardSidebar onSelectDashboard={setSelectedDashboard} />
        <div className='main_container'>
          <div className='theContent'>
            <button onClick={handleExport} className="exportButton">匯出</button>
            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: layout }}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
              rowHeight={30}
              onLayoutChange={(layout: React.SetStateAction<{ i: string; x: number; y: number; w: number; h: number; }[]>) => setLayout(layout)}
            >
              <div key="lineChart" className="dataCard">
                <div className="revenueCard">
                  <LineChart />
                </div>
              </div>
              <div key="barChart" className="dataCard">
                <div className="customerCard">
                  <BarChart />
                </div>
              </div>
              <div key="doughnutChart" className="dataCard">
                <div className="categoryCard">
                  <DoughnutChart />
                </div>
              </div>
            </ResponsiveGridLayout>
          </div>
        </div></div></div>
  );
};

export default Home;