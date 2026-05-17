/**
 * ConfirmDialog - A reusable custom confirmation modal.
 * 
 * Usage:
 *   <ConfirmDialog
 *     show={showConfirm}
 *     title="Cancel Order"
 *     message="Are you sure you want to cancel this order? This action cannot be undone."
 *     variant="danger"
 *     confirmLabel="Yes, Cancel"
 *     onConfirm={handleConfirm}
 *     onCancel={() => setShowConfirm(false)}
 *   />
 */
function ConfirmDialog({ show, title, message, variant = 'danger', confirmLabel = 'Confirm', onConfirm, onCancel }) {
    if (!show) return null;

    const variantMap = {
        danger: { icon: 'bi-exclamation-triangle-fill', iconColor: 'text-danger', btnClass: 'btn-danger' },
        warning: { icon: 'bi-exclamation-circle-fill', iconColor: 'text-warning', btnClass: 'btn-warning' },
        info: { icon: 'bi-info-circle-fill', iconColor: 'text-primary', btnClass: 'btn-primary' },
    };
    const v = variantMap[variant] || variantMap.danger;

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content border-0 shadow-lg rounded-4">
                    <div className="modal-body text-center p-4">
                        <i className={`bi ${v.icon} ${v.iconColor} mb-3`} style={{ fontSize: '2.5rem' }} />
                        <h5 className="fw-bold mb-1">{title || 'Are you sure?'}</h5>
                        <p className="text-secondary small mb-4">{message}</p>
                        <div className="d-flex gap-2 justify-content-center">
                            <button className="btn btn-light px-4" onClick={onCancel}>
                                Cancel
                            </button>
                            <button className={`btn ${v.btnClass} px-4`} onClick={onConfirm}>
                                {confirmLabel}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;
