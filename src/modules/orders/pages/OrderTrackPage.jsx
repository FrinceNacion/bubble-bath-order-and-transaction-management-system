import { useState, useEffect, useMemo } from 'react';
import OrderDetailsButton from '../components/OrderDetailsButton';
import StatusBadge from '../../../common/components/StatusBadge';
import { API_ENDPOINTS } from '../../../common/services/api';

function OrderListTable({ sortType }) {
    const [orders, setOrders] = useState([]);

    const handleCancelOrder = async (orderId) => {
        try {
            const response = await fetch(API_ENDPOINTS.ORDERS.UPDATE_STATUS, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: orderId, status: "Cancelled" })
            });
            const data = await response.json();
            if (data.success) {
                fetchOrders();
            } else {
                alert("Failed to update status: " + data.error);
            }
        } catch (error) {
            console.error("Update status failed:", error);
            alert("Error updating status. Please try again.");
        }
    }

    const fetchOrders = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.ORDERS.GET_ALL, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const sortedOrders = useMemo(() => {
        if (!orders || orders.length === 0) return [];
        const sorted = [...orders];
        if (sortType === 'date') {
            sorted.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
        } else if (sortType === 'customer') {
            sorted.sort((a, b) => (a.customer || '').localeCompare(b.customer || ''));
        } else if (sortType === 'amount') {
            sorted.sort((a, b) => {
                const amountA = parseFloat(String(a.order_amount).replace(/[^0-9.-]+/g, '')) || 0;
                const amountB = parseFloat(String(b.order_amount).replace(/[^0-9.-]+/g, '')) || 0;
                return amountB - amountA;
            });
        } else if (sortType === 'quantity') {
            sorted.sort((a, b) => parseInt(b.order_item_count) - parseInt(a.order_item_count));
        } else if (sortType === 'status') {
            sorted.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
        }
        return sorted;
    }, [orders, sortType]);

    return (
        <div className='d-flex flex-column w-100'>
            <div className="d-flex flex-column gap-3">
                {sortedOrders.length > 0 ? (
                    sortedOrders.map((order) => (
                        <div key={order.order_id} className='d-flex card p-3 flex-column w-100 shadow-sm border-0 mb-2'>
                            <div className="d-flex flex-row justify-content-between mb-3">
                                <div className="d-flex flex-column">
                                    <p className="m-0 fw-semibold text-dark">{order.customer}</p>
                                    <p className="small text-secondary m-0">Order #{order.order_id}</p>        
                                </div>
                                <div className="d-flex flex-column">
                                    <p className="m-0"><StatusBadge status={order.status} /></p>
                                </div>
                            </div>
                            <div className="d-flex flex-row justify-content-between flex-wrap gap-3 mb-3 px-2">
                                <div className="d-flex flex-column">
                                    <p className="m-0 text-secondary small">Order Date</p>
                                    <p className="text-dark small mb-0">{order.order_date.split(" ")[0]}</p>
                                </div>
                                <div className="d-flex flex-column">
                                    <p className="m-0 text-secondary small">Due Date</p>
                                    <p className="text-dark small mb-0">{order.pickup_date.split(" ")[0]}</p>
                                </div>
                                <div className="d-flex flex-column">
                                    <p className="m-0 text-secondary small">Total Amount</p>
                                    <p className="text-dark small mb-0">₱ {order.order_amount}</p>
                                </div>
                                <div className="d-flex flex-column">
                                    <p className="m-0 text-secondary small">Item Quantity</p>
                                    <p className="text-dark small mb-0">{order.order_item_count}</p>
                                </div>
                            </div>
                            <div className="d-flex flex-row gap-2 justify-content-end pt-2 border-top">
                                <OrderDetailsButton order={order} onRefresh={fetchOrders} />
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleCancelOrder(order.order_id)}>Cancel Order</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-5 text-secondary">
                        <p>No orders found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function OrderTrackPage() {
    const [sortType, setSortType] = useState('date');

    return (
        <main className="container flex-fill p-4 p-xl-5">
            <div className="d-flex flex-column">
                <h4 className="fw-semibold text-dark mb-1">Order Tracking</h4>
                <p className="text-secondary small mb-4">Track and Manage Orders.</p>
            </div>
            <div className="d-flex flex-column">
                <div className="card border-0 bg-transparent">
                    <div className="card-header d-flex flex-row flex-wrap gap-2 justify-content-between p-0 pb-3 border-bottom-0 bg-transparent">
                        <h5 className="card-title m-0">Order List</h5>
                        <div className="btn-group btn-group-sm" role="group">
                            <input type="radio" className="btn-check" name="sort-type" id="sort-type-date" checked={sortType === 'date'} onChange={() => setSortType('date')}/>
                            <label className="btn btn-outline-dark" htmlFor="sort-type-date">Date</label>
                            
                            <input type="radio" className="btn-check" name="sort-type" id="sort-type-customer" checked={sortType === 'customer'} onChange={() => setSortType('customer')}/>
                            <label className="btn btn-outline-dark" htmlFor="sort-type-customer">Customer</label>

                            <input type="radio" className="btn-check" name="sort-type" id="sort-type-amount" checked={sortType === 'amount'} onChange={() => setSortType('amount')}/>
                            <label className="btn btn-outline-dark" htmlFor="sort-type-amount">Amount</label>

                            <input type="radio" className="btn-check" name="sort-type" id="sort-type-quantity" checked={sortType === 'quantity'} onChange={() => setSortType('quantity')}/>
                            <label className="btn btn-outline-dark" htmlFor="sort-type-quantity">Quantity</label>
                            
                            <input type="radio" className="btn-check" name="sort-type" id="sort-type-status" checked={sortType === 'status'} onChange={() => setSortType('status')}/>
                            <label className="btn btn-outline-dark" htmlFor="sort-type-status">Status</label>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <OrderListTable sortType={sortType} />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default OrderTrackPage;