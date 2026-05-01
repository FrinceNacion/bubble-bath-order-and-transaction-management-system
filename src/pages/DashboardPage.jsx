import OverviewCard from '../components/OverviewCard';
import RecentOrdersTable from '../components/RecentOrdersTable';
import QuickActions from '../components/QuickActions';
import Authenticate from '../utils/Authenticate';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function TotalOrdersCard() {
  const getTotalOrdersEndpoint = 'http://localhost/bubble-bath-backend/get_orders_by_status.php';

  const [totalOrders, setTotalOrders] = useState([]);

  const processFetchedTotalOrders = (data) => {
    if (data.success) {
      if (data.count > 0) { setTotalOrders(data.data); }
    } else {
      console.error('Error fetching total orders:', data.error);
    }
  }

  const fetchTotalOrders = async () => {
    try {
      const response = await fetch(getTotalOrdersEndpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'pending'
        })
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      processFetchedTotalOrders(data);
    } catch (error) {
      console.error('Error fetching total orders:', error);
    }
  };

  useEffect(() => {
    fetchTotalOrders();
  }, []);

  return (
    <OverviewCard title="Total Orders" value={totalOrders?.length || "--"} icon="bi-box" color="primary" />
  )
}

function PendingOrdersCard() {
  const getPendingOrdersEndpoint = 'http://localhost/bubble-bath-backend/get_orders_by_status.php';

  const [pendingOrders, setPendingOrders] = useState([]);

  const processFetchedPendingOrders = (data) => {
    if (data.success) {
      if (data.count > 0) { setPendingOrders(data.data); }
    } else {
      console.error('Error fetching pending orders:', data.error);
    }
  }

  const fetchPendingOrders = async () => {
    try {
      const response = await fetch(getPendingOrdersEndpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'pending'
        })
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      processFetchedPendingOrders(data);
    } catch (error) {
      console.error('Error fetching pending orders:', error);
    }
  };

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  return (
    <OverviewCard title="Pending Orders" value={pendingOrders?.length || "--"} icon="bi-box-seam" color="warning" />
  )
}

function TotalCustomersCard() {
  const getCustomersEndpoint = 'http://localhost/bubble-bath-backend/get_all_customers.php';

  const [customers, setCustomers] = useState([]);

  const processFetchedCustomers = (data) => {
    if (data.success) {
      console.log('Fetched customers:', data.customers, data.count);
      if (data.count > 0) { setCustomers(data.customers); }
    } else {
      console.error('Error fetching customers:', data.error);
    }
  }

  const fetchCustomers = async () => {
    try {
      const response = await fetch(getCustomersEndpoint, { credentials: 'include' });
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
      processFetchedCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <OverviewCard title="Total Customers" value={customers?.length || "--"} icon="bi-people" color="info" />
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
  }, []);

  useEffect(() => {
    console.log("DashboardPage: User state updated:", user);
  }, [user]);

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
        <RecentOrdersTable className="w-50" />
        <QuickActions className="w-50" />
      </div>
    </main>
  );
};

export default DashboardPage;
