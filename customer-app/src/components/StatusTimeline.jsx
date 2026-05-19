import React from 'react';

const STATUS_ORDER = ['Pending', 'In Progress', 'Ready', 'Claimed'];

const StatusTimeline = ({ currentStatus }) => {
    // Find the index of the current status
    // If status is Cancelled, we handle it separately
    let currentIndex = STATUS_ORDER.indexOf(currentStatus);
    const isCancelled = currentStatus === 'Cancelled';
    
    // If not found or cancelled, default to -1 to not show progress normally
    if (currentIndex === -1) currentIndex = 0;
    if (isCancelled) currentIndex = -1;

    const progressPercentage = isCancelled ? 0 : (currentIndex / (STATUS_ORDER.length - 1)) * 100;

    return (
        <div className="w-100 px-3">
            {isCancelled ? (
                <div className="alert alert-danger text-center mb-0 mt-3 shadow-sm border-0">
                    <i className="bi bi-x-circle-fill me-2 fs-5 align-middle"></i>
                    <strong>Order Cancelled</strong>
                    <p className="mb-0 mt-1 small">This order has been cancelled and cannot be processed further.</p>
                </div>
            ) : (
                <div className="timeline-steps">
                    {/* The progress line */}
                    <div className="timeline-progress" style={{ width: `${progressPercentage}%` }}></div>
                    
                    {STATUS_ORDER.map((status, index) => {
                        const isActive = index === currentIndex;
                        const isCompleted = index < currentIndex;
                        
                        let iconClass = "bi-clock";
                        if (status === 'Pending') iconClass = "bi-clock-history";
                        if (status === 'In Progress') iconClass = "bi-arrow-repeat";
                        if (status === 'Ready') iconClass = "bi-check-circle";
                        if (status === 'Claimed') iconClass = "bi-bag-check-fill";

                        // If completed, use checkmark
                        if (isCompleted) iconClass = "bi-check";

                        let stepClass = "timeline-step";
                        if (isActive) stepClass += " active";
                        if (isCompleted) stepClass += " completed";

                        return (
                            <div key={status} className={stepClass}>
                                <div className="timeline-step-icon shadow-sm">
                                    <i className={`bi ${iconClass}`}></i>
                                </div>
                                <div className="timeline-step-label">{status}</div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StatusTimeline;
