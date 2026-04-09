import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiSendMessage } from '../api';
import { useNavigate } from 'react-router-dom';

function MessageSeller({ modelId, sellerId, sellerName }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    // Don't show message button if user is the seller
    if (user?.id === sellerId) return null;

    const handleSend = async (e) => {
        e.preventDefault();
        if (!user) { navigate('/login'); return; }
        if (!text.trim()) return;

        setSending(true);
        setError('');
        const result = await apiSendMessage(sellerId, modelId, text.trim());
        if (result.ok) {
            setSent(true);
            setText('');
            setTimeout(() => { setSent(false); setOpen(false); }, 2000);
        } else {
            setError(result.data?.message || 'Failed to send');
        }
        setSending(false);
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
                className="btn btn-info mt-2"
                onClick={() => {
                    if (!user) { navigate('/login'); return; }
                    setOpen(!open);
                }}
                style={{
                    background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
                    border: 'none',
                    color: '#fff',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 4px 16px rgba(14,165,233,0.35)'; }}
                onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = 'none'; }}
            >
                💬 Message Seller
            </button>

            {open && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '8px',
                    background: 'rgba(15,23,42,0.95)',
                    border: '1px solid rgba(100,116,139,0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    minWidth: '320px',
                    zIndex: 10,
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 10px' }}>
                        Message <strong style={{ color: '#60a5fa' }}>{sellerName}</strong> about this listing
                    </p>
                    {sent ? (
                        <div style={{ color: '#4ade80', textAlign: 'center', padding: '12px' }}>
                            Message sent!
                        </div>
                    ) : (
                        <form onSubmit={handleSend}>
                            <textarea
                                className="form-control mb-2"
                                rows="3"
                                placeholder="Hi, I have a question about this model..."
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                maxLength={2000}
                                style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.3)', color: '#e2e8f0', resize: 'vertical' }}
                            />
                            {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '8px' }}>{error}</div>}
                            <div className="d-flex gap-2">
                                <button className="btn btn-primary btn-sm" type="submit" disabled={sending || !text.trim()}>
                                    {sending ? 'Sending...' : 'Send'}
                                </button>
                                <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => setOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

export default MessageSeller;
