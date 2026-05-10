import OverviewCard from '../components/OverviewCard';
import RecentOrdersTable from '../../orders/components/RecentOrdersTable';
import QuickActions from '../components/QuickActions';
import Authenticate from '../../../common/utils/Authenticate';
import { API_ENDPOINTS } from '../../../common/services/api';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function TotalOrdersCard() {
  const [totalOrders, setTotalOrders] = useState([]);

  const fetchTotalOrders = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ORDERS.GET_ALL, { method: 'POST', credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        setTotalOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching total orders:', error);
    }
  };

  useEffect(() => {
    fetchTotalOrders();
  }, []);

  return (
    <OverviewCard title="Total Orders" value={totalOrders?.length || "0"} icon="bi-box" color="primary" />
  )
}

function PendingOrdersCard() {
  const [pendingOrders, setPendingOrders] = useState([]);

  const fetchPendingOrders = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ORDERS.GET_BY_STATUS, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'pending' })
      });
      const data = await response.json();
      if (data.success) {
        setPendingOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching pending orders:', error);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  return (
    <OverviewCard title="Pending Orders" value={pendingOrders?.length || "0"} icon="bi-box-seam" color="warning" />
  )
}

function TotalCustomersCard() {
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CUSTOMERS.GET_ALL, { credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <OverviewCard title="Total Customers" value={customers?.length || "0"} icon="bi-people" color="info" />
  )
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
      <p className="text-secondary small mb-4">Welcome back, {user?.name}!</p>

      <div className="d-flex gap-3 mb-4 flex-wrap">
        <TotalOrdersCard />
        <PendingOrdersCard />
        <TotalCustomersCard />
        <OverviewCard title="Today's Revenue" value="--" icon="bi-currency-dollar" color="success" />
      </div>

      <div className="container p-0 d-flex gap-3 flex-row flex-wrap-reverse">
        <RecentOrdersTable className="w-100" />
        <QuickActions className="w-100" />
      </div>
    </main>
  );
};

export default DashboardPage;
