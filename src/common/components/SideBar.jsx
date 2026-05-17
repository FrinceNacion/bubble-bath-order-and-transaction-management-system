import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../services/api';

function SideBar({ user, isOpen, setIsOpen }) {
  const navigate = useNavigate();

  const closeSidebar = () => {
    if (setIsOpen) setIsOpen(false);
  };

  const handleLogout = () => {
    fetch(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(async (response) => {
        const data = await response.json();
        if (data.success) {
          navigate('/login');
        }
      });
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="sidebar-mobile-overlay" onClick={closeSidebar}></div>
      )}

      <aside className={`d-flex flex-column text-white w-auto sidebar-responsive ${isOpen ? 'show' : ''}`} style={{ minWidth: 260, backgroundColor: '#0f2c98' }}>
        <div className="d-flex align-items-center justify-content-between p-4 border-bottom border-white border-opacity-10">
          <div className="d-flex align-items-center gap-2">
            <div className="d-inline-flex align-items-center justify-content-center rounded-3 bg-white bg-opacity-10" style={{ width: 36, height: 36 }}>
              <i className="bi bi-droplet-fill text-white fs-5"></i>
            </div>
            <div>
              <div className="fw-semibold">Bubble Bath</div>
              <div className="text-white-50 small">Management</div>
            </div>
          </div>
          <button
            className="btn text-white d-md-none border-0 p-1 bg-transparent"
            onClick={closeSidebar}
          >
            <i className="bi bi-x-lg fs-5"></i>
          </button>
        </div>

        <nav className="flex-fill py-3 overflow-auto">
          <Link to="/dashboard" onClick={closeSidebar} className="d-flex align-items-center gap-2 px-4 py-2 text-white text-decoration-none  rounded-3 mb-1">
            <i className="bi bi-grid-1x2"></i>
            Dashboard
          </Link>
          <Link to="/customers" onClick={closeSidebar} className="d-flex align-items-center gap-2 px-4 py-2 text-white text-decoration-none rounded-3 mb-1">
            <i className="bi bi-people"></i>
            Customers
          </Link>
          <Link to="/new_order" onClick={closeSidebar} className="d-flex align-items-center gap-2 px-4 py-2 text-white text-decoration-none rounded-3 mb-1">
            <i className="bi bi-plus-circle"></i>
            New Order
          </Link>
          <Link to="/orders" onClick={closeSidebar} className="d-flex align-items-center gap-2 px-4 py-2 text-white text-decoration-none rounded-3 mb-1">
            <i className="bi bi-box-seam"></i>
            Order Tracking
          </Link>
          <Link to="/billing" onClick={closeSidebar} className="d-flex align-items-center gap-2 px-4 py-2 text-white text-decoration-none rounded-3 mb-1">
            <i className="bi bi-receipt"></i>
            Billing
          </Link>
          <Link to="/reports" onClick={closeSidebar} className="d-flex align-items-center gap-2 px-4 py-2 text-white text-decoration-none rounded-3">
            <i className="bi bi-bar-chart"></i>
            Reports
          </Link>
        </nav>

        <div className="p-4 border-top border-white border-opacity-10 mt-auto">
          <div className="text-white-50 small">Logged in as</div>
          <div className="fw-semibold">{user?.name}</div>
          <div className="text-white-50 small mb-3">{user?.role}</div>
          <button onClick={handleLogout} className="btn p-0 d-inline-flex align-items-center gap-2 text-white-50 text-decoration-none border-0 bg-transparent shadow-none">
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
