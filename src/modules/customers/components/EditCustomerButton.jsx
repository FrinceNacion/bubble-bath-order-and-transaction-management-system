import { useState } from "react";
import { API_ENDPOINTS } from '../../../common/services/api';

function EditCustomerModal({ onHide, customer, onRefresh }) {
    const [name, setName] = useState(customer?.name || '');
    const [email, setEmail] = useState(customer?.email || '');
    const [mobile, setMobile] = useState(customer?.contact_number || customer?.mobile || '');
    const [address, setAddress] = useState(customer?.address || '');

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedName = name.trim() || customer?.name || '';
        const trimmedEmail = email.trim() || customer?.email || '';
        const trimmedMobile = mobile.trim() || customer?.contact_number || customer?.mobile || '';
        const trimmedAddress = address.trim() || customer?.address || '';

        const customer_id = customer.customer_id;

        fetch(API_ENDPOINTS.CUSTOMERS.UPDATE, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customer_id, name: trimmedName, email: trimmedEmail, mobile: trimmedMobile, address: trimmedAddress })
        })
            .then(async response => {
                const text = await response.text();
                return text ? JSON.parse(text) : {};
            })
            .then(data => {
                if (data.success) {
                    onRefresh();
                } else {
                    console.error('Error updating customer:', data.error);
                }
            })
            .catch(error => {
                console.error('Error updating customer:', error);
            });

        onHide();
    }
    return (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header border-0">
                        <h5 className="modal-title fw-bold">Edit Customer</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="customerName" className="form-label text-black small fw-medium">Name</label>
                                <input type="text" className="form-control" id="customerName" placeholder="Customer Name" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="customerEmail" className="form-label text-black small fw-medium">Email</label>
                                <input type="email" className="form-control" id="customerEmail" placeholder="Customer Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="customerMobile" className="form-label text-black small fw-medium">Mobile No.</label>
                                <input type="text" className="form-control" id="customerMobile" placeholder="Customer Mobile No." value={mobile} onChange={(e) => setMobile(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="customerAddress" className="form-label text-black small fw-medium">Address</label>
                                <input type="text" className="form-control" id="customerAddress" placeholder="Customer Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer border-0">
                        <button type="button" className="btn btn-light" onClick={onHide}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Update Customer</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function EditCustomerButton({ customer, onRefresh }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button className="btn btn-sm btn-outline-secondary d-flex align-items-center" onClick={() => setShowModal(true)}>
                <i className="bi bi-pencil-square"></i>
            </button>
            {showModal && <EditCustomerModal customer={customer} onHide={() => setShowModal(false)} onRefresh={onRefresh} />}
        </>
    )
}

export default EditCustomerButton;