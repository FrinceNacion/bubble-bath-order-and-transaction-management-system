import CustomerCard from "../components/CustomerCard";
import NewCustomerButton from "../components/NewCustomerButton";
import { useState, useEffect } from "react";

function CustomersPage() {
    const getCustomersEndpoint = 'http://localhost/bubble-bath-backend/get_all_customer.php';

    const [customers, setCustomers] = useState([]);

    const processFetchedCustomers = (data) => {
        if (data.success) {
            console.log('Fetched customers:', data.customers, data.count);
            if (data.count > 0) {setCustomers(data.customers);} 
        } else {
            console.error('Error fetching customers:', data.error);
        }
    }

    const fetchCustomers = async () => {
        try {
            const response = await fetch(getCustomersEndpoint, { credentials: 'include' });
            const text = await response.text();
            const data = text ? JSON.parse(text) : {};
            processFetchedCustomers(data);
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