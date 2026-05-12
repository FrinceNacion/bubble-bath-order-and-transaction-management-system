import { useState, useEffect } from "react";
import StatusBadge from "../../../common/components/StatusBadge";
import { API_ENDPOINTS } from "../../../common/services/api";
import { showToast } from "../../../common/components/Toast";

function OrderDetailsModal({ order, onHide, onRefresh }) {
    const [garments, setGarments] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [loadingGarments, setLoadingGarments] = useState(true);
    const [loadingLogs, setLoadingLogs] = useState(true);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(order.status || 'Pending');

    const statuses = ['Pending', 'In Progress', 'Ready', 'Claimed', 'Cancelled'];

    const fetchGarments = async () => {
        setLoadingGarments(true);
        try {
            const response = await fetch(API_ENDPOINTS.GARMENTS.GET_BY_ORDER, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: order.order_id })
            });
            const data = await response.json();
            if (data.success) {
                setGarments(data.data || []);
            }
        } catch (error) {
            console.error("Fetch garments failed:", error);
        } finally {
            setLoadingGarments(false);
        }
    };

    const fetchAuditLogs = async () => {
        setLoadingLogs(true);
        try {
            const response = await fetch(API_ENDPOINTS.ORDERS.GET_AUDIT_LOG, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: order.order_id })
            });
            const data = await response.json();
            if (data.success) {
                setAuditLogs(data.logs || []);
            }
        } catch (error) {
            console.error("Fetch audit logs failed:", error);
        } finally {
            setLoadingLogs(false);
        }
    };

    useEffect(() => {
        fetchGarments();
        fetchAuditLogs();
    }, [order.order_id]);

    const handleUpdateStatus = async (newStatus) => {
        if (newStatus === currentStatus) return;
        setStatusUpdating(true);
        try {
            const response = await fetch(API_ENDPOINTS.ORDERS.UPDATE_STATUS, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: order.order_id, status: newStatus })
            });
            const data = await response.json();
            if (data.success) {
                showToast(`Status updated to ${newStatus}`, "success");
                setCurrentStatus(newStatus);
                fetchAuditLogs();
                if (onRefresh) onRefresh();
            } else {
                showToast(data.error || "Failed to update status", "error");
            }
        } catch (error) {
            console.error("Update status failed:", error);
            showToast("An error occurred while updating status.", "error");
        } finally {
            setStatusUpdating(false);
        }
    };


    return (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header pb-3 border-bottom">
                        <h5 className="modal-title fw-bold">
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
                                            <StatusBadge status={status} size="sm" showIcon={true} className="border-0 p-0 bg-transparent" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Garments Table */}
                        <div className="d-flex flex-column">
                            <p className="m-0 text-secondary small fw-medium mb-2">Garments</p>
                            <div className="table-responsive rounded border mb-4">
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

                        {/* Order History (Audit Logs) */}
                        <div className="d-flex flex-column">
                            <p className="m-0 text-secondary small fw-medium mb-2">Order History</p>
                            <div className="border rounded p-3 bg-white" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {loadingLogs ? (
                                    <div className="text-center py-3 text-secondary">
                                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                        <span>Loading history...</span>
                                    </div>
                                ) : auditLogs.length > 0 ? (
                                    <div className="timeline-small">
                                        {auditLogs.map((log, index) => (
                                            <div key={index} className="d-flex gap-3 mb-3 pb-2 border-bottom border-light">
                                                <div className="text-center" style={{ width: '40px' }}>
                                                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                                        <i className="bi bi-clock-history text-secondary" style={{ fontSize: '12px' }}></i>
                                                    </div>
                                                </div>
                                                <div className="flex-fill">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <span className="small fw-bold text-dark">
                                                            {log.old_status ? (
                                                                <>Changed from <span className="text-muted text-decoration-line-through">{log.old_status.replace('_', ' ')}</span> to <span className="text-primary">{log.new_status.replace('_', ' ')}</span></>
                                                            ) : (
                                                                <>Initial status set to <span className="text-primary">{log.new_status.replace('_', ' ')}</span></>
                                                            )}
                                                        </span>
                                                        <span className="text-muted" style={{ fontSize: '10px' }}>{new Date(log.changed_at).toLocaleString()}</span>
                                                    </div>
                                                    <div className="small text-muted" style={{ fontSize: '11px' }}>
                                                        By: <span className="fw-medium text-dark">{log.changed_by || 'System'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-3 text-muted small">
                                        No status changes recorded yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="modal-footer bg-light border-top d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex flex-column">
                            <span className="text-secondary small fw-medium">Current Status</span>
                            <StatusBadge status={currentStatus} size="lg" className="mt-1" />
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
            <button className="btn btn-sm btn-outline-dark d-flex flex-row gap-2 align-items-center" onClick={() => setShowModal(true)}>
                <i className="bi bi-eye" />
                Details
            </button>
            {showModal && <OrderDetailsModal order={order} onHide={() => setShowModal(false)} onRefresh={onRefresh} />}
        </>
    )
}

export default OrderDetailsButton;