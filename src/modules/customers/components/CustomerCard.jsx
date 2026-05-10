import EditCustomerButton from "./EditCustomerButton";
import { useState, useEffect } from "react";

function CustomerCard({ customer, onRefresh }) {
    const [userDetails, setUserDetails] = useState({});
    
    useEffect(() => {
        setUserDetails(customer);
    }, [customer]);

    return (
        <div className="card mb-3 border-0 shadow-sm rounded-3">
            <div className="d-flex flex-row justify-content-between p-3 flex-wrap">
                <div className="d-flex flex-column">
                    <h5 className="fw-semibold">{userDetails.name}</h5>
                    <div className="d-flex flex-column">
                        <p className="text-muted m-1"><i className="bi bi-envelope-at me-2"></i> {userDetails.email}</p>
                        <p className="text-muted m-1"><i className="bi bi-phone me-2"></i> {userDetails.contact_number}</p>
                        <p className="text-muted m-1"><i className="bi bi-geo-alt me-2"></i> {userDetails.address}</p>
                    </div>
                </div>
                <div className="d-flex align-items-start gap-2">
                    <EditCustomerButton customer={customer} onRefresh={onRefresh}/>
                    {/*<button className="btn btn-danger d-flex align-items-center">
                        <i className="bi bi-trash"></i>
                    </button>}*/}
                </div>
            </div>
        </div>
    )    
}

export default CustomerCard;