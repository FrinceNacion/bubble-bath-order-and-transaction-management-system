import DueDatePicker from "./DueDatePicker";
import CustomerSelect from "./CustomerSelect";
function CreateOrderForm() {
    return (
        <>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Order Details</h5>
                    <form className="d-flex flex-row justify-content-evenly">
                        <div className="mb-3">
                            <label htmlFor="customerName" className="form-label text-black">Customer</label>
                            <CustomerSelect />
                        </div>
                        <DueDatePicker />
                    </form>
                </div>
            </div>
        </>
    )
}

export default CreateOrderForm;