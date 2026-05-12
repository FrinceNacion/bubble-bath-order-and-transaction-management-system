import { useState, useEffect, useCallback } from 'react';
import './Toast.css';

let toastDispatch = null;

/**
 * Call this from anywhere (no hooks needed) to show a toast.
 *   import { showToast } from '../common/components/Toast';
 *   showToast('Order updated!', 'success');
 */
export const showToast = (message, type = 'info', duration = 3500) => {
    if (toastDispatch) {
        toastDispatch({ message, type, duration, id: Date.now() });
    }
};

function ToastItem({ toast, onRemove }) {
    useEffect(() => {
        const timer = setTimeout(() => onRemove(toast.id), toast.duration);
        return () => clearTimeout(timer);
    }, [toast, onRemove]);

    const icons = {
        success: 'bi-check-circle-fill',
        error:   'bi-x-circle-fill',
        warning: 'bi-exclamation-triangle-fill',
        info:    'bi-info-circle-fill',
    };

    return (
        <div className={`toast-item toast-${toast.type} show`} role="alert">
            <i className={`bi ${icons[toast.type] || icons.info} toast-icon`} />
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => onRemove(toast.id)}>
                <i className="bi bi-x" />
            </button>
        </div>
    );
}

function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    useEffect(() => {
        toastDispatch = (newToast) => {
            setToasts(prev => [...prev, newToast]);
        };
        return () => { toastDispatch = null; };
    }, []);

    return (
        <div className="toast-container-custom" aria-live="polite">
            {toasts.map(t => (
                <ToastItem key={t.id} toast={t} onRemove={removeToast} />
            ))}
        </div>
    );
}

export default ToastContainer;
