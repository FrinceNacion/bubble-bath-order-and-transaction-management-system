import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TrackOrderPage from './pages/TrackOrderPage';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
          <div className="container">
            <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold text-info">
              <i className="bi bi-droplet-fill fs-4"></i>
              <span>Bubble Bath</span>
            </Link>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<TrackOrderPage />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="bg-white border-top py-4 mt-auto">
          <div className="container text-center text-secondary small">
            <p className="mb-0">&copy; {new Date().getFullYear()} Bubble Bath Management System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
