import React, { useState } from 'react';
import "../pages design/ProfilePage.css";

function ProfilePage() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        currentpassword: ''
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
            <h2 style={{ marginBottom: "20px" }}>Profile Settings</h2>
            <form className="profile-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password">New Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="profilepicinput">New Picture:</label>
                <input
                    type="file"
                    id="profilepicinput"
                    name="profilepicinput"
                    accept="image/*"
                    capture="environment"
                    required
                />

                <label htmlFor="currentpassword">Current Password:</label>
                <input
                    type="password"
                    id="currentpassword"
                    name="currentpassword"
                    value={form.currentpassword}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Update Profile</button>
            </form>
            {message && <p className="success-message">{message}</p>}
        </div>
    );
}

export default ProfilePage;
