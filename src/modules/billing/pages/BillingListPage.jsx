import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../../common/services/api";
import PaymentModal from "../components/PaymentModal";
import { generateInvoice } from "../utils/invoiceGenerator";

function StatusBadge({ status }) {
    const configs = {
        unpaid: { bg: 'bg-danger-subtle', text: 'text-danger', label: 'Unpaid' },
        partially_paid: { bg: 'bg-warning-subtle', text: 'text-warning-emphasis', label: 'Partially Paid' },
        paid: { bg: 'bg-success-subtle', text: 'text-success', label: 'Paid' },
        void: { bg: 'bg-secondary-subtle', text: 'text-secondary', label: 'Void' }
    };
    const config = configs[status] || configs.unpaid;
    return (
        <span className={`badge ${config.bg} ${config.text} px-3 py-2 rounded-pill`}>
            {config.label}
        </span>
    );
}

function BillingListPage() {
    const [billings, setBillings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBilling, setSelectedBilling] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isPrinting, setIsPrinting] = useState(null);

    const fetchBillings = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.BILLING.GET_ALL, {
                method: 'POST',
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setBillings(data.data || []);
            }
        } catch (error) {
            console.error("Error fetching billings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBillings();
    }, []);

    const handlePrintInvoice = async (billing) => {
        setIsPrinting(billing.billing_id);
        try {
            const response = await fetch(API_ENDPOINTS.GARMENTS.GET_BY_ORDER, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id: billing.order_id })
            });
            const data = await response.json();
            if (data.success) {
                generateInvoice(billing, data.data || []);
            } else {
                console.error("Failed to fetch garments for invoice:", data.error);
                alert("Failed to generate invoice. Please try again.");
            }
        } catch (error) {
            console.error("Error generating invoice:", error);
            alert("Error generating invoice.");
        } finally {
            setIsPrinting(null);
        }
    };

    const filteredBillings = billings.filter(b => 
        b.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.order_id.toString().includes(searchTerm)
    );

    return (
        <main className="container flex-fill p-4 p-xl-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-semibold text-dark mb-1">Billing & Transactions</h4>
                    <p className="text-secondary small mb-0">Manage customer invoices and track payments</p>
                </div>
                <div className="d-flex gap-2">
                    <div className="input-group input-group-sm" style={{ width: '250px' }}>
                        <span className="input-group-text bg-white border-end-0">
                            <i className="bi bi-search text-secondary"></i>
                        </span>
                        <input 
                            type="text" 
                            className="form-control border-start-0" 
                            placeholder="Search customer or Order ID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-sm btn-outline-dark" onClick={fetchBillings}>
                        <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                    </button>
                </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 text-secondary fw-medium small">Order ID</th>
                                <th className="py-3 text-secondary fw-medium small">Customer</th>
                                <th className="py-3 text-secondary fw-medium small">Bill Date</th>
                                <th className="py-3 text-secondary fw-medium small text-end">Total Amount</th>
                                <th className="py-3 text-secondary fw-medium small text-end">Balance</th>
                                <th className="py-3 text-secondary fw-medium small text-center">Status</th>
                                <th className="px-4 py-3 text-secondary fw-medium small text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-secondary">
                                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                        Loading billing records...
                                    </td>
                                </tr>
                            ) : filteredBillings.length > 0 ? (
                                filteredBillings.map((b) => (
                                    <tr key={b.billing_id}>
                                        <td className="px-4 fw-medium text-dark">#{b.order_id}</td>
                                        <td>{b.customer_name}</td>
                                        <td className="small text-secondary">{b.created_at.split(' ')[0]}</td>
                                        <td className="text-end fw-medium">₱ {parseFloat(b.total_amount).toFixed(2)}</td>
                                        <td className="text-end text-danger fw-semibold">₱ {parseFloat(b.remaining_balance).toFixed(2)}</td>
                                        <td className="text-center">
                                            <StatusBadge status={b.status} />
                                        </td>
                                        <td className="px-4 text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button 
                                                    className="btn btn-sm btn-outline-primary px-3 rounded-pill"
                                                    onClick={() => handlePrintInvoice(b)}
                                                    disabled={isPrinting === b.billing_id}
                                                    title="Print Invoice"
                                                >
                                                    {isPrinting === b.billing_id ? (
                                                        <div className="spinner-border spinner-border-sm" role="status"></div>
                                                    ) : (
                                                        <i className="bi bi-printer"></i>
                                                    )}
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-dark px-3 rounded-pill"
                                                    onClick={() => setSelectedBilling(b)}
                                                >
                                                    <i className="bi bi-wallet2 me-2"></i>
                                                    {b.status === 'paid' ? 'View' : 'Pay'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-secondary">
                                        <i className="bi bi-file-earmark-bar-graph fs-2 d-block mb-2"></i>
                                        No billing records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedBilling && (
                <PaymentModal 
                    billing={selectedBilling} 
                    onHide={() => setSelectedBilling(null)} 
                    onRefresh={fetchBillings}
                />
            )}
        </main>
    );
}

export default BillingListPage;
