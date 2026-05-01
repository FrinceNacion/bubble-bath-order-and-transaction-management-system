import { useState, useEffect, useMemo } from 'react';

function OrderListTable({ sortType }) {
    const getOrdersEndpoint = 'http://localhost/bubble-bath-backend/get_all_orders.php';

    const [orders, setOrders] = useState([]);

    const processFetchedOrders = (data) => {
        if (data.success) {
            console.log('Fetched orders:', data.orders, data.count);
            setOrders(data.orders || []);
        } else {
            console.error('Error fetching orders:', data.error);
        }
    }

    const fetchOrders = async () => {
        try {
            const response = await fetch(getOrdersEndpoint, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            const text = await response.text();
            const data = text ? JSON.parse(text) : {};
            processFetchedOrders(data);
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
            // Sort by order_date descending (newest first)
            sorted.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
        } else if (sortType === 'customer') {
            // Sort by customer ascending (A-Z)
            sorted.sort((a, b) => (a.customer || '').localeCompare(b.customer || ''));
        } else if (sortType === 'amount') {
            // Sort by amount descending (highest first)
            sorted.sort((a, b) => {
                const amountA = parseFloat(String(a.order_amount).replace(/[^0-9.-]+/g, '')) || 0;
                const amountB = parseFloat(String(b.order_amount).replace(/[^0-9.-]+/g, '')) || 0;
                return amountB - amountA;
            });
        } else if (sortType === 'quantity') {
            // Sort by quantity descending (highest first)
            sorted.sort((a, b) => parseInt(b.order_item_count) - parseInt(a.order_item_count));
        } else if (sortType === 'status') {
            // Sort by status ascending
            sorted.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
        }
        return sorted;
    }, [orders, sortType]);

    return (
        <div className='d-flex flex-column w-100'>
            <div className="d-flex flex-column gap-3">
                {sortedOrders.length > 0 ? (
                    sortedOrders.map((order) => (
                        <div key={order.order_id} className='d-flex card p-3 flex-column w-100'>
                            <div className="d-flex flex-row justify-content-between">
                                <div className="d-flex flex-column">
                                    <p className="m-0 fw-semibold text-dark">{order.customer}</p>
                                    <p className="small text-secondary m-0">Order #{order.order_id}</p>        
                                </div>
                                <div className="d-flex flex-column">
                                    <p className="m-0"><span className="badge bg-info text-dark">{order.status}</span></p>
                                </div>
                            </div>
                            <div className="d-flex flex-row justify-content-evenly">
                                <div className="d-flex flex-column">
                                    <p className="m-0 text-secondary small">
                                        Order Date
                                    </p>
                                    <p className="text-dark">{order.order_date.split(" ")[0]}</p>
                                </div>
                                <div className="d-flex flex-column">
                                    <p className="m-0 text-secondary small">
                                        Due Date
                                    </p>
                                    <p className="text-dark">{order.pickup_date.split(" ")[0]}</p>
                                </div>
                                <div className="d-flex flex-column">
                                    <p className="m-0 text-secondary small">
                                        Total Amount
                                    </p>
                                    <p className="text-dark">₱ {order.order_amount}</p>
                                </div>
                                <div className="d-flex flex-column">
                                    <p className="m-0 text-secondary small">
                                        Item Quantity
                                    </p>
                                    <p className="text-dark">{order.order_item_count}</p>
                                </div>
                            </div>
                            <div className="d-flex flex-row gap-2 justify-content-end">
                                <button className="btn btn-outline-dark d-flex flex-row gap-2">
                                    <i className="bi bi-eye"/>
                                    See Details
                                </button>
                                <button className="btn btn-danger">Cancel Order</button>
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
                <div className="card">
                    <div className="card-header d-flex flex-row justify-content-between p-3 pb-0 border-bottom-0 bg-white">
                        <h5 className="card-title m-0">Order List</h5>
                        <div className="btn-group btn-group-sm" role="group" aria-label="radio toggle button group">
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
                    <div className="card-body">
                        <OrderListTable sortType={sortType} />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default OrderTrackPage;