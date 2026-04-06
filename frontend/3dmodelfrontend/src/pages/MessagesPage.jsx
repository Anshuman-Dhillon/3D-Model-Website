import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGetConversations, apiGetThread, apiSendMessage } from '../api';

function MessagesPage() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [activeConv, setActiveConv] = useState(null);
    const [thread, setThread] = useState([]);
    const [newMsg, setNewMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const endRef = useRef(null);

    useEffect(() => {
        apiGetConversations().then(data => {
            setConversations(Array.isArray(data) ? data : []);
            setLoading(false);
        });
    }, []);

    const openConversation = async (conv) => {
        setActiveConv(conv);
        const threadModelId = conv.modelId || 'direct';
        const messages = await apiGetThread(threadModelId, conv.otherUserId);
        setThread(Array.isArray(messages) ? messages : []);
        // Mark as read locally
        setConversations(prev =>
            prev.map(c => c.modelId === conv.modelId && c.otherUserId === conv.otherUserId
                ? { ...c, unread: 0 } : c)
        );
    };

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [thread]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMsg.trim() || !activeConv) return;
        setSending(true);
        const result = await apiSendMessage(activeConv.otherUserId, activeConv.modelId, newMsg.trim());
        if (result.ok) {
            setThread(prev => [...prev, result.data]);
            setNewMsg('');
        }
        setSending(false);
    };

    const timeFormat = (date) => {
        const d = new Date(date);
        const now = new Date();
        if (d.toDateString() === now.toDateString()) {
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' +
            d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) return <p className="text-center text-light mt-5">Loading messages...</p>;

    return (
        <div className="container py-4" style={{ maxWidth: '1000px' }}>
            <h2 className="mb-4" style={{ color: '#e2e8f0' }}>Messages</h2>
            <div className="d-flex" style={{ minHeight: '70vh', border: '1px solid rgba(100,116,139,0.3)', borderRadius: '12px', overflow: 'hidden' }}>
                {/* Conversation list */}
                <div style={{ width: '300px', borderRight: '1px solid rgba(100,116,139,0.3)', background: 'rgba(15,23,42,0.6)', overflowY: 'auto' }}>
                    {conversations.length === 0 ? (
                        <p style={{ color: '#64748b', textAlign: 'center', padding: '40px 16px' }}>No conversations yet</p>
                    ) : conversations.map((conv, i) => (
                        <div
                            key={i}
                            onClick={() => openConversation(conv)}
                            style={{
                                padding: '14px 16px',
                                cursor: 'pointer',
                                borderBottom: '1px solid rgba(100,116,139,0.15)',
                                background: activeConv?.otherUserId === conv.otherUserId && activeConv?.modelId === conv.modelId
                                    ? 'rgba(59,130,246,0.15)' : 'transparent',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => { if (activeConv?.otherUserId !== conv.otherUserId) e.currentTarget.style.background = 'rgba(100,116,139,0.1)'; }}
                            onMouseLeave={e => { if (activeConv?.otherUserId !== conv.otherUserId) e.currentTarget.style.background = 'transparent'; }}
                        >
                            <div className="d-flex justify-content-between align-items-center">
                                <strong style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>{conv.otherUsername}</strong>
                                {conv.unread > 0 && (
                                    <span className="badge" style={{ background: '#3b82f6', fontSize: '0.7rem' }}>
                                        {conv.unread}
                                    </span>
                                )}
                            </div>
                            <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>
                                {conv.modelName ? `Re: ${conv.modelName}` : 'Direct Message'}
                            </div>
                            <div style={{ color: '#475569', fontSize: '0.78rem', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {conv.lastMessage}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Message thread */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(15,23,42,0.3)' }}>
                    {!activeConv ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                            Select a conversation
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(100,116,139,0.2)', background: 'rgba(15,23,42,0.5)' }}>
                                <strong style={{ color: '#e2e8f0' }}>{activeConv.otherUsername}</strong>
                                <span style={{ color: '#64748b', fontSize: '0.85rem', marginLeft: '12px' }}>
                                    About: {activeConv.modelName}
                                </span>
                            </div>

                            {/* Messages */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {thread.map((msg) => {
                                    const isOwn = msg.sender === user?.id;
                                    return (
                                        <div key={msg._id} style={{ alignSelf: isOwn ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                                            <div style={{
                                                background: isOwn ? 'rgba(59,130,246,0.3)' : 'rgba(30,41,59,0.6)',
                                                border: isOwn ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(100,116,139,0.2)',
                                                borderRadius: isOwn ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                                                padding: '10px 14px',
                                            }}>
                                                <p style={{ color: '#e2e8f0', margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>{msg.text}</p>
                                            </div>
                                            <div style={{ color: '#475569', fontSize: '0.72rem', marginTop: '4px', textAlign: isOwn ? 'right' : 'left' }}>
                                                {timeFormat(msg.createdAt)}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={endRef} />
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSend} className="d-flex gap-2" style={{ padding: '12px 20px', borderTop: '1px solid rgba(100,116,139,0.2)', background: 'rgba(15,23,42,0.5)' }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Type a message..."
                                    value={newMsg}
                                    onChange={(e) => setNewMsg(e.target.value)}
                                    maxLength={2000}
                                    style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.3)', color: '#e2e8f0' }}
                                />
                                <button className="btn btn-primary" type="submit" disabled={sending || !newMsg.trim()}>
                                    Send
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MessagesPage;
