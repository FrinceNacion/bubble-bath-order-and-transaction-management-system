import { useState, useEffect } from 'react';
import StatusBadge from '../../../common/components/StatusBadge';
import { API_ENDPOINTS } from '../../../common/services/api';

function RecentOrdersTable({ className }) {
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.ORDERS.GET_LATEST, {
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
      {orders.length > 0 ? (
        orders.map((order, index) => (
          <div key={index} className={`d-flex justify-content-between align-items-center py-3 ${index < orders.length - 1 ? 'border-bottom' : ''}`}>
            <div>
              <div className="fw-semibold mb-1">{order.customer}</div>
              <div className="small text-secondary">Pickup date: {order.pickup_date.split(' ')[0]}</div>
            </div>
            <div className="text-end">
              <div className="fw-semibold">PHP {order.order_amount}</div>
              <StatusBadge status={order.status} size="sm" />
            </div>
          </div>
        ))
      ) : (
        <div className="text-muted small py-3">No recent orders found.</div>
      )}
    </div>
  );
}

export default RecentOrdersTable;