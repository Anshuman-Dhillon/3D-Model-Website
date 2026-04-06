import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGetUserById, apiSendMessage } from '../api';
import { useAuth } from '../context/AuthContext';
import ModelItem from '../components/ModelItem';
import FollowButton from '../components/FollowButton';
import '../pages design/UserProfilePage.css';

function UserProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [msgOpen, setMsgOpen] = useState(false);
    const [msgText, setMsgText] = useState('');
    const [sending, setSending] = useState(false);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        apiGetUserById(id).then(data => {
            setProfile(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [id]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!msgText.trim()) return;
        if (!user) { navigate('/login'); return; }
        setSending(true);
        const result = await apiSendMessage(id, null, msgText.trim());
        if (result.ok) {
            setFeedback('Message sent!');
            setMsgText('');
            setMsgOpen(false);
        } else {
            setFeedback(result.data?.message || 'Failed to send');
        }
        setSending(false);
        setTimeout(() => setFeedback(''), 3000);
    };

    if (loading) return <div className="user-profile-container"><p style={{ color: '#ccc' }}>Loading...</p></div>;
    if (!profile) return <div className="user-profile-container"><p style={{ color: '#ccc' }}>User not found.</p></div>;

    const isOwnProfile = user?.id === id;
    const models = profile.postedModels || [];

    return (
        <div className="user-profile-container">
            {/* Profile Header */}
            <div className="user-profile-header">
                <div className="user-profile-avatar">
                    {profile.profilePicture ? (
                        <img src={profile.profilePicture} alt={profile.username} />
                    ) : (
                        <span className="user-profile-initial">
                            {profile.username?.charAt(0).toUpperCase()}
                        </span>
                    )}
                </div>
                <div className="user-profile-info">
                    <h2>{profile.username}</h2>
                    <div className="user-profile-stats">
                        <div className="stat-block">
                            <strong>{profile.followerCount || 0}</strong>
                            <span>Followers</span>
                        </div>
                        <div className="stat-block">
                            <strong>{profile.followingCount || 0}</strong>
                            <span>Following</span>
                        </div>
                        <div className="stat-block">
                            <strong>{models.length}</strong>
                            <span>Models</span>
                        </div>
                    </div>
                    <p className="user-profile-joined">
                        Member since {new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </p>
                    {!isOwnProfile && (
                        <div className="user-profile-actions">
                            <FollowButton targetUserId={id} />
                            {user && (
                                <button
                                    className="user-profile-msg-btn"
                                    onClick={() => setMsgOpen(!msgOpen)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                                    </svg>
                                    Message
                                </button>
                            )}
                            {!user && (
                                <button
                                    className="user-profile-msg-btn"
                                    onClick={() => navigate('/login')}
                                >
                                    Login to Message
                                </button>
                            )}
                        </div>
                    )}
                    {isOwnProfile && (
                        <button
                            className="user-profile-edit-btn"
                            onClick={() => navigate('/profile')}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Feedback */}
            {feedback && (
                <div className={`user-profile-feedback ${feedback.includes('sent') ? 'success' : 'error'}`}>
                    {feedback}
                </div>
            )}

            {/* Message Form */}
            {msgOpen && (
                <div className="user-profile-msg-form-wrap">
                    <form className="user-profile-msg-form" onSubmit={handleSendMessage}>
                        <textarea
                            className="user-profile-msg-textarea"
                            placeholder={`Send a message to ${profile.username}...`}
                            value={msgText}
                            onChange={e => setMsgText(e.target.value)}
                            maxLength={2000}
                            rows={3}
                            autoFocus
                        />
                        <div className="user-profile-msg-controls">
                            <span className="char-count">{msgText.length}/2000</span>
                            <div className="d-flex gap-2">
                                <button
                                    type="button"
                                    className="user-profile-cancel-btn"
                                    onClick={() => { setMsgOpen(false); setMsgText(''); }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="user-profile-send-btn"
                                    disabled={!msgText.trim() || sending}
                                >
                                    {sending ? 'Sending...' : 'Send'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Models Section */}
            <div className="user-profile-models">
                <h3>{isOwnProfile ? 'Your Models' : `${profile.username}'s Models`}</h3>
                {models.length === 0 ? (
                    <p className="user-profile-no-models">No models posted yet.</p>
                ) : (
                    <div className="user-profile-models-grid">
                        {models.map(m => (
                            <ModelItem
                                key={m._id}
                                id={m._id}
                                name={m.name}
                                description={m.description}
                                price={`$${(m.price ?? 0).toFixed(2)}`}
                                image={m.thumbnailUrl || ''}
                                imageUrls={m.imageUrls || []}
                                viewLink={`/modelview/${m._id}`}
                                sellerName={m.sellerName || profile.username}
                                format={m.format}
                                likes={m.likes}
                                averageRating={m.averageRating}
                                reviewCount={m.reviewCount}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserProfilePage;
