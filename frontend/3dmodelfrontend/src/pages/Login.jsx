import React, { useState } from 'react';
import "../pages design/Login.css"
import MessageSpace from '../components/MessageSpace';
import LoginFail from '../components/LoginFail';

function Login() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);

    const handleLoginClick = () => {
        console.log('Login button clicked!');
        if (!user || !password) {
            setMessage(<LoginFail type="Log In"></LoginFail>);
        }
    };

    const handleGoogleLogin = () => {
        console.log('Google Login clicked!');
        // Add your Google login logic here
    };

    const handleFacebookLogin = () => {
        console.log('Facebook Login clicked!');
        // Add your Facebook login logic here
    };

    return (
        <div>
            <MessageSpace message={message} />
            <div className="login_container">
                <div className="login_div d-flex flex-column align-items-center">
                    <h1 className="mb-4">Login</h1>
                    
                    <div className="mb-3" style={{ width: '100%', maxWidth: '300px' }}>
                        <label htmlFor="usernameInput" className="form-label">Username/Email Address</label>
                        <input
                            type="user"
                            className="form-control"
                            id="userInput"
                            placeholder="Enter your username or email"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
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
                   
                    <button className="btn btn-primary" onClick={handleLoginClick}>
                        Login
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

                    {/* Social Media Login Buttons */}
                    <div className="d-flex flex-column gap-2" style={{ width: '100%', maxWidth: '300px' }}>
                        <button 
                            className="btn d-flex align-items-center justify-content-center"
                            onClick={handleGoogleLogin}
                            style={{
                               backgroundColor: 'rgba(45, 55, 72, 0.3)',
                                border: '1px solid rgba(45, 55, 72, 0.1)',
                                color: '#2D3748',
                                borderRadius: '8px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                            }}
                        >
                            <i className="fab fa-google me-2"></i>
                            Sign in with Google
                        </button>
                        
                        <button 
                            className="btn d-flex align-items-center justify-content-center"
                            onClick={handleFacebookLogin}
                            style={{
                                backgroundColor: 'rgba(66, 103, 178, 0.4)',
                                border: '1px solid rgba(66, 103, 178, 0.6)',
                                color: '#2D3748',
                                borderRadius: '8px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = 'rgba(66, 103, 178, 0.3)';
                                e.target.style.borderColor = 'rgba(66, 103, 178, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'rgba(66, 103, 178, 0.2)';
                                e.target.style.borderColor = 'rgba(66, 103, 178, 0.4)';
                            }}
                        >
                            <i className="fab fa-facebook-f me-2"></i>
                            Sign in with Facebook
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;