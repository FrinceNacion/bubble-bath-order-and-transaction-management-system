import react from "react";
function GarmentForm({ garments, setGarments }) {
    const [garmentType, setGarmentType] = react.useState("");
    const [garmentService, setGarmentService] = react.useState("");
    const [garmentQty, setGarmentQty] = react.useState("");
    const [garmentPrice, setGarmentPrice] = react.useState("");
    const [garmentSubtotal, setGarmentSubtotal] = react.useState("");
    const [garmentNotes, setGarmentNotes] = react.useState("");

    const handleRemoveGarment = (id) => {
        setGarments(garments.filter(garment => garment.id !== id));
    };

    const handleGarmentPrice = (e) => {
        if (e.target.value.length > 1 && e.target.value[0] === "0") {
            e.target.value = e.target.value.slice(1);
        }
        e.target.value = e.target.value.replace(/[^0-9]/g, "");

        setGarmentPrice(e.target.value);
    };
    const handleSubTotal = (e) => {
        const subtotal = garmentQty * e;
        setGarmentSubtotal(subtotal);
        console.log(subtotal);
    };

    function handleSubmit(e) {
        e.preventDefault();
        const garment = {
            id: Date.now(),
            garmentType,
            garmentService,
            garmentQty,
            garmentPrice,
            garmentSubtotal,
            garmentNotes
        };

        if (garmentType === "" || garmentService === "" || garmentQty === "" || garmentPrice === "") {
            alert("Please fill in all the fields");
            return;
        }

        setGarments([...garments, garment]);

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
                        <input id="garmentQty" type="number" className="form-control" min="1" value={garmentQty} onChange={(e) => setGarmentQty(e.target.value)} />
                    </div>
                    <div className="col-6 col-sm-4 col-md-2">
                        <label htmlFor="garmentPrice" className="form-label text-dark">
                            Price
                        </label>
                        <input id="garmentPrice" type="text" className="form-control" value={garmentPrice} onChange={(e) => { handleGarmentPrice(e); handleSubTotal(e.target.value) }} />
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
