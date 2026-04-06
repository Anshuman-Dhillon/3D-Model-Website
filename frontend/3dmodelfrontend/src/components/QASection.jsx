import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGetQuestions, apiCreateQuestion, apiCreateAnswer } from '../api';

function QASection({ modelId }) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [newQ, setNewQ] = useState('');
    const [answerText, setAnswerText] = useState({});
    const [showAnswerFor, setShowAnswerFor] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (modelId) {
            apiGetQuestions(modelId).then(data => setQuestions(Array.isArray(data) ? data : []));
        }
    }, [modelId]);

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        if (!newQ.trim()) return;
        setSubmitting(true);
        const result = await apiCreateQuestion(modelId, newQ.trim());
        if (result.ok) {
            setQuestions(prev => [result.data, ...prev]);
            setNewQ('');
        }
        setSubmitting(false);
    };

    const handleAnswer = async (questionId) => {
        const text = answerText[questionId];
        if (!text?.trim()) return;
        setSubmitting(true);
        const result = await apiCreateAnswer(questionId, text.trim());
        if (result.ok) {
            setQuestions(prev => prev.map(q => q._id === questionId ? result.data : q));
            setAnswerText(prev => ({ ...prev, [questionId]: '' }));
            setShowAnswerFor(null);
        }
        setSubmitting(false);
    };

    const timeAgo = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        const days = Math.floor(hrs / 24);
        return `${days}d ago`;
    };

    return (
        <div style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(100,116,139,0.3)', borderRadius: '12px', padding: '24px' }}>
            <h4 style={{ color: '#e2e8f0', marginBottom: '20px' }}>Questions & Answers</h4>

            {user && (
                <form onSubmit={handleAskQuestion} style={{ marginBottom: '24px' }}>
                    <div className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ask a question about this model..."
                            value={newQ}
                            onChange={(e) => setNewQ(e.target.value)}
                            maxLength={1000}
                            style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.3)', color: '#e2e8f0' }}
                        />
                        <button className="btn btn-primary" type="submit" disabled={submitting || !newQ.trim()}>
                            Ask
                        </button>
                    </div>
                </form>
            )}

            {questions.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center' }}>No questions yet. Be the first to ask!</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {questions.map(q => (
                        <div key={q._id} style={{ background: 'rgba(30,41,59,0.5)', borderRadius: '8px', padding: '16px' }}>
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <strong style={{ color: '#60a5fa', fontSize: '0.9rem' }}>{q.username}</strong>
                                    <span style={{ color: '#475569', fontSize: '0.8rem', marginLeft: '8px' }}>{timeAgo(q.createdAt)}</span>
                                </div>
                            </div>
                            <p style={{ color: '#e2e8f0', margin: '8px 0', fontSize: '0.95rem' }}>{q.text}</p>

                            {/* Answers */}
                            {q.answers?.length > 0 && (
                                <div style={{ marginLeft: '20px', borderLeft: '2px solid rgba(96,165,250,0.3)', paddingLeft: '16px', marginTop: '12px' }}>
                                    {q.answers.map((a, i) => (
                                        <div key={i} style={{ marginBottom: '10px' }}>
                                            <strong style={{ color: '#a78bfa', fontSize: '0.85rem' }}>{a.username}</strong>
                                            <span style={{ color: '#475569', fontSize: '0.8rem', marginLeft: '8px' }}>{timeAgo(a.createdAt)}</span>
                                            <p style={{ color: '#cbd5e1', margin: '4px 0 0', fontSize: '0.9rem' }}>{a.text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Answer form */}
                            {user && showAnswerFor === q._id ? (
                                <div className="d-flex gap-2 mt-2" style={{ marginLeft: '20px' }}>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Write an answer..."
                                        value={answerText[q._id] || ''}
                                        onChange={(e) => setAnswerText(prev => ({ ...prev, [q._id]: e.target.value }))}
                                        maxLength={1000}
                                        style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.3)', color: '#e2e8f0' }}
                                    />
                                    <button className="btn btn-sm btn-outline-light" onClick={() => handleAnswer(q._id)} disabled={submitting}>
                                        Reply
                                    </button>
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowAnswerFor(null)}>
                                        Cancel
                                    </button>
                                </div>
                            ) : user && (
                                <button
                                    className="btn btn-sm btn-link p-0 mt-1"
                                    style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.85rem' }}
                                    onClick={() => setShowAnswerFor(q._id)}
                                >
                                    Reply
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default QASection;
