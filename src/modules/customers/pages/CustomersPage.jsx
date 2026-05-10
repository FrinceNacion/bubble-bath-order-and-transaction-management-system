import CustomerCard from "../components/CustomerCard";
import NewCustomerButton from "../components/NewCustomerButton";
import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../../../common/services/api";

function CustomersPage() {
    const [customers, setCustomers] = useState([]);

    const fetchCustomers = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.CUSTOMERS.GET_ALL, { credentials: 'include' });
            const data = await response.json();
            if (data.success) {
                setCustomers(data.customers);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <main className="container flex-fill p-4 p-xl-5">
            <div className="d-flex flex-row justify-content-between mb-4 flex-wrap">
                <div className="d-flex flex-column">
                    <h4 className="fw-semibold text-dark mb-1">Customer Management</h4>
                    <p className="text-secondary small mb-4">Manage Bubble Bath's customers here.</p>
                </div>
                <NewCustomerButton />
            </div>

            <div>
                {customers.length > 0 ? (
                    customers.map((customer, index) => (
                        <CustomerCard key={index} customer={customer} onRefresh={fetchCustomers} />
                    ))
                ) : (
                    <p className="text-muted">No customers found.</p>
                )}
            </div>
        </main>
    );
}

export default CustomersPage;