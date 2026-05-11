import { API_ENDPOINTS } from '../services/api';

async function Authenticate() {
    try {
        const response = await fetch(API_ENDPOINTS.AUTH.GET_USER, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        if (data.success) {
            return { success: true, user: data.user };
        } else {
            return { success: false, message: 'User not authenticated' };
        }
    } catch (error) {
        return { success: false, message: 'Network error or server unavailable' };
    }
}

export default Authenticate;