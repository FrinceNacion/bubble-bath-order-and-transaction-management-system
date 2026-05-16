import { useState, useEffect, useMemo } from 'react';
import OrderDetailsButton from '../components/OrderDetailsButton';
import StatusBadge from '../../../common/components/StatusBadge';
import { API_ENDPOINTS } from '../../../common/services/api';
import { showToast } from '../../../common/components/Toast';
import ConfirmDialog from '../../../common/components/ConfirmDialog';

function OrderListTable({ sortType, sortDirection }) {
    const [orders, setOrders] = useState([]);
    const [confirmCancel, setConfirmCancel] = useState({ show: false, orderId: null });
    const [loading, setLoading] = useState(false);

    const handleCancelOrder = async (orderId) => {
        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.ORDERS.UPDATE_STATUS, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: orderId, status: "Cancelled" })
            });
            const data = await response.json();
            if (data.success) {
                showToast("Order cancelled successfully.", "success");
                fetchOrders();
            } else {
                showToast(data.error || "Failed to cancel order.", "error");
            }
        } catch (error) {
            console.error("Update status failed:", error);
            showToast("Error updating status. Please try again.", "error");
        } finally {
            setLoading(false);
            setConfirmCancel({ show: false, orderId: null });
        }
    }

    const initiateCancel = (orderId) => {
        setConfirmCancel({ show: true, orderId });
    }

    const fetchOrders = async () => {
        setLoading(true);
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
            showToast("Failed to load orders. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const sortedOrders = useMemo(() => {
        if (!orders || orders.length === 0) return [];
        const sorted = [...orders];
        const modifier = sortDirection === 'asc' ? 1 : -1;

        sorted.sort((a, b) => {
            let result = 0;
            if (sortType === 'date') {
                result = new Date(a.order_date) - new Date(b.order_date);
            } else if (sortType === 'customer') {
                result = (a.customer || '').localeCompare(b.customer || '');
            } else if (sortType === 'amount') {
                const amountA = parseFloat(String(a.order_amount).replace(/[^0-9.-]+/g, '')) || 0;
                const amountB = parseFloat(String(b.order_amount).replace(/[^0-9.-]+/g, '')) || 0;
                result = amountA - amountB;
            } else if (sortType === 'quantity') {
                result = (parseInt(a.order_item_count) || 0) - (parseInt(b.order_item_count) || 0);
            } else if (sortType === 'status') {
                result = (a.status || '').localeCompare(b.status || '');
            } else if (sortType === 'orderId') {
                result = (parseInt(a.order_id) || 0) - (parseInt(b.order_id) || 0);
            }
            return result * modifier;
        });
        return sorted;
    }, [orders, sortType, sortDirection]);

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
                                <button
                                    className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                                    onClick={() => initiateCancel(order.order_id)}
                                    disabled={order.status === 'Cancelled' || order.status === 'Claimed'}
                                >
                                    <i className="bi bi-x-circle"></i>
                                    Cancel Order
                                </button>
                            </div>
                        </div>
                    ))
                ) : orders.length === 0 && !loading ? (
                    <div className="text-center p-5 text-secondary">
                        <p>No orders found.</p>
                    </div>
                ) : (
                    <div className="text-center p-5 text-secondary">
                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                        <span>Loading orders...</span>
                    </div>
                )}
            </div>

            <ConfirmDialog
                show={confirmCancel.show}
                title="Cancel Order"
                message={`Are you sure you want to cancel order #${confirmCancel.orderId}? This action cannot be undone.`}
                confirmLabel="Yes, Cancel Order"
                onConfirm={() => handleCancelOrder(confirmCancel.orderId)}
                onCancel={() => setConfirmCancel({ show: false, orderId: null })}
            />
        </div>
    )
}

function OrderTrackPage() {
    const [sortType, setSortType] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');

    const toggleSortDirection = () => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    return (
        <main className="container flex-fill p-4 p-xl-5">
            <div className="d-flex flex-column">
                <h4 className="fw-semibold text-dark mb-1">Order Tracking</h4>
                <p className="text-secondary small mb-4">Track and Manage Orders.</p>
            </div>
            <div className="d-flex flex-column">
                <div className="card border-0 bg-transparent">
                    <div className="card-header d-flex flex-row flex-wrap gap-2 justify-content-between p-0 pb-3 border-bottom-0 bg-transparent align-items-center">
                        <h5 className="card-title m-0">Order List</h5>
                        <div className="d-flex gap-2">
                            <div className="btn-group btn-group-sm" role="group">
                                <input type="radio" className="btn-check" name="sort-type" id="sort-type-date" checked={sortType === 'date'} onChange={() => setSortType('date')} />
                                <label className="btn btn-outline-dark" htmlFor="sort-type-date">Date</label>

                                <input type="radio" className="btn-check" name="sort-type" id="sort-type-customer" checked={sortType === 'customer'} onChange={() => setSortType('customer')} />
                                <label className="btn btn-outline-dark" htmlFor="sort-type-customer">Customer</label>

                                <input type="radio" className="btn-check" name="sort-type" id="sort-type-amount" checked={sortType === 'amount'} onChange={() => setSortType('amount')} />
                                <label className="btn btn-outline-dark" htmlFor="sort-type-amount">Amount</label>

                                <input type="radio" className="btn-check" name="sort-type" id="sort-type-quantity" checked={sortType === 'quantity'} onChange={() => setSortType('quantity')} />
                                <label className="btn btn-outline-dark" htmlFor="sort-type-quantity">Quantity</label>

                                <input type="radio" className="btn-check" name="sort-type" id="sort-type-status" checked={sortType === 'status'} onChange={() => setSortType('status')} />
                                <label className="btn btn-outline-dark" htmlFor="sort-type-status">Status</label>
                            </div>
                            <button className="btn btn-sm btn-dark d-flex align-items-center gap-1" onClick={toggleSortDirection} title={`Currently: ${sortDirection === 'asc' ? 'Ascending' : 'Descending'}`}>
                                <i className={`bi bi-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                                {sortDirection.toUpperCase()}
                            </button>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <OrderListTable sortType={sortType} sortDirection={sortDirection} />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default OrderTrackPage;