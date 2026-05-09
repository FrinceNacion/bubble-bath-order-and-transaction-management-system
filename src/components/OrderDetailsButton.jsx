import { useState, useEffect } from "react";

function OrderDetailsModal({ order, onHide, onRefresh }) {
    const garmentsEndpoint = 'http://localhost/bubble-bath-backend/get_garments_by_order.php';
    const updateStatusEndpoint = 'http://localhost/bubble-bath-backend/update_order_status.php';

    const [garments, setGarments] = useState([]);
    const [loadingGarments, setLoadingGarments] = useState(true);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(order.status || 'Pending');

    const statuses = ['Pending', 'In Progress', 'Ready', 'Claimed', 'Cancelled'];

    const fetchGarments = async () => {
        setLoadingGarments(true);
        try {
            const response = await fetch(garmentsEndpoint, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ order_id: order.order_id })
            });
            const data = await response.json();
            if (data.success) {
                setGarments(data.data || []);
            } else {
                console.error("Error fetching garments:", data.error);
            }
        } catch (error) {
            console.error("Fetch garments failed:", error);
        } finally {
            setLoadingGarments(false);
        }
    };

    useEffect(() => {
        fetchGarments();
    }, [order.order_id]);

    const handleUpdateStatus = async (newStatus) => {
        if (newStatus === currentStatus) return;
        setStatusUpdating(true);
        try {
            const response = await fetch(updateStatusEndpoint, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: order.order_id, status: newStatus })
            });
            const data = await response.json();
            if (data.success) {
                setCurrentStatus(newStatus);
                if (onRefresh) onRefresh();
            } else {
                alert("Failed to update status: " + data.error);
            }
        } catch (error) {
            console.error("Update status failed:", error);
            alert("Error updating status. Please try again.");
        } finally {
            setStatusUpdating(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return 'bi-clock';
            case 'In Progress': return 'bi-arrow-repeat';
            case 'Ready': return 'bi-check2-circle';
            case 'Claimed': return 'bi-bag-check';
            case 'Cancelled': return 'bi-x-circle';
            default: return 'bi-circle';
        }
    };

    const getStatusColorClass = (status) => {
        switch (status) {
            case 'Pending': return 'text-warning';
            case 'In Progress': return 'text-primary';
            case 'Ready': return 'text-success';
            case 'Claimed': return 'text-info';
            case 'Cancelled': return 'text-danger';
            default: return 'text-secondary';
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Pending': return 'bg-warning text-dark';
            case 'In Progress': return 'bg-primary text-white';
            case 'Ready': return 'bg-success text-white';
            case 'Claimed': return 'bg-info text-dark';
            case 'Cancelled': return 'bg-danger text-white';
            default: return 'bg-secondary text-white';
        }
    };

    return (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header pb-3 border-bottom">
                        <h5 className="modal-title fw-bold" id="newCustomerModalLabel">
                            Order Details
                        </h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>

                    <div className="modal-body d-flex flex-column gap-4">
                        {/* Order Meta Info */}
                        <div className="row g-3">
                            <div className="col-md-3 col-6 d-flex flex-column">
                                <p className="m-0 text-secondary small fw-medium">Customer</p>
                                <p className="text-dark fw-semibold m-0">{order.customer}</p>
                            </div>
                            <div className="col-md-3 col-6 d-flex flex-column">
                                <p className="m-0 text-secondary small fw-medium">Order ID</p>
                                <p className="text-dark fw-semibold m-0">#{order.order_id}</p>
                            </div>
                            <div className="col-md-3 col-6 d-flex flex-column">
                                <p className="m-0 text-secondary small fw-medium">Order Date</p>
                                <p className="text-dark fw-semibold m-0">{order.order_date.split(" ")[0]}</p>
                            </div>
                            <div className="col-md-3 col-6 d-flex flex-column">
                                <p className="m-0 text-secondary small fw-medium">Due Date</p>
                                <p className="text-dark fw-semibold m-0">{order.pickup_date.split(" ")[0]}</p>
                            </div>
                        </div>

                        {/* Status Update */}
                        <div className="d-flex flex-column p-3 bg-light rounded">
                            <p className="m-0 text-secondary small fw-medium mb-2">Update Status</p>
                            <div className="d-flex flex-row justify-content-between flex-wrap gap-2">
                                {statuses.map((status) => (
                                    <button
                                        key={status}
                                        className={`btn btn-sm d-flex flex-row align-items-center gap-2 ${currentStatus === status
                                            ? 'btn-dark shadow-sm'
                                            : 'btn-outline-secondary bg-white'
                                            }`}
                                        onClick={() => handleUpdateStatus(status)}
                                        disabled={statusUpdating}
                                    >
                                        {statusUpdating && currentStatus === status ? (
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        ) : (
                                            <i className={`bi ${getStatusIcon(status)} ${currentStatus === status ? 'text-white' : getStatusColorClass(status)}`}></i>
                                        )}
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Garments Table */}
                        <div className="d-flex flex-column">
                            <p className="m-0 text-secondary small fw-medium mb-2">Garments</p>
                            <div className="table-responsive rounded border">
                                <table className="table table-hover m-0 align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col" className="text-secondary fw-medium">Type</th>
                                            <th scope="col" className="text-secondary fw-medium">Service</th>
                                            <th scope="col" className="text-secondary fw-medium text-center">Qty</th>
                                            <th scope="col" className="text-secondary fw-medium text-end">Price</th>
                                            <th scope="col" className="text-secondary fw-medium text-end">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loadingGarments ? (
                                            <tr>
                                                <td colSpan="5" className="text-center py-4 text-secondary">
                                                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                    Loading garments...
                                                </td>
                                            </tr>
                                        ) : garments.length > 0 ? (
                                            garments.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="fw-medium text-dark">{item.type}</td>
                                                    <td className="text-muted small">{item.service || '-'}</td>
                                                    <td className="text-center">{item.quantity}</td>
                                                    <td className="text-end text-muted small">₱ {parseFloat(item.unit_price).toFixed(2)}</td>
                                                    <td className="text-end fw-medium">₱ {(parseFloat(item.unit_price) * item.quantity).toFixed(2)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center py-4 text-secondary">
                                                    <i className="bi bi-inbox fs-4 d-block mb-2"></i>
                                                    No garments found for this order.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="modal-footer bg-light border-top d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex flex-column">
                            <span className="text-secondary small fw-medium">Current Status</span>
                            <span className={`badge ${getStatusBadgeClass(currentStatus)} px-3 py-2 mt-1 rounded-pill`}>
                                <i className={`bi ${getStatusIcon(currentStatus)} me-2`}></i>
                                {currentStatus}
                            </span>
                        </div>
                        <div className="d-flex flex-column text-end">
                            <span className="text-secondary small fw-medium">Grand Total</span>
                            <span className="fs-5 fw-bold text-dark">₱ {order.order_amount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function OrderDetailsButton({ order, onRefresh }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button className="btn btn-outline-dark d-flex flex-row gap-2 align-items-center" onClick={() => setShowModal(true)}>
                <i className="bi bi-eye" />
                See Details
            </button>
            {showModal && <OrderDetailsModal order={order} onHide={() => setShowModal(false)} onRefresh={onRefresh} />}
        </>
    )
}

export default OrderDetailsButton;