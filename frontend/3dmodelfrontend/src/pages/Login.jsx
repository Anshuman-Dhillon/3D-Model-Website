import React, { useState } from 'react';
import "../pages design/Login.css"

function Login() {
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginClick = () => {
        console.log('Login button clicked!');
    };

     return (
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
            </div>
        </div>
    );
}

export default Login;