
function CustomerCard({ customer }) {
    return (
        <div className="card mb-3 border-0 shadow-sm rounded-3">
            <div className="d-flex flex-row justify-content-between p-3 flex-wrap">
                <div className="d-flex flex-column">
                    <h5 className="fw-semibold">{customer.name}</h5>
                    <div className="d-flex flex-column">
                        <p className="text-muted m-1"><i class="bi bi-envelope-at me-2"></i> {customer.email}</p>
                        <p className="text-muted m-1"><i class="bi bi-phone me-2"></i> {customer.phone}</p>
                        <p className="text-muted m-1"><i class="bi bi-geo-alt me-2"></i> {customer.address}</p>
                    </div>
                </div>
                <div className="d-flex align-items-start gap-2">
                    <button className="btn btn-outline-secondary d-flex align-items-center">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button className="btn btn-danger d-flex align-items-center">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    )    
}

export default CustomerCard;