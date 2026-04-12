
import OverviewCard from '../components/OverviewCard';
import RecentOrdersTable from '../components/RecentOrdersTable';
import QuickActions from '../components/QuickActions';
import Authenticate from '../utils/Authenticate';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function DashboardPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const result = await Authenticate();
      if(result.success){
        setUser(result.user);
      }else{
        navigate('/login');
      }
    };
    fetchUser();
  },[]);

  useEffect(() => {
    console.log("DashboardPage: User state updated:", user);
  },[user]);
  
  // kailangan palitan
  const ordersData = [
    { id: 101, customer: 'Ivan', amount: 100.00, status: 'pending' },
    { id: 102, customer: 'Tristan', amount: 140.00, status: 'claimed' },
    { id: 103, customer: 'Trijstan', amount: 125.00, status: 'in-progress' },
    { id: 104, customer: 'Frince', amount: 130.00, status: 'completed' },
  ];
  
  return (
    <main className="container flex-fill p-4 p-xl-5">
      <h4 className="fw-semibold text-dark mb-1">Dashboard Overview</h4>
      <p className="text-secondary small mb-4">Welcome back, {user?.name}!</p>

      <div className="d-flex gap-3 mb-4 flex-wrap">
        <OverviewCard title="Total Orders" value="--" icon="bi-box" color="primary" />
        <OverviewCard title="Pending Orders" value="--" icon="bi-box-seam" color="warning" />
        <OverviewCard title="Total Customers" value="--" icon="bi-people" color="info" />
        <OverviewCard title="Today's Revenue" value="--" icon="bi-currency-dollar" color="success" />
      </div>

      <div className="container p-0 d-flex gap-3 flex-row flex-wrap-reverse">
        <RecentOrdersTable className="w-50" orders={ordersData}/>
        <QuickActions className="w-50" />
      </div>
    </main>
  );
};

export default DashboardPage;
