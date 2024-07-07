import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import LineChart from '../../component/Chart/LineChart';
import BarChart from '../../component/Chart/BarChart';
import DoughnutChart from '../../component/Chart/DoughnutChart';
import ChartService from '../../services/ChartService';
import '../../styles/Home.css';
import '../../styles/content.css';

interface Layout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const Home: React.FC = () => {
  const [layout, setLayout] = useState<Layout[]>([
    { i: 'lineChart', x: 0, y: 0, w: 4, h: 4 },
    { i: 'barChart', x: 4, y: 0, w: 4, h: 4 },
    { i: 'doughnutChart', x: 8, y: 0, w: 4, h: 4 },
  ]);

  const fetchCharts = async () => {
    try {
      const charts = await ChartService.getAllCharts();
      console.log('Fetched charts:', charts);
    } catch (error) {
      console.error('Error fetching charts:', error);
    }
  };

  useEffect(() => {
    fetchCharts();
  }, []);

  return (
    <div className="Home">
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={30}
        onLayoutChange={(layout: Layout[]) => setLayout(layout)}
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
  );
};

export default Home;
