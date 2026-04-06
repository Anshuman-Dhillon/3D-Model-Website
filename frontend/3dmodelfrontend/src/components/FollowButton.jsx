import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiToggleFollow } from '../api';
import { useNavigate } from 'react-router-dom';

function FollowButton({ targetUserId, initialFollowing = false, initialCount = 0, onToggle }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [following, setFollowing] = useState(initialFollowing);
    const [count, setCount] = useState(initialCount);

    // Don't show follow button for own profile
    if (user?.id === targetUserId) return null;

    const handleClick = async (e) => {
        e.stopPropagation();
        if (!user) { navigate('/login'); return; }

        const result = await apiToggleFollow(targetUserId);
        if (result.ok) {
            setFollowing(result.data.following);
            setCount(result.data.followerCount);
            onToggle?.(result.data.following);
        }
    };

    return (
        <div className="d-inline-flex align-items-center gap-2">
            <button
                onClick={handleClick}
                className="btn btn-sm"
                style={{
                    background: following
                        ? 'rgba(100,116,139,0.3)'
                        : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    color: '#fff',
                    border: following ? '1px solid rgba(100,116,139,0.4)' : 'none',
                    borderRadius: '20px',
                    padding: '4px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                }}
            >
                {following ? 'Following' : 'Follow'}
            </button>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                {count} {count === 1 ? 'follower' : 'followers'}
            </span>
        </div>
    );
}

export default FollowButton;
