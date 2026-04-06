import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiToggleLike } from '../api';
import { useNavigate } from 'react-router-dom';

function LikeButton({ modelId, initialLikes = 0, initialLiked = false }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [liked, setLiked] = useState(initialLiked);
    const [likes, setLikes] = useState(initialLikes);
    const [animating, setAnimating] = useState(false);

    const handleClick = async (e) => {
        e.stopPropagation();
        if (!user) { navigate('/login'); return; }

        setAnimating(true);
        setLiked(!liked);
        setLikes(prev => liked ? prev - 1 : prev + 1);

        const result = await apiToggleLike(modelId);
        if (result.ok) {
            setLiked(result.data.liked);
            setLikes(result.data.likes);
        } else {
            // Revert
            setLiked(liked);
            setLikes(likes);
        }
        setTimeout(() => setAnimating(false), 300);
    };

    return (
        <button
            onClick={handleClick}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: liked ? '#ef4444' : '#64748b',
                fontSize: '0.9rem',
                padding: '4px 8px',
                borderRadius: '6px',
                transition: 'all 0.2s',
                transform: animating ? 'scale(1.2)' : 'scale(1)',
            }}
            title={liked ? 'Unlike' : 'Like'}
        >
            <span style={{ fontSize: '1.1rem' }}>{liked ? '❤️' : '🤍'}</span>
            <span>{likes}</span>
        </button>
    );
}

export default LikeButton;
