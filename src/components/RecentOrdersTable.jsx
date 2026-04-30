import { useState, useEffect } from 'react';

function RecentOrdersTable({ className }) {
  const [orders, setOrders] = useState([]);
  const getLatestOrdersEndpoint = 'http://localhost/bubble-bath-backend/get_latest_orders.php';
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(getLatestOrdersEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ limit: 5 })
        });
        const data = await response.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div style={{ minWidth: 200, flex: '1 1 200px' }} className={`card border-0 shadow-sm rounded-3 p-4 ${className}`}>
      <h6 className="fw-semibold mb-3">Recent Orders</h6>
      {orders.map((order, index) => (
        <div key={index} className={`d-flex justify-content-between align-items-center py-3 ${index < orders.length - 1 ? 'border-bottom' : ''}`}>
          <div>
            <div className="fw-semibold mb-1">{order.customer}</div>
            <div className="small text-secondary">Pickup date: {order.pickup_date.split(' ')[0]}</div>
          </div>
          <div className="text-end">
            <div className="fw-semibold">PHP {order.order_amount}</div>
            <span className={`badge bg-${order.status === 'pending' ? 'secondary' : order.status === 'claimed' ? 'warning text-dark' : order.status === 'in-progress' ? 'info' : 'success'} text-capitalize`}>{order.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecentOrdersTable;