import { useState, useCallback } from 'react';
import AsyncSelect from 'react-select/async';

const getCustomersEndpoint = 'http://localhost/bubble-bath-backend/get_all_customers.php';

/**
 * Debounce helper to prevent excessive API calls.
 * Returns a promise that resolves with the function result after the delay.
 */
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

/**
 * CustomerSelect Component
 * A reusable component to search and select customers asynchronously.
 * 
 * @param {Object} props
 * @param {Object} props.value - The currently selected option { value, label, customer }
 * @param {Function} props.onChange - Callback fired when a customer is selected
 * @param {boolean} props.isDisabled - Disables the select input
 */
const CustomerSelect = ({ value, onChange, isDisabled = false }) => {
    const [error, setError] = useState(null);

    // Function to fetch data from the API
    const fetchCustomers = async (inputValue) => {
        // Only trigger search if the user typed at least 2 characters
        if (!inputValue || inputValue.length < 2) {
            return [];
        }

        try {
            setError(null);

            const response = await fetch(getCustomersEndpoint, {
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

            // Map results to the expected format
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

    // Debounce the API call to avoid spamming the endpoint (500ms)
    // useCallback ensures the debounced instance persists across re-renders
    const loadOptions = useCallback(debounce(fetchCustomers, 500), []);

    // Custom rendering for the dropdown options and selected value
    const formatOptionLabel = ({ label, customer }, { context }) => {
        // When displaying the selected value, just show the name
        if (context === 'value') {
            return <div>{label}</div>;
        }

        // When displaying options in the dropdown list, show name + email + phone
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
                cacheOptions // Caches previously searched inputs for performance
                defaultOptions={false} // Prevents a request on initial mount
                placeholder="Search customer by name, email, or phone..."
                formatOptionLabel={formatOptionLabel}
                isClearable // Allows clearing the selection

                // Custom messages based on state and input length
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

                // Basic error styling
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