import CustomerCard from "../components/CustomerCard";
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";

function CustomersPage() {

    const customersData = [
        { name: 'Trijstan Bendoy', email: 'trijstan@example.com', phone: '123-456-7890', address: 'Marilao' },
        { name: 'Tristan De Castro', email: 'tristan@example.com', phone: '098-765-4321', address: 'Bocaue' }
    ];

    return (
        <main className="container flex-fill p-4 p-xl-5">
            <div className="d-flex flex-row justify-content-between mb-4">
                <div className="d-flex flex-column">
                    <h4 className="fw-semibold text-dark mb-1">Customer Management</h4>
                    <p className="text-secondary small mb-4">Manage Bubble Bath's customers here.</p>
                </div>
                <button className="btn btn-outline-primary d-flex align-items-center gap-2 h-25">
                    <i className="bi bi-person-plus"></i>
                    Add Customer
                </button>
            </div>

            <div>
                {customersData.map((customer, index) => (
                    <CustomerCard key={index} customer={customer} />
                ))}
            </div>
        </main>
    );
}

export default CustomersPage;