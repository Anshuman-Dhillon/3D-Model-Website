import React, { useState } from 'react';
import "../pages design/ProfilePage.css"

function ProfilePage() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    });
    
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('Profile updated successfully!');
    };

    return (
        <div className="profile-page-container">
            <h2>Profile Settings</h2>
            <form className="profile-form" onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit">Update Profile</button>
            </form>
            {message && <p className="success-message">{message}</p>}
        </div>
    );
}

export default ProfilePage;