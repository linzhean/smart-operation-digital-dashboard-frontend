import React, { useEffect, useState } from 'react';
import DashboardService from '../../services/DashboardService';
import { Dashboard } from '../../services/types/dashboard';

const DashboardList: React.FC = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        const data = await DashboardService.getAllDashboards();
        setDashboards(data);
      } catch (error) {
        console.error('Error fetching dashboards:', error);
        setError('Error fetching dashboards.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchDashboards();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await DashboardService.deleteDashboard(id);
      setDashboards(prevDashboards => prevDashboards.filter(dashboard => dashboard.id !== id));
    } catch (error) {
      console.error('Error deleting dashboard:', error);
      setError('Error deleting dashboard.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        {dashboards.map((dashboard) => (
          <li key={dashboard.id}>
            {dashboard.name}
            <button onClick={() => handleDelete(dashboard.id)}>刪除</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DashboardList;
