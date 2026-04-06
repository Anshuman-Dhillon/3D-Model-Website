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
        <div>
            <button
                className="btn btn-outline-light btn-sm"
                onClick={() => {
                    if (!user) { navigate('/login'); return; }
                    setOpen(!open);
                }}
                style={{ borderRadius: '8px', fontSize: '0.85rem' }}
            >
                💬 Message Seller
            </button>

            {open && (
                <div style={{
                    marginTop: '12px',
                    background: 'rgba(15,23,42,0.8)',
                    border: '1px solid rgba(100,116,139,0.3)',
                    borderRadius: '10px',
                    padding: '16px',
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
