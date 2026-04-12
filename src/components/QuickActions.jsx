import { Link } from "react-router-dom";

function QuickActions({className}) {
  return (
    <div style={{ minWidth: 200, flex: '1 1 200px' }} className={`card border-0 shadow-sm rounded-3 p-4 ${className}`}>
      <h6 className="fw-semibold mb-4">Quick Actions</h6>
      <a href="#" className="btn btn-primary d-flex align-items-center gap-2 w-100 mb-3">
        <i className="bi bi-plus-circle"></i>
        Create New Order
      </a>
      <Link to="/customers" className="btn btn-outline-secondary d-flex align-items-center gap-2 w-100 mb-3">
        <i className="bi bi-people"></i>
        Manage Customers
      </Link>
      <a href="#" className="btn btn-outline-secondary d-flex align-items-center gap-2 w-100 mb-3">
        <i className="bi bi-receipt"></i>
        Process Payments
      </a>
      <a href="#" className="btn btn btn-outline-secondary d-flex align-items-center gap-2 w-100">
        <i className="bi bi-bar-chart"></i>
        View Reports
      </a>
    </div>
  );
}

export default QuickActions;