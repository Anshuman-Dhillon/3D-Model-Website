import React, { useState } from 'react';
import "../pages design/SignUp.css"

function SignUp() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUpClick = () => {
        console.log('Sign Up button clicked!');
    };

     return (
        <div className="login_container">
            <div className="login_div d-flex flex-column align-items-center">
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
            </div>
        </div>
    );
}

export default SignUp;