import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();
    const loginEndpoint = 'http://localhost/bubble-bath-backend/login.php';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const logUserIn = (data) => {
        if (data.success) {
            navigate('/dashboard');
        } else {
            setError('Invalid email or password. Please try again.');
        }
    };

    const requestOptions = {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        fetch(loginEndpoint, requestOptions)
            .then(async response => {
                const text = await response.text();
                return text ? JSON.parse(text) : {};
            })
            .then(data => logUserIn(data))
            .catch(error => {
                setError('An error occurred during login.', error);
            });
        console.log('Login attempt:', { email, password });
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="row justify-content-center w-100">
                <div className="col-md-6 col-lg-4">
                    <div className="card">
                        <div className="card-body p-4">
                            <h2 className="card-title text-center mb-4">Bubble Bath Management</h2>
                            <p className="text-center text-muted mb-4">Please sign in to continue</p>
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="text-black form-label">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="text-black form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <div className="d-flex text-center justify-content-end mt-1">
                                        <small className="text-muted">Forgot your password? <a href="#" className="text-decoration-none">Reset it here</a></small>
                                    </div>
                                </div>

                                <div className="d-flex flex-column">
                                    <button type="submit" className="btn btn-primary btn-lg w-100">
                                        Sign In
                                    </button>
                                    <div className="d-flex justify-content-center">
                                        <small className="text-muted mt-2">Doesn't have an account? <Link to="/register" className="text-decoration-none">Sign up here</Link></small>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;