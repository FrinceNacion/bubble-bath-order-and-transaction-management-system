import React from 'react';
import './StatusBadge.css';

/**
 * StatusBadge Component
 * 
 * @param {string} status - The raw status string (e.g., 'pending', 'in_progress', 'ready', 'claimed', 'cancelled')
 * @param {string} size - Optional size: 'sm', 'md' (default), or 'lg'
 * @param {boolean} showIcon - Whether to display the status icon (default: true)
 * @param {string} className - Additional CSS classes
 */
const StatusBadge = ({ status, size = 'md', showIcon = true, className = '' }) => {
    // Normalize status: handle lowercase, underscores, and spaces
    const normalizedStatus = (status || 'pending').toLowerCase().replace(/\s+/g, '_').replace('-', '_');

    // Mapping for display text and icons
    const statusMap = {
        pending: {
            label: 'Pending',
            icon: 'bi-clock',
            class: 'status-badge-pending'
        },
        in_progress: {
            label: 'In Progress',
            icon: 'bi-arrow-repeat',
            class: 'status-badge-in-progress'
        },
        ready: {
            label: 'Ready',
            icon: 'bi-check2-circle',
            class: 'status-badge-ready'
        },
        claimed: {
            label: 'Claimed',
            icon: 'bi-bag-check',
            class: 'status-badge-claimed'
        },
        cancelled: {
            label: 'Cancelled',
            icon: 'bi-x-circle',
            class: 'status-badge-cancelled'
        }
    };

    const currentStatus = statusMap[normalizedStatus] || statusMap.pending;
    const sizeClass = size !== 'md' ? `status-badge-${size}` : '';

    return (
        <span className={`status-badge ${currentStatus.class} ${sizeClass} ${className}`}>
            {showIcon && <i className={`bi ${currentStatus.icon}`}></i>}
            {currentStatus.label}
        </span>
    );
};

export default StatusBadge;
