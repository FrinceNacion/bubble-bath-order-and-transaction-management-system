import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../../../common/services/api';
import { showToast } from '../../../common/components/Toast';

function ResetPasswordPage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'Weak', color: 'danger' });

    const token = location.state?.token;
    const email = location.state?.email;
    const demoOtp = location.state?.demoOtp; // For demo purposes only

    useEffect(() => {
        if (!token || !email) {
            showToast('Invalid reset session. Please start over.', 'error');
            navigate('/forgot-password');
        }
    }, [token, email, navigate]);

    useEffect(() => {
        // Simple password strength logic
        let score = 0;
        if (newPassword.length >= 8) score++;
        if (/[A-Z]/.test(newPassword)) score++;
        if (/[0-9]/.test(newPassword)) score++;
        if (/[^A-Za-z0-9]/.test(newPassword)) score++;

        const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        const colors = ['danger', 'warning', 'info', 'primary', 'success'];

        setPasswordStrength({
            score,
            label: labels[score] || 'Weak',
            color: colors[score] || 'danger'
        });
    }, [newPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            showToast('Passwords do not match.', 'error');
            return;
        }

        if (passwordStrength.score < 2) {
            showToast('Password is too weak. Please use at least 8 characters with letters and numbers.', 'error');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    token, 
                    otp, 
                    new_password: newPassword 
                })
            });
            const data = await response.json();

            if (data.success) {
                showToast('Password reset successful! You can now log in.', 'success');
                navigate('/login');
            } else {
                showToast(data.error || 'Failed to reset password.', 'error');
            }
        } catch (error) {
            console.error('Reset password error:', error);
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
                                <h3 className="fw-bold text-dark">Set New Password</h3>
                                <p className="text-secondary small">Enter the 6-digit code sent to <strong>{email}</strong> and your new password.</p>
                                {demoOtp && (
                                    <div className="alert alert-info py-2 px-3 small mt-2">
                                        <i className="bi bi-info-circle me-2"></i>
                                        Demo OTP: <strong>{demoOtp}</strong>
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="otp" className="form-label text-dark fw-medium small">Reset Code (OTP)</label>
                                    <input
                                        type="text"
                                        className="form-control bg-light border-0 text-center fw-bold fs-4"
                                        id="otp"
                                        placeholder="000000"
                                        maxLength="6"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="newPassword" className="form-label text-dark fw-medium small">New Password</label>
                                    <input
                                        type="password"
                                        className="form-control bg-light border-0"
                                        id="newPassword"
                                        placeholder="Min. 8 characters"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    {newPassword && (
                                        <div className="mt-2">
                                            <div className="progress" style={{ height: '4px' }}>
                                                <div 
                                                    className={`progress-bar bg-${passwordStrength.color}`} 
                                                    role="progressbar" 
                                                    style={{ width: `${(passwordStrength.score + 1) * 20}%` }}
                                                ></div>
                                            </div>
                                            <div className="d-flex justify-content-between mt-1">
                                                <span className="text-muted" style={{ fontSize: '10px' }}>Password Strength</span>
                                                <span className={`text-${passwordStrength.color} fw-bold`} style={{ fontSize: '10px' }}>{passwordStrength.label}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="form-label text-dark fw-medium small">Confirm Password</label>
                                    <input
                                        type="password"
                                        className="form-control bg-light border-0"
                                        id="confirmPassword"
                                        placeholder="Repeat new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-lg w-100 rounded-3 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        'Reset Password'
                                    )}
                                </button>

                                <div className="text-center">
                                    <Link to="/forgot-password" onClick={(e) => {
                                        if(!window.confirm("Go back? Your progress will be lost.")) e.preventDefault();
                                    }} className="text-decoration-none small text-secondary">
                                        Didn't get a code? Resend
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

export default ResetPasswordPage;
