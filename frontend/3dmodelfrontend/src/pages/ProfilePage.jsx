import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiUpdateSettings, apiGetProfile, apiUploadProfilePicture } from '../api';
import "../pages design/ProfilePage.css";

function ProfilePage() {
    const { user, refreshProfile } = useAuth();
    const [form, setForm] = useState({
        username: '',
        email: '',
        newPassword: '',
        currentPassword: ''
    });
    const [profilePicture, setProfilePicture] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isGoogleUser, setIsGoogleUser] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        apiGetProfile().then(profile => {
            if (profile) {
                setForm(f => ({
                    ...f,
                    username: profile.username || '',
                    email: profile.email || ''
                }));
                setProfilePicture(profile.profilePicture || '');
                setIsGoogleUser(profile.authProvider === 'google');
            }
            setLoading(false);
        });
    }, [user]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePictureUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Client-side validation
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.type)) {
            setError('Only JPEG, PNG, and WebP images are allowed');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        setUploading(true);
        setError('');
        const result = await apiUploadProfilePicture(file);
        if (result.ok) {
            setProfilePicture(result.data.profilePicture);
            setMessage('Profile picture updated!');
            refreshProfile();
        } else {
            setError(result.data?.message || 'Upload failed');
        }
        setUploading(false);
        setTimeout(() => setMessage(''), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const body = {};
        if (!isGoogleUser) body.currentPassword = form.currentPassword;
        if (form.username) body.username = form.username;
        if (form.email) body.email = form.email;
        if (form.newPassword && !isGoogleUser) body.newPassword = form.newPassword;

        const result = await apiUpdateSettings(body);
        if (result.ok) {
            setMessage('Profile updated successfully!');
            setForm(f => ({ ...f, newPassword: '', currentPassword: '' }));
            refreshProfile();
        } else {
            setError(result.data?.message || 'Update failed');
        }
    };

    if (loading) return <p className="text-center text-light mt-5">Loading...</p>;

    return (
        <div className="profile-page-container">
            <h2 style={{ marginBottom: "20px" }}>Profile Settings</h2>

            {/* Profile Picture */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        margin: '0 auto 12px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: '3px solid rgba(96,165,250,0.4)',
                        background: 'rgba(30,41,59,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'border-color 0.2s',
                        position: 'relative',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#60a5fa'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(96,165,250,0.4)'}
                    title="Click to change profile picture"
                >
                    {profilePicture ? (
                        <img src={profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <span style={{ fontSize: '2.5rem', color: '#60a5fa', fontWeight: 700 }}>
                            {form.username?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                    )}
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePictureUpload}
                    accept="image/jpeg,image/png,image/webp"
                    style={{ display: 'none' }}
                />
                <button
                    className="btn btn-sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    style={{
                        color: '#94a3b8',
                        background: 'none',
                        border: '1px solid rgba(100,116,139,0.3)',
                        borderRadius: '20px',
                        padding: '4px 16px',
                        fontSize: '0.8rem',
                    }}
                >
                    {uploading ? 'Uploading...' : 'Change Photo'}
                </button>
            </div>

            <form className="profile-form" onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                />

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                />

                {isGoogleUser && (
                    <div style={{
                        background: 'rgba(59,130,246,0.1)',
                        border: '1px solid rgba(59,130,246,0.25)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        margin: '12px 0',
                        color: '#94a3b8',
                        fontSize: '0.88rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                        </svg>
                        Signed in with Google — password management is handled by your Google account.
                    </div>
                )}

                {!isGoogleUser && (
                    <>
                        <label htmlFor="newPassword">New Password:</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={form.newPassword}
                            onChange={handleChange}
                            placeholder="Leave blank to keep current"
                        />

                        <label htmlFor="currentPassword">Current Password:</label>
                        <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={form.currentPassword}
                            onChange={handleChange}
                            required
                        />
                    </>
                )}

                <button type="submit">Update Profile</button>
            </form>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="text-danger mt-2">{error}</p>}
        </div>
    );
}

export default ProfilePage;
