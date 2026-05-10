import { Link } from "react-router-dom";
function NotFoundPage() {
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card border-0 d-flex p-5 shadow">
        <div className="card-body p-4 text-center">
          <h1 className="display-1">404</h1>
          <p className="text-dark">Page Not Found</p>
          <Link to="/dashboard" className="btn btn-primary mt-3">Go to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;