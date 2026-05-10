import { useState } from "react";
import { API_ENDPOINTS } from '../../../common/services/api';

function NewCustomerModal({onHide, onRefresh}) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(API_ENDPOINTS.CUSTOMERS.ADD, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name.trim(), email: email.trim(), mobile: mobile.trim(), address: address.trim() })
        })
            .then(async response => {
                const text = await response.text();
                return text ? JSON.parse(text) : {};
            })
            .then(data => {
                if (data.success) {
                    if (onRefresh) onRefresh();
                } else {
                    console.error('Error adding customer:', data.error);
                }
            })
            .catch(error => {
                console.error('Error adding customer:', error);
            });

        onHide();
    }

    return (
        <div className="modal fade show" style={{display: "block", backgroundColor: "rgba(0,0,0,0.5)"}}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header border-0">
                        <h5 className="modal-title fw-bold">Add New Customer</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="customerName" className="form-label text-black small fw-medium">Name</label>
                                <input type="text" className="form-control" id="customerName" placeholder="Customer Name" value={name} onChange={(e) => setName(e.target.value)} required/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="customerEmail" className="form-label text-black small fw-medium">Email</label>
                                <input type="email" className="form-control" id="customerEmail" placeholder="Customer Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="customerMobile" className="form-label text-black small fw-medium">Mobile No.</label>
                                <input type="text" className="form-control" id="customerMobile" placeholder="Customer Mobile No." value={mobile} onChange={(e) => setMobile(e.target.value)} required/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="customerAddress" className="form-label text-black small fw-medium">Address</label>
                                <input type="text" className="form-control" id="customerAddress" placeholder="Customer Address" value={address} onChange={(e) => setAddress(e.target.value)}/>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer border-0">
                        <button type="button" className="btn btn-light" onClick={onHide}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Add Customer</button>
                    </div>
                </div>
            </div>
        </div>
    )

}

function NewCustomerButton({onRefresh}) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button onClick={() => setShowModal(true)} className="btn btn-primary d-flex align-items-center gap-2">
                <i className="bi bi-person-plus"></i>
                Add Customer
            </button>
            {showModal && <NewCustomerModal onHide={() => setShowModal(false)} onRefresh={onRefresh} />}
        </>
    )
}

export default NewCustomerButton;