import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGetReviews, apiCreateReview } from '../api';

function StarRating({ rating, onRate, interactive = false, size = '1.2rem' }) {
    const [hovered, setHovered] = useState(0);
    return (
        <span style={{ display: 'inline-flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map(star => (
                <span
                    key={star}
                    style={{
                        cursor: interactive ? 'pointer' : 'default',
                        fontSize: size,
                        color: star <= (hovered || rating) ? '#f59e0b' : '#475569',
                        transition: 'color 0.15s',
                    }}
                    onClick={() => interactive && onRate?.(star)}
                    onMouseEnter={() => interactive && setHovered(star)}
                    onMouseLeave={() => interactive && setHovered(0)}
                >
                    ★
                </span>
            ))}
        </span>
    );
}

function ReviewSection({ modelId }) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (modelId) {
            apiGetReviews(modelId).then(data => setReviews(Array.isArray(data) ? data : []));
        }
    }, [modelId]);

    const avgRating = reviews.length
        ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
        : 0;

    const hasReviewed = user && reviews.some(r => r.user === user.id);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!rating) { setError('Please select a rating'); return; }
        if (!text.trim()) { setError('Please write a review'); return; }
        setSubmitting(true);
        const result = await apiCreateReview(modelId, rating, text.trim());
        if (result.ok) {
            setReviews(prev => [result.data, ...prev]);
            setRating(0);
            setText('');
        } else {
            setError(result.data?.message || 'Failed to submit review');
        }
        setSubmitting(false);
    };

    const timeAgo = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    return (
        <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(100,116,139,0.3)', borderRadius: '12px', padding: '24px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 style={{ color: '#e2e8f0', margin: 0 }}>Reviews</h4>
                {reviews.length > 0 && (
                    <div className="d-flex align-items-center gap-2">
                        <StarRating rating={Math.round(avgRating)} size="1rem" />
                        <span style={{ color: '#f59e0b', fontWeight: 600 }}>{avgRating}</span>
                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>({reviews.length})</span>
                    </div>
                )}
            </div>

            {/* Write review form */}
            {user && !hasReviewed && (
                <form onSubmit={handleSubmit} style={{ marginBottom: '24px', background: 'rgba(30,41,59,0.5)', borderRadius: '8px', padding: '16px' }}>
                    <div className="mb-2">
                        <label style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>Your Rating</label>
                        <StarRating rating={rating} onRate={setRating} interactive size="1.5rem" />
                    </div>
                    <textarea
                        className="form-control mb-2"
                        rows="3"
                        placeholder="Share your experience with this model..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        maxLength={1000}
                        style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.3)', color: '#e2e8f0', resize: 'vertical' }}
                    />
                    {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '8px' }}>{error}</div>}
                    <button className="btn btn-primary btn-sm" type="submit" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            )}

            {/* Reviews list */}
            {reviews.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center' }}>No reviews yet. Be the first to review!</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {reviews.map(r => (
                        <div key={r._id} style={{ background: 'rgba(30,41,59,0.5)', borderRadius: '8px', padding: '14px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <div>
                                    <strong style={{ color: '#60a5fa', fontSize: '0.9rem' }}>{r.username}</strong>
                                    <span style={{ color: '#475569', fontSize: '0.8rem', marginLeft: '8px' }}>{timeAgo(r.createdAt)}</span>
                                </div>
                                <StarRating rating={r.rating} size="0.9rem" />
                            </div>
                            <p style={{ color: '#cbd5e1', margin: '8px 0 0', fontSize: '0.9rem', lineHeight: 1.5 }}>{r.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export { StarRating };
export default ReviewSection;
