import React, { useState } from 'react';
import "../pages design/SignUp.css"
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';

function SignUp() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { signup } = useAuth();

    const handleSignUpClick = async (e) => {
        e.preventDefault();
        setError('');
        if (!email || !username || !password || !confirmPassword) {
            setError('All fields are required.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            const result = await signup(email, username, password, confirmPassword);
            if (result.ok) {
                navigate('/catalog');
            } else {
                setError(result.data?.message || 'Sign up failed');
            }
        } catch {
            setError('Network error. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div style={{ marginBottom: '100px' }}>
            {error && (
                <div style={{ background: 'rgba(220,53,69,0.9)', color: '#fff', textAlign: 'center', padding: '12px', marginBottom: '10px' }}>
                    {error}
                </div>
            )}
            <div className="signup_container" style={{ marginTop: '100px', marginBottom: "200px"}}>
                <div className="signup_div d-flex flex-column align-items-center">
                    <h1 className="mb-4">Sign Up</h1>
                   
                    <form onSubmit={handleSignUpClick} style={{ width: '100%', maxWidth: '300px' }}>
                        <div className="mb-3">
                            <label htmlFor="emailInput" className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="emailInput"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="usernameInput" className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                id="usernameInput"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
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
                       
                        <div className="mb-4">
                            <label htmlFor="confirmPasswordInput" className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="confirmPasswordInput"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                       
                        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>

                    <GoogleSignInButton onError={setError} />

                    <div className="mt-3">
                        <span style={{ color: '#ccc' }}>Already have an account? </span>
                        <button className="btn btn-link p-0" style={{ color: '#6ea8fe' }} onClick={() => navigate('/login')}>
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;