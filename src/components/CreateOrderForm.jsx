import DueDatePicker from "./DueDatePicker";
import CustomerSelect from "./CustomerSelect";
function CreateOrderForm() {
    return (
        <div className="d-flex flex-column gap-4">
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Order Details</h5>
                    <form className="row g-3 align-items-end">
                        <div className="col-12 col-md-6">
                            <label htmlFor="customerName" className="form-label text-dark">
                                Customer
                            </label>
                            <CustomerSelect id="customerName" />
                        </div>
                        <div className="col-12 col-md-6">
                            <DueDatePicker />
                        </div>
                    </form>
                </div>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="d-flex flex-column flex-md-row align-items-start justify-content-between mb-3 gap-3">
                        <div className="card-title mb-0">Garments</div>
                        <button type="button" className="btn btn-secondary">
                            <i className="bi bi-plus"></i>
                            Add garment
                        </button>
                    </div>

                    <form className="row g-3">
                        <div className="col-12 col-sm-6 col-md-4">
                            <label htmlFor="garmentType" className="form-label text-dark">
                                Type
                            </label>
                            <input id="garmentType" type="text" className="form-control" />
                        </div>
                        <div className="col-12 col-sm-6 col-md-4">
                            <label htmlFor="garmentService" className="form-label text-dark">
                                Service
                            </label>
                            <input id="garmentService" type="text" className="form-control" />
                        </div>
                        <div className="col-6 col-sm-4 col-md-2">
                            <label htmlFor="garmentQty" className="form-label text-dark">
                                Qty
                            </label>
                            <input id="garmentQty" type="number" className="form-control" />
                        </div>
                        <div className="col-6 col-sm-4 col-md-2">
                            <label htmlFor="garmentPrice" className="form-label text-dark">
                                Price
                            </label>
                            <input id="garmentPrice" type="text" className="form-control" />
                        </div>
                        <div className="col-6 col-sm-4 col-md-2">
                            <label htmlFor="garmentSubtotal" className="form-label text-dark">
                                Subtotal
                            </label>
                            <input id="garmentSubtotal" type="text" className="form-control" readOnly />
                        </div>
                        <div className="col-12 col-md-8">
                            <label htmlFor="garmentNotes" className="form-label text-dark">
                                Notes
                            </label>
                            <input id="garmentNotes" type="text" className="form-control" />
                        </div>
                        <div className="col-12 col-md-4 d-flex align-items-end justify-content-end">
                            <button type="button" className="btn btn-danger w-100">
                                Remove garment
                            </button>
                        </div>
                    </form>

                    <div className="border-top pt-3 mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="text-muted">Total Amount</div>
                            <div className="fs-4 fw-bold">$0.00</div>
                        </div>

                        <div className="list-group">
                            <div className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="fw-semibold">Shirt - Wash & Fold</div>
                                    <div className="text-muted small">Qty: 2 • $5.00 each</div>
                                </div>
                                <div className="fw-bold">$10.00</div>
                            </div>
                            <div className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <div className="fw-semibold">Dress - Dry Clean</div>
                                    <div className="text-muted small">Qty: 1 • $12.00 each</div>
                                </div>
                                <div className="fw-bold">$12.00</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex flex-column flex-sm-row justify-content-end gap-3">
                <button type="button" className="btn btn-outline-secondary">
                    Cancel
                </button>
                <button type="button" className="btn btn-primary">
                    Create Order
                </button>
            </div>
        </div>
    );
}

export default CreateOrderForm;