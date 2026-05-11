import { useState, useCallback } from 'react';
import AsyncSelect from 'react-select/async';
import { API_ENDPOINTS } from '../../../common/services/api';

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        return new Promise((resolve) => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                resolve(await func(...args));
            }, delay);
        });
    };
};

const CustomerSelect = ({ value, onChange, isDisabled = false }) => {
    const [error, setError] = useState(null);

    const fetchCustomers = async (inputValue) => {
        if (!inputValue || inputValue.length < 2) {
            return [];
        }

        try {
            setError(null);
            const response = await fetch(API_ENDPOINTS.CUSTOMERS.GET_ALL, {
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error('Failed to fetch customers');
            }

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch customers');
            }

            const customers = data.customers || [];
            const filteredData = customers.filter(customer =>
                (customer.name && customer.name.toLowerCase().includes(inputValue.toLowerCase())) ||
                (customer.email && customer.email.toLowerCase().includes(inputValue.toLowerCase())) ||
                (customer.contact_number && customer.contact_number.includes(inputValue))
            );

            return filteredData.map(customer => ({
                value: customer.customer_id,
                label: customer.name,
                customer: customer
            }));

        } catch (err) {
            console.error("Customer API Error:", err);
            setError("Failed to load customers. Please try again.");
            return [];
        }
    };

    const loadOptions = useCallback(debounce(fetchCustomers, 500), []);

    const formatOptionLabel = ({ label, customer }, { context }) => {
        if (context === 'value') {
            return <div>{label}</div>;
        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: '500' }}>{label}</div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', display: 'flex', gap: '12px', marginTop: '4px' }}>
                    {customer?.email && <span> <i className="bi bi-envelope me-1"></i> {customer.email}</span>}
                    {customer?.contact_number && <span> <i className="bi bi-phone me-1"></i> {customer.contact_number}</span>}
                </div>
            </div>
        );
    };

    return (
        <div className="customer-select-container" style={{ minWidth: '300px' }}>
            <AsyncSelect
                value={value}
                onChange={onChange}
                isDisabled={isDisabled}
                loadOptions={loadOptions}
                cacheOptions
                defaultOptions={false}
                placeholder="Search customer by name, email, or phone..."
                formatOptionLabel={formatOptionLabel}
                isClearable
                noOptionsMessage={({ inputValue }) => {
                    if (!inputValue || inputValue.length < 2) {
                        return "Type at least 2 characters";
                    }
                    if (error) {
                        return "Error loading data";
                    }
                    return "No customers found";
                }}
                loadingMessage={() => "Searching..."}
                styles={{
                    control: (baseStyles) => ({
                        ...baseStyles,
                        borderColor: error ? '#ef4444' : baseStyles.borderColor,
                        '&:hover': {
                            borderColor: error ? '#ef4444' : baseStyles['&:hover']?.borderColor,
                        }
                    })
                }}
            />
            {error && (
                <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px' }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default CustomerSelect;