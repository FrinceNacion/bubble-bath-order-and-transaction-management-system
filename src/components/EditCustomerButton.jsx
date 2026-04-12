import { useState } from "react";

function EditCustomerModal({onHide, customer, onRefresh}){
    const updateCustomerEndpoint = 'http://localhost/bubble-bath-backend/update_customer.php';

    const [name, setName] = useState(customer?.name || '');
    const [email, setEmail] = useState(customer?.email || '');
    const [mobile, setMobile] = useState(customer?.mobile || '');
    const [address, setAddress] = useState(customer?.address || '');
    
    const handleSubmit = (e) => {
        e.preventDefault();

        let trimmedName = name.trim();
        let trimmedEmail = email.trim();
        let trimmedMobile = mobile.trim();
        let trimmedAddress = address.trim();

        if (trimmedName === '') trimmedName = customer?.name || '';
        if (trimmedEmail === '') trimmedEmail = customer?.email || '';
        if (trimmedMobile === '') trimmedMobile = customer?.mobile || '';
        if (trimmedAddress === '') trimmedAddress = customer?.address || '';

        const customer_id = customer.customer_id;   

        const requestOptions = {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customer_id, name: trimmedName, email: trimmedEmail, mobile: trimmedMobile, address: trimmedAddress })
        };

        fetch(updateCustomerEndpoint, requestOptions)
            .then(async response => {
                const text = await response.text();
                return text ? JSON.parse(text) : {};
            })
            .then(data => {
                if (data.success) {
                    console.log('Customer updated successfully:', data);
                    onRefresh(); // Refresh the customer list
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
        <div className="modal fade show" style={{display: "block"}}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header pb-0 border-0">
                        <h5 className="modal-title" id="newCustomerModalLabel">Edit Customer</h5>
                        <button type="button" className="btn-close" onClick={onHide}></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="customerName" className="form-label text-black">Name</label>
                                <input type="text" className="form-control" id="customerName" placeholder="Customer Name" value={name} onChange={(e) => setName(e.target.value)} required/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="customerEmail" className="form-label text-black">Email</label>
                                <input type="email" className="form-control" id="customerEmail" placeholder="Customer Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="customerMobile" className="form-label text-black">Mobile No.</label>
                                <input type="number" className="form-control" id="customerMobile" placeholder="Customer Mobile No." value={mobile} onChange={(e) => setMobile(e.target.value)} required/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="customerAddress" className="form-label text-black">Address</label>
                                <input type="text" className="form-control" id="customerAddress" placeholder="Customer Address" value={address} onChange={(e) => setAddress(e.target.value)}/>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={onHide}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Update Customer</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function EditCustomerButton({customer, onRefresh}){
    const [showModal, setShowModal] = useState(false);


    return (
        <>
            <button className="btn btn-outline-secondary d-flex align-items-center" onClick={() => setShowModal(true)}>
                <i className="bi bi-pencil-square"></i>
            </button>

            {showModal && <EditCustomerModal customer={customer} onHide={() => setShowModal(false)} onRefresh={onRefresh} />}
        </>
    )
}

export default EditCustomerButton;