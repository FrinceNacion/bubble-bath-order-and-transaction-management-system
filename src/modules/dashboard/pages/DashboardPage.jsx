import OverviewCard from '../components/OverviewCard';
import RecentOrdersTable from '../../orders/components/RecentOrdersTable';
import QuickActions from '../components/QuickActions';
import Authenticate from '../../../common/utils/Authenticate';
import { API_ENDPOINTS } from '../../../common/services/api';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function DashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ANALYTICS.GET_DASHBOARD_STATS, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex gap-3 mb-4 flex-wrap w-100 justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex gap-3 mb-4 flex-wrap">
      <OverviewCard title="Total Orders" value={stats?.total_orders || "0"} icon="bi-box" color="primary" />
      <OverviewCard title="Pending Orders" value={stats?.pending_orders || "0"} icon="bi-box-seam" color="warning" />
      <OverviewCard title="Completed Orders" value={stats?.completed_orders || "0"} icon="bi-check-circle" color="success" />
      <OverviewCard title="Today's Revenue" value={`₱ ${parseFloat(stats?.today_revenue || 0).toLocaleString()}`} icon="bi-currency-dollar" color="success" />
      <OverviewCard title="Pending Payments" value={`₱ ${parseFloat(stats?.pending_payments || 0).toLocaleString()}`} icon="bi-hourglass-split" color="danger" />
    </div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const result = await Authenticate();
      if (result.success) {
        setUser(result.user);
      } else {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  return (
    <main className="container flex-fill p-4 p-xl-5">
      <h4 className="fw-semibold text-dark mb-1">Dashboard Overview</h4>
      <p className="text-secondary small mb-4">Welcome back, <span className="fw-bold">{String(user?.name)?.trimEnd()}</span>!</p>

      <DashboardStats />


      <div className="container p-0 d-flex gap-3 flex-row flex-wrap-reverse">
        <RecentOrdersTable className="w-100" />
        <QuickActions className="w-100" />
      </div>
    </main>
  );
};

export default DashboardPage;
