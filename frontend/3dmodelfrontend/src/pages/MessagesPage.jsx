import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGetConversations, apiGetThread, apiSendMessage } from '../api';

/* ── tiny markdown-ish renderer ── */
function renderFormattedText(text) {
    if (!text) return null;
    // Split into lines for bullet handling
    const lines = text.split('\n');
    const elements = [];
    let listBuffer = [];

    const flushList = () => {
        if (listBuffer.length) {
            elements.push(
                <ul key={`ul-${elements.length}`} style={{ margin: '4px 0', paddingLeft: '20px' }}>
                    {listBuffer.map((li, i) => <li key={i}>{formatInline(li)}</li>)}
                </ul>
            );
            listBuffer = [];
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (/^[\-\*•]\s/.test(line)) {
            listBuffer.push(line.replace(/^[\-\*•]\s/, ''));
        } else {
            flushList();
            elements.push(
                <React.Fragment key={`line-${i}`}>
                    {i > 0 && !listBuffer.length && <br />}
                    {formatInline(line)}
                </React.Fragment>
            );
        }
    }
    flushList();
    return elements;
}

function formatInline(text) {
    if (!text) return text;
    // Order matters: code blocks first, then bold, italic, strikethrough, links
    const parts = [];
    // Regex: `code`, **bold**, *italic*, ~~strike~~, [text](url)
    const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~|\[[^\]]+\]\([^)]+\))/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }
        const token = match[0];
        if (token.startsWith('`')) {
            parts.push(
                <code key={match.index} style={{ background: 'rgba(100,116,139,0.3)', padding: '1px 6px', borderRadius: '4px', fontSize: '0.85em', fontFamily: 'monospace' }}>
                    {token.slice(1, -1)}
                </code>
            );
        } else if (token.startsWith('**')) {
            parts.push(<strong key={match.index}>{token.slice(2, -2)}</strong>);
        } else if (token.startsWith('*')) {
            parts.push(<em key={match.index}>{token.slice(1, -1)}</em>);
        } else if (token.startsWith('~~')) {
            parts.push(<s key={match.index}>{token.slice(2, -2)}</s>);
        } else if (token.startsWith('[')) {
            const linkMatch = token.match(/\[([^\]]+)\]\(([^)]+)\)/);
            if (linkMatch) {
                parts.push(
                    <a key={match.index} href={linkMatch[2]} target="_blank" rel="noopener noreferrer"
                        style={{ color: '#60a5fa', textDecoration: 'underline' }}>
                        {linkMatch[1]}
                    </a>
                );
            }
        }
        lastIndex = match.index + token.length;
    }
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }
    return parts;
}

function MessagesPage() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [activeConv, setActiveConv] = useState(null);
    const [thread, setThread] = useState([]);
    const [newMsg, setNewMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const endRef = useRef(null);
    const textareaRef = useRef(null);

    // Insert formatting syntax around selection or at cursor
    const insertFormat = useCallback((prefix, suffix = prefix) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const selected = newMsg.substring(start, end);
        const before = newMsg.substring(0, start);
        const after = newMsg.substring(end);
        const replacement = selected ? `${prefix}${selected}${suffix}` : `${prefix}${suffix}`;
        const updated = before + replacement + after;
        setNewMsg(updated);
        // Position cursor inside the formatting
        setTimeout(() => {
            ta.focus();
            const cursorPos = selected ? start + replacement.length : start + prefix.length;
            ta.setSelectionRange(cursorPos, cursorPos);
        }, 0);
    }, [newMsg]);

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
                                                <div style={{ color: '#e2e8f0', margin: 0, fontSize: '0.9rem', lineHeight: 1.6, wordBreak: 'break-word' }}>{renderFormattedText(msg.text)}</div>
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
                            <div style={{ borderTop: '1px solid rgba(100,116,139,0.2)', background: 'rgba(15,23,42,0.5)' }}>
                                {/* Formatting toolbar */}
                                <div style={{ display: 'flex', gap: '2px', padding: '8px 20px 0', flexWrap: 'wrap' }}>
                                    {[
                                        { label: 'B', title: 'Bold', action: () => insertFormat('**') },
                                        { label: 'I', title: 'Italic', action: () => insertFormat('*'), italic: true },
                                        { label: 'S', title: 'Strikethrough', action: () => insertFormat('~~'), strike: true },
                                        { label: '<>', title: 'Code', action: () => insertFormat('`') },
                                        { label: '•', title: 'Bullet list', action: () => insertFormat('- ', '') },
                                        { label: '🔗', title: 'Link', action: () => insertFormat('[', '](url)') },
                                    ].map(btn => (
                                        <button
                                            key={btn.title}
                                            type="button"
                                            title={btn.title}
                                            onClick={btn.action}
                                            style={{
                                                background: 'rgba(100,116,139,0.15)',
                                                border: '1px solid rgba(100,116,139,0.25)',
                                                color: '#94a3b8',
                                                borderRadius: '4px',
                                                padding: '2px 8px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                fontWeight: btn.label === 'B' ? 700 : 400,
                                                fontStyle: btn.italic ? 'italic' : 'normal',
                                                textDecoration: btn.strike ? 'line-through' : 'none',
                                                fontFamily: btn.label === '<>' ? 'monospace' : 'inherit',
                                                lineHeight: 1.4,
                                                transition: 'all 0.15s',
                                            }}
                                            onMouseEnter={e => { e.target.style.background = 'rgba(59,130,246,0.3)'; e.target.style.color = '#e2e8f0'; }}
                                            onMouseLeave={e => { e.target.style.background = 'rgba(100,116,139,0.15)'; e.target.style.color = '#94a3b8'; }}
                                        >
                                            {btn.label}
                                        </button>
                                    ))}
                                    <span style={{ color: '#475569', fontSize: '0.7rem', marginLeft: 'auto', alignSelf: 'center' }}>
                                        {newMsg.length}/2000
                                    </span>
                                </div>
                                <form onSubmit={handleSend} className="d-flex gap-2 align-items-end" style={{ padding: '8px 20px 12px' }}>
                                    <textarea
                                        ref={textareaRef}
                                        className="form-control"
                                        placeholder="Type a message... (supports **bold**, *italic*, `code`, ~~strike~~, - bullets)"
                                        value={newMsg}
                                        onChange={(e) => setNewMsg(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                if (newMsg.trim() && !sending) handleSend(e);
                                            }
                                        }}
                                        maxLength={2000}
                                        rows={2}
                                        style={{
                                            background: 'rgba(30,41,59,0.8)',
                                            border: '1px solid rgba(100,116,139,0.3)',
                                            color: '#e2e8f0',
                                            resize: 'none',
                                            lineHeight: 1.5,
                                        }}
                                    />
                                    <button className="btn btn-primary" type="submit" disabled={sending || !newMsg.trim()}
                                        style={{ padding: '8px 20px', whiteSpace: 'nowrap' }}>
                                        {sending ? '...' : 'Send'}
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MessagesPage;
