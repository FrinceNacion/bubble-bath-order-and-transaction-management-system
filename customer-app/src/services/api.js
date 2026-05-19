import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/bubble-bath-backend/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const trackOrder = async (orderId) => {
    try {
        const response = await api.post('/orders/track_order.php', { order_id: orderId });
        return response.data;
    } catch (error) {
        console.error("API Error tracking order:", error);
        throw error;
    }
};

export default api;
