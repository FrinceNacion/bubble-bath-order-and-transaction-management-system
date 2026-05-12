import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../../common/services/api';
import { showToast } from '../../../common/components/Toast';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // NOT WORKING, NO MAILER AND ENDPOINT YET
        try {
            const response = await fetch(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();

            if (data.success) {
                showToast(data.message, 'success');
                navigate('/reset-password');
            } else {
                showToast(data.error || 'Failed to request reset code.', 'error');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            showToast('An error occurred. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="row justify-content-center w-100">
                <div className="col-md-6 col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4 p-md-5">
                            <div className="text-center mb-4">
                                <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3" style={{ width: 64, height: 64 }}>
                                    <i className="bi bi-shield-lock text-primary fs-2"></i>
                                </div>
                                <h3 className="fw-bold text-dark">Forgot Password?</h3>
                                <p className="text-secondary small">Enter your email and we'll send you a 6-digit code to reset your password.</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="email" className="form-label text-dark fw-medium small">Email Address</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <i className="bi bi-envelope text-secondary"></i>
                                        </span>
                                        <input
                                            type="email"
                                            className="form-control bg-light border-start-0"
                                            id="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-lg w-100 rounded-3 mb-3 d-flex align-items-center justify-content-center gap-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        <>Send Reset Code <i className="bi bi-arrow-right"></i></>
                                    )}
                                </button>

                                <div className="text-center">
                                    <Link to="/login" className="text-decoration-none small fw-medium">
                                        <i className="bi bi-chevron-left me-1"></i> Back to Sign In
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
