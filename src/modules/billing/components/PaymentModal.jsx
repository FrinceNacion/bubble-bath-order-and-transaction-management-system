import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../../common/services/api";
import { showToast } from "../../../common/components/Toast";

function PaymentModal({ billing, onHide, onRefresh }) {
    const [amountPaid, setAmountPaid] = useState(billing.remaining_balance || billing.total_amount);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [payments, setPayments] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    const fetchHistory = async () => {
        setLoadingHistory(true);
        try {
            const response = await fetch(API_ENDPOINTS.BILLING.GET_BY_ORDER, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: billing.order_id })
            });
            const data = await response.json();
            if (data.success) {
                setPayments(data.payments || []);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [billing.order_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch(API_ENDPOINTS.BILLING.ADD_PAYMENT, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    billing_id: billing.billing_id,
                    amount_paid: amountPaid,
                    payment_method: paymentMethod,
                    notes: notes
                })
            });
            const data = await response.json();
            if (data.success) {
                showToast("Payment recorded successfully!", "success");
                onRefresh();
                onHide();
            } else {
                showToast(data.error || "Payment failed.", "error");
            }
        } catch (error) {
            console.error("Payment error:", error);
            showToast("An error occurred during payment.", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">Billing & Payment</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row g-4">
                            {/* Invoice Summary */}
                            <div className="col-md-6 border-end">
                                <h6 className="fw-bold mb-3">Invoice Details</h6>
                                <div className="d-flex flex-column gap-2">
                                    <div className="d-flex justify-content-between">
                                        <span className="text-secondary">Order ID:</span>
                                        <span className="fw-medium">#{billing.order_id}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-secondary">Customer:</span>
                                        <span className="fw-medium">{billing.customer_name}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-secondary">Total Amount:</span>
                                        <span className="fw-medium">₱ {parseFloat(billing.total_amount).toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-secondary">Total Paid:</span>
                                        <span className="fw-medium text-success">₱ {parseFloat(billing.total_paid || 0).toFixed(2)}</span>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-bold">Balance:</span>
                                        <span className="fs-5 fw-bold text-danger">₱ {parseFloat(billing.remaining_balance).toFixed(2)}</span>
                                    </div>
                                </div>

                                <h6 className="fw-bold mt-4 mb-3">Payment History</h6>
                                <div className="payment-history" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {loadingHistory ? (
                                        <p className="small text-center text-secondary">Loading history...</p>
                                    ) : payments.length > 0 ? (
                                        <ul className="list-group list-group-flush">
                                            {payments.map((p, i) => (
                                                <li key={i} className="list-group-item px-0 py-2 small d-flex justify-content-between">
                                                    <div>
                                                        <span className="d-block fw-medium">{p.payment_method.toUpperCase()}</span>
                                                        <span className="text-secondary">{p.payment_date.split(' ')[0]}</span>
                                                    </div>
                                                    <span className="fw-bold text-success">₱ {parseFloat(p.amount_paid).toFixed(2)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="small text-center text-secondary py-3">No payments recorded yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* New Payment Form */}
                            <div className="col-md-6">
                                <h6 className="fw-bold mb-3">Record New Payment</h6>
                                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                                    <div>
                                        <label className="form-label small text-secondary">Amount to Pay</label>
                                        <div className="input-group">
                                            <span className="input-group-text">₱</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={amountPaid}
                                                onChange={(e) => setAmountPaid(e.target.value)}
                                                max={billing.remaining_balance}
                                                step="0.01"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="form-label small text-secondary">Payment Method</label>
                                        <select
                                            className="form-select"
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        >
                                            <option value="cash">Cash</option>
                                            <option value="e-wallet">E-Wallet</option>
                                            <option value="card">Card</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label small text-secondary">Notes (Optional)</label>
                                        <textarea
                                            className="form-control"
                                            rows="2"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-dark w-100 py-2 mt-2"
                                        disabled={submitting || amountPaid <= 0}
                                    >
                                        {submitting ? 'Processing...' : 'Confirm Payment'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentModal;
