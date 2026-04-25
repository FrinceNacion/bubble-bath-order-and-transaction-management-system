
function CreateOrderForm() {


    return (
        <>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Order Details</h5>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="customerName" className="form-label text-black">Customer</label>
                            <select name="customer" id="customerName" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required>
                                <option value="">Select Customer</option>
                                <option value="John Doe">John Doe</option>
                                <option value="Jane Smith">Jane Smith</option>
                            </select>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}