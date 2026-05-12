import react from "react";
import { showToast } from "../../../common/components/Toast";

function GarmentForm({ garments, setGarments }) {
    const [garmentType, setGarmentType] = react.useState("");
    const [garmentService, setGarmentService] = react.useState("");
    const [garmentQty, setGarmentQty] = react.useState("");
    const [garmentPrice, setGarmentPrice] = react.useState("");
    const [garmentSubtotal, setGarmentSubtotal] = react.useState("");
    const [garmentNotes, setGarmentNotes] = react.useState("");

    const handleRemoveGarment = (id) => {
        setGarments(garments.filter(garment => garment.id !== id));
        showToast("Garment removed.", "info");
    };

    const handleGarmentPrice = (e) => {
        let val = e.target.value;
        // Allow only numbers and a single decimal point
        val = val.replace(/[^0-9.]/g, '');
        if ((val.match(/\./g) || []).length > 1) {
            val = val.substring(0, val.lastIndexOf("."));
        }
        setGarmentPrice(val);
        calculateSubtotal(garmentQty, val);
    };

    const handleGarmentQty = (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        setGarmentQty(val);
        calculateSubtotal(val, garmentPrice);
    };

    const calculateSubtotal = (qty, price) => {
        const q = parseInt(qty) || 0;
        const p = parseFloat(price) || 0;
        setGarmentSubtotal(q * p);
    };

    function handleSubmit(e) {
        e.preventDefault();

        if (!garmentType || !garmentService || !garmentQty || !garmentPrice) {
            showToast("Please fill in all required garment fields.", "warning");
            return;
        }

        if (parseInt(garmentQty) <= 0) {
            showToast("Quantity must be at least 1.", "warning");
            return;
        }

        if (parseFloat(garmentPrice) <= 0) {
            showToast("Price must be greater than 0.", "warning");
            return;
        }

        const garment = {
            id: Date.now(),
            garmentType: garmentType.trim(),
            garmentService: garmentService.trim(),
            garmentQty: parseInt(garmentQty),
            garmentPrice: parseFloat(garmentPrice),
            garmentSubtotal: parseFloat(garmentSubtotal),
            garmentNotes: garmentNotes.trim()
        };

        setGarments([...garments, garment]);
        showToast(`Added ${garmentType} to list.`, "success");

        setGarmentType("");
        setGarmentService("");
        setGarmentQty("");
        setGarmentPrice("");
        setGarmentSubtotal("");
        setGarmentNotes("");
    }

    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex flex-column flex-md-row align-items-start justify-content-between mb-3 gap-3">
                    <div className="card-title mb-0">Garments</div>
                    <button type="button" className="btn btn-secondary" onClick={handleSubmit}>
                        <i className="bi bi-plus"></i>
                        Add garment
                    </button>
                </div>

                <form className="row g-3">
                    <div className="col-12 col-sm-6 col-md-4">
                        <label htmlFor="garmentType" className="form-label text-dark">
                            Type
                        </label>
                        <input id="garmentType" type="text" className="form-control" value={garmentType} onChange={(e) => setGarmentType(e.target.value)} />
                    </div>
                    <div className="col-12 col-sm-6 col-md-4">
                        <label htmlFor="garmentService" className="form-label text-dark">
                            Service
                        </label>
                        <input id="garmentService" type="text" className="form-control" value={garmentService} onChange={(e) => setGarmentService(e.target.value)} />
                    </div>
                    <div className="col-6 col-sm-4 col-md-2">
                        <label htmlFor="garmentQty" className="form-label text-dark">
                            Qty
                        </label>
                        <input id="garmentQty" type="text" className="form-control" value={garmentQty} onChange={handleGarmentQty} placeholder="0" />
                    </div>
                    <div className="col-6 col-sm-4 col-md-2">
                        <label htmlFor="garmentPrice" className="form-label text-dark">
                            Price
                        </label>
                        <input id="garmentPrice" type="text" className="form-control" value={garmentPrice} onChange={handleGarmentPrice} placeholder="0.00" />
                    </div>
                    <div className="col-6 col-sm-4 col-md-2">
                        <label htmlFor="garmentSubtotal" className="form-label text-dark">
                            Subtotal
                        </label>
                        <input id="garmentSubtotal" type="text" className="form-control" readOnly value={garmentSubtotal} />
                    </div>
                    <div className="col-12 col-md-8">
                        <label htmlFor="garmentNotes" className="form-label text-dark">
                            Notes
                        </label>
                        <input id="garmentNotes" type="text" className="form-control" value={garmentNotes} onChange={(e) => setGarmentNotes(e.target.value)} />
                    </div>
                </form>
                <div className="border-top pt-3 mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="text-muted">Total Amount</div>
                        <div className="fs-4 fw-bold">₱ {garments.reduce((total, garment) => total + garment.garmentSubtotal, 0)}</div>
                    </div>

                    <div className="list-group">
                        {garments.map((garment) => (
                            <div key={garment.id} className="list-group-item">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <div className="fw-semibold">{garment.garmentType}</div>
                                        <div className="text-muted small">Qty: {garment.garmentQty} • ₱ {garment.garmentPrice} each</div>
                                        <div className="text-muted small">Notes: {garment.garmentNotes ? garment.garmentNotes : "none"}</div>
                                    </div>
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="fw-bold text-muted">₱ {garment.garmentSubtotal}</div>
                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveGarment(garment.id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GarmentForm;
