import DueDatePicker from "./DueDatePicker";
import CustomerSelect from "./CustomerSelect";
import GarmentForm from "./GarmentForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CustomerForm({ customer, setCustomer, dueDate, setDueDate }) {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Order Details</h5>
                <form className="row g-3 align-items-end">
                    <div className="col-12 col-md-6">
                        <label htmlFor="customerName" className="form-label text-dark">
                            Customer
                        </label>
                        <CustomerSelect id="customerName" value={customer} onChange={setCustomer} />
                    </div>
                    <div className="col-12 col-md-6">
                        <DueDatePicker selected={dueDate} onSelect={setDueDate} />
                    </div>
                </form>
            </div>
        </div>
    )
}

function CreateOrderForm() {
    const [customer, setCustomer] = useState(null);
    const [dueDate, setDueDate] = useState(null);
    const [garments, setGarments] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();
    const createOrderEndpoint = 'http://localhost/bubble-bath-backend/add_order.php';

    const handleAddOrder = async (orderData) => {
        try {
            console.log("Order Data: ", orderData);

            const response = await fetch(createOrderEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(orderData)
            });
            const data = await response.json();
            console.log("Data: ", data);
            if (data.success) {
                console.log('Order added successfully!');
                // Clear inputs
                setCustomer(null);
                setDueDate(null);
                setGarments([]);

                setShowSuccess(true);

                setTimeout(() => {
                    setShowSuccess(false);
                }, 3000);
            } else {
                console.error('Backend Error:', data.error);
            }
        } catch (error) {
            console.error('Frontend Error:', error);
        }
    };

    const handleCreateOrder = () => {
        if (!customer) {
            alert("Please select a customer.");
            return;
        }
        if (!dueDate) {
            alert("Please select a due date.");
            return;
        }
        if (garments.length === 0) {
            alert("Please add at least one garment.");
            return;
        }

        const formattedGarments = garments.map(garment => ({
            type: garment.garmentType,
            service: garment.garmentService,
            quantity: garment.garmentQty,
            unit_price: garment.garmentPrice,
        }));

        const orderData = {
            customerId: customer.customer.customer_id,
            dueDate: dueDate.toISOString().split('T')[0],
            garments: formattedGarments,
            totalAmount: garments.reduce((total, garment) => total + garment.garmentSubtotal, 0)
        };

        handleAddOrder(orderData);
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="d-flex flex-column gap-4">
            {showSuccess && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Order created successfully! Redirecting to dashboard...
                    <button type="button" className="btn-close" onClick={() => setShowSuccess(false)} aria-label="Close"></button>
                </div>
            )}
            <CustomerForm
                customer={customer} setCustomer={setCustomer}
                dueDate={dueDate} setDueDate={setDueDate}
            />
            <GarmentForm garments={garments} setGarments={setGarments} />

            <div className="d-flex flex-column flex-sm-row justify-content-end gap-3">
                <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
                    Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleCreateOrder}>
                    Create Order
                </button>
            </div>
        </div>
    );
}

export default CreateOrderForm;