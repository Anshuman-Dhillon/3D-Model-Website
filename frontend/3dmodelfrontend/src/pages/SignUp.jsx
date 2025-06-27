import React, { useState } from 'react';
import "../pages design/SignUp.css"
import MessageSpace from '../components/MessageSpace';
import LoginFail from '../components/LoginFail';

function SignUp() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);

    const handleSignUpClick = () => {
        console.log('Sign Up button clicked!');
        if (!email || !username || !password || !confirmPassword || password !== confirmPassword) {
            setMessage(<LoginFail type="Sign Up"></LoginFail>);
        }
    };

    const handleGoogleSignUp = () => {
        console.log('Google Sign Up clicked!');
        // Add your Google sign up logic here
    };

    const handleFacebookSignUp = () => {
        console.log('Facebook Sign Up clicked!');
        // Add your Facebook sign up logic here
    };

    return (
        <div style={{ marginBottom: '100px' }}>
            <MessageSpace message={message} />
            <div className="signup_container">
                <div className="signup_div d-flex flex-column align-items-center">
                    <h1 className="mb-4">Sign Up</h1>
                   
                    <div className="mb-3" style={{ width: '100%', maxWidth: '300px' }}>
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

                    <div className="mb-3" style={{ width: '100%', maxWidth: '300px' }}>
                        <label htmlFor="usernameInput" className="form-label">Username</label>
                        <input
                            type="username"
                            className="form-control"
                            id="usernameInput"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                   
                    <div className="mb-3" style={{ width: '100%', maxWidth: '300px' }}>
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
                   
                    <div className="mb-4" style={{ width: '100%', maxWidth: '300px' }}>
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
                   
                    <button className="btn btn-primary" onClick={handleSignUpClick}>
                        Sign Up
                    </button>

                    {/* OR divider that's actually visible */}
                    <div className="my-4 d-flex align-items-center" style={{ width: '100%', maxWidth: '300px' }}>
                        <div style={{ 
                            flex: 1, 
                            height: '1px', 
                            backgroundColor: '#ffffff',
                            opacity: 0.3
                        }}></div>
                        <span style={{ 
                            padding: '0 16px', 
                            color: '#ffffff',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: '20px',
                            minWidth: '40px',
                            textAlign: 'center',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}>
                            OR
                        </span>
                        <div style={{ 
                            flex: 1, 
                            height: '1px', 
                            backgroundColor: '#ffffff',
                            opacity: 0.3
                        }}></div>
                    </div>

                    {/* Social buttons */}
                    <div className="d-flex flex-column gap-2" style={{ width: '100%', maxWidth: '300px' }}>
                        <button 
                            className="btn d-flex align-items-center justify-content-center py-2"
                            onClick={handleGoogleSignUp}
                            style={{
                                backgroundColor: 'rgba(45, 55, 72, 0.3)',
                                border: '1px solid rgba(45, 55, 72, 0.1)',
                                color: '#2D3748',
                                borderRadius: '8px'
                            }}
                        >
                    
                            Sign in with Google
                        </button>
                        
                        <button 
                            className="btn d-flex align-items-center justify-content-center py-2"
                            onClick={handleFacebookSignUp}
                            style={{
                                backgroundColor: 'rgba(66, 103, 178, 0.4)',
                                border: '1px solid rgba(66, 103, 178, 0.6)',
                                color: '#2D3748',
                                borderRadius: '8px'
                            }}
                        >
                            Sign up with Facebook
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignUp;