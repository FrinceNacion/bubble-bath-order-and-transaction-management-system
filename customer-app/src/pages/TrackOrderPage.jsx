import React, { useState } from 'react';
import { trackOrder } from '../services/api';
import StatusTimeline from '../components/StatusTimeline';

const TrackOrderPage = () => {
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!orderId || orderId.trim() === '') {
            setError('Please enter a valid Order ID.');
            return;
        }

        setLoading(true);
        setError('');
        setOrderData(null);

        try {
            const response = await trackOrder(orderId.trim());
            
            if (response && response.success && response.order) {
                setOrderData(response.order);
            } else {
                setError(response?.error || 'Order not found. Please check your ID and try again.');
            }
        } catch (err) {
            console.error("Tracking Error:", err);
            /*
            if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
                // Mocking data so we can see the UI even if the backend endpoint isn't ready
                console.warn("Using mock data because backend is unreachable or endpoint missing.");
                setTimeout(() => {
                    setOrderData({
                        order_id: orderId,
                        customer: 'Valued Customer',
                        order_date: new Date().toISOString().split('T')[0] + ' 10:00:00',
                        pickup_date: new Date(Date.now() + 86400000).toISOString().split('T')[0] + ' 14:00:00',
                        status: 'In Progress',
                        order_amount: '350.00',
                        order_item_count: '5',
                        items: [
                            { name: 'T-Shirts', quantity: 3, type: 'Wash & Fold' },
                            { name: 'Bed Sheets', quantity: 2, type: 'Dry Cleaning' }
                        ]
                    });
                    setLoading(false);
                }, 1000);
                return;
            }*/
            
            setError('Unable to connect to the server. Please try again later.');
        } finally {
            if (err?.code !== 'ERR_NETWORK') setLoading(false);
        }
    };

    return (
        <div className="container-fluid p-0">
            {/* Hero Section */}
            <div className="bg-info bg-gradient text-white py-5" style={{ minHeight: '300px' }}>
                <div className="container py-4 text-center">
                    <h1 className="display-5 fw-bold mb-3">Track Your Laundry Order</h1>
                    <p className="lead mb-4 opacity-75">
                        Enter your Order ID below to get real-time updates on your laundry and dry cleaning.
                    </p>
                    
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6">
                            <form onSubmit={handleSearch} className="bg-white p-2 rounded-pill shadow-sm d-flex">
                                <input 
                                    type="text" 
                                    className="form-control me-3 border-0 rounded-pill px-4" 
                                    placeholder="e.g. TRK-YYYY-XXXXX" 
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                    disabled={loading}
                                    aria-label="Order ID"
                                />
                                <button 
                                    type="submit" 
                                    className="btn btn-info rounded-pill px-4 text-white fw-semibold d-flex align-items-center gap-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="spinner-border spinner-border-sm" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        <i className="bi bi-search"></i>
                                    )}
                                    <span className="d-none d-sm-inline">{loading ? 'Searching' : 'Track'}</span>
                                </button>
                            </form>
                            {error && (
                                <div className="text-danger bg-white px-3 py-2 rounded-pill mt-3 d-inline-block shadow-sm small fw-semibold">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="container py-5" style={{ marginTop: '-40px' }}>
                {orderData && (
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                                <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-0 fw-bold">Order #{orderData.order_id}</h5>
                                        <p className="text-secondary small mb-0">Placed on {orderData.order_date.split(' ')[0]}</p>
                                    </div>
                                    <span className={`badge rounded-pill bg-${orderData.status === 'Cancelled' ? 'danger' : 'info'} text-white px-3 py-2`}>
                                        {orderData.status}
                                    </span>
                                </div>
                                <div className="card-body px-4 py-4">
                                    
                                    {/* Timeline Component */}
                                    <StatusTimeline currentStatus={orderData.status} />

                                    <hr className="my-4" />

                                    {/* Order Details */}
                                    <h6 className="fw-bold mb-3 text-secondary text-uppercase small">Order Summary</h6>
                                    <div className="row g-3">
                                        <div className="col-sm-6">
                                            <div className="p-3 bg-light rounded-3">
                                                <div className="text-secondary small mb-1">Customer</div>
                                                <div className="fw-semibold">{orderData.customer || 'Guest Customer'}</div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="p-3 bg-light rounded-3">
                                                <div className="text-secondary small mb-1">Total Amount</div>
                                                <div className="fw-semibold text-info">₱ {orderData.order_amount}</div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="p-3 bg-light rounded-3">
                                                <div className="text-secondary small mb-1">Pickup / Due Date</div>
                                                <div className="fw-semibold">{orderData.pickup_date ? orderData.pickup_date.split(' ')[0] : 'N/A'}</div>
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="p-3 bg-light rounded-3">
                                                <div className="text-secondary small mb-1">Total Items</div>
                                                <div className="fw-semibold">{orderData.order_item_count} Garments</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Optional: Garments List if returned */}
                                    {orderData.items && orderData.items.length > 0 && (
                                        <div className="mt-4">
                                            <h6 className="fw-bold mb-3 text-secondary text-uppercase small">Items Included</h6>
                                            <ul className="list-group list-group-flush rounded-3 border">
                                                {orderData.items.map((item, index) => (
                                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center bg-light border-bottom">
                                                        <div>
                                                            <div className="fw-semibold">{item.name}</div>
                                                            <small className="text-secondary">{item.type}</small>
                                                        </div>
                                                        <span className="badge bg-secondary rounded-pill">{item.quantity}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                </div>
                                <div className="card-footer bg-light border-0 py-3 text-center">
                                    <p className="mb-0 small text-secondary">
                                        <i className="bi bi-info-circle me-1"></i>
                                        Have questions about your order? Contact us for assistance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {!orderData && !loading && !error && (
                    <div className="text-center text-secondary py-5 mt-4">
                        <i className="bi bi-box-seam display-1 opacity-25 mb-3"></i>
                        <h5>Ready to Track?</h5>
                        <p>Enter your Order ID above to see the status.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrderPage;
