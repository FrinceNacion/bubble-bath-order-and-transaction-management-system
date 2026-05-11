const BASE_URL = 'http://localhost/bubble-bath-backend/api';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${BASE_URL}/auth/login.php`,
        REGISTER: `${BASE_URL}/auth/register.php`,
        LOGOUT: `${BASE_URL}/auth/logout.php`,
        GET_USER: `${BASE_URL}/auth/get_user.php`,
    },
    CUSTOMERS: {
        GET_ALL: `${BASE_URL}/customers/get_all_customers.php`,
        ADD: `${BASE_URL}/customers/add_customer.php`,
        UPDATE: `${BASE_URL}/customers/update_customer.php`,
    },
    ORDERS: {
        GET_ALL: `${BASE_URL}/orders/get_all_orders.php`,
        GET_LATEST: `${BASE_URL}/orders/get_latest_orders.php`,
        GET_BY_STATUS: `${BASE_URL}/orders/get_orders_by_status.php`,
        GET_BY_CUSTOMER: `${BASE_URL}/orders/get_orders_by_customer.php`,
        ADD: `${BASE_URL}/orders/add_order.php`,
        UPDATE_STATUS: `${BASE_URL}/orders/update_order_status.php`,
    },
    GARMENTS: {
        GET_BY_ORDER: `${BASE_URL}/garments/get_garments_by_order.php`,
    }
};

export default API_ENDPOINTS;
