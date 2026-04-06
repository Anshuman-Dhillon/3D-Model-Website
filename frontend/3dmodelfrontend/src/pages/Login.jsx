import React, { useState } from 'react';
import "../pages design/Login.css"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';

function Login() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLoginClick = async (e) => {
        e.preventDefault();
        setError('');
        if (!user || !password) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        try {
            const result = await login(user, password);
            if (result.ok) {
                navigate('/catalog');
            } else {
                setError(result.data?.message || 'Login failed');
            }
        } catch {
            setError('Network error. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div>
            {error && (
                <div style={{ background: 'rgba(220,53,69,0.9)', color: '#fff', textAlign: 'center', padding: '12px', marginBottom: '10px' }}>
                    {error}
                </div>
            )}
            <div className="login_container" style={{ marginBottom: "100px"}}>
                <div className="login_div d-flex flex-column align-items-center">
                    <h1 className="mb-4">Login</h1>
                    
                    <form onSubmit={handleLoginClick} style={{ width: '100%', maxWidth: '300px' }}>
                        <div className="mb-3">
                            <label htmlFor="userInput" className="form-label">Username or Email</label>
                            <input
                                type="text"
                                className="form-control"
                                id="userInput"
                                placeholder="Enter your username or email"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                            />
                        </div>
                       
                        <div className="mb-3">
                            <label htmlFor="passwordInput" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="passwordInput"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                       
                        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <GoogleSignInButton onError={setError} />

                    <div className="mt-3">
                        <span style={{ color: '#ccc' }}>Don't have an account? </span>
                        <button className="btn btn-link p-0" style={{ color: '#6ea8fe' }} onClick={() => navigate('/signup')}>
                            Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;