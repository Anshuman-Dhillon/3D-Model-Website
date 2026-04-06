import React, { useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "../component design/ModelItem.css";
import { useNavigate } from 'react-router-dom';
import MessageBox from './MessageBox';
import { apiAddToCart, apiDeleteModel } from '../api';

function ModelItem({ name, description, price, image, imageUrls = [], viewLink, actions = ["Add to Cart"], id, sellerName, format, onDelete, likes, averageRating, reviewCount }) {
    const navigate = useNavigate();
    const [hover, setHover] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [actionMsg, setActionMsg] = useState('');
    const [imgIndex, setImgIndex] = useState(0);

    // Build gallery: main image first, then extras
    const gallery = [];
    if (image) gallery.push(image);
    if (imageUrls?.length) gallery.push(...imageUrls);

    const handleDeleteConfirm = async (confirmed) => {
        setShowMessage(false);
        if (confirmed && id) {
            const result = await apiDeleteModel(id);
            if (result.ok) {
                setActionMsg('Model deleted');
                if (onDelete) onDelete(id);
            } else {
                setActionMsg(result.data?.message || 'Delete failed');
            }
        }
    };

    const buttonFunctions = {
        "Add to Cart": async () => {
            if (!id) return;
            const result = await apiAddToCart(id);
            setActionMsg(result.ok ? 'Added to cart!' : (result.data?.message || 'Failed'));
            setTimeout(() => setActionMsg(''), 2000);
        },
        "Delete": () => setShowMessage(true),
        "Edit": () => navigate(`/managemodel/${id}`),
    };

    return (
        <>
            {showMessage && (
                <MessageBox
                    message={`Are you sure you want to delete "${name}"?`}
                    buttons={[
                        { text: "Yes", onClick: () => handleDeleteConfirm(true) },
                        { text: "No", onClick: () => handleDeleteConfirm(false) }
                    ]}
                />
            )}

            <div
                onClick={() => navigate(viewLink)}
                className="card h-100 shadow-sm border-0"
                style={{
                    borderRadius: '14px',
                    overflow: 'hidden',
                    width: '320px',
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(100, 116, 139, 0.3)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
                {/* Image Carousel */}
                <div style={{ height: '180px', overflow: 'hidden', backgroundColor: 'rgba(15, 23, 42, 0.5)', position: 'relative' }}>
                    {gallery.length > 0 ? (
                        <img
                            src={gallery[imgIndex]}
                            className="card-img-top"
                            alt={name}
                            style={{ height: '100%', width: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        />
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: '3rem' }}>
                            🎮
                        </div>
                    )}
                    {gallery.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); setImgIndex(i => (i - 1 + gallery.length) % gallery.length); }}
                                style={{
                                    position: 'absolute', left: '6px', top: '50%', transform: 'translateY(-50%)',
                                    width: '28px', height: '28px', borderRadius: '50%', border: 'none',
                                    background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1rem',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                                }}
                            >‹</button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setImgIndex(i => (i + 1) % gallery.length); }}
                                style={{
                                    position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)',
                                    width: '28px', height: '28px', borderRadius: '50%', border: 'none',
                                    background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '1rem',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                                }}
                            >›</button>
                            <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '4px' }}>
                                {gallery.map((_, i) => (
                                    <span key={i} style={{
                                        width: '6px', height: '6px', borderRadius: '50%',
                                        background: i === imgIndex ? '#60a5fa' : 'rgba(255,255,255,0.4)',
                                        transition: 'background 0.2s'
                                    }} />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Info */}
                <div className="card-body d-flex flex-column p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="flex-grow-1 me-3">
                            <h5
                                className="card-title mb-1"
                                style={{ fontSize: '1.1rem', fontWeight: 600, color: hover ? '#60a5fa' : '#e2e8f0', transition: 'color 0.2s ease' }}
                                onMouseEnter={() => setHover(true)}
                                onMouseLeave={() => setHover(false)}
                            >
                                {name}
                            </h5>
                            {sellerName && <small style={{ color: '#94a3b8' }}>by {sellerName}</small>}
                            <p className="card-text mt-1" style={{ fontSize: '0.85rem', lineHeight: '1.4', color: '#94a3b8' }}>
                                {description?.length > 80 ? description.slice(0, 80) + '...' : description}
                            </p>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                {format && <span className="badge bg-secondary">{format}</span>}
                                {averageRating > 0 && (
                                    <span style={{ color: '#facc15', fontSize: '0.8rem' }}>
                                        {'★'.repeat(Math.round(averageRating))}{'☆'.repeat(5 - Math.round(averageRating))}
                                        <span style={{ color: '#94a3b8', marginLeft: '3px' }}>({reviewCount || 0})</span>
                                    </span>
                                )}
                                {likes > 0 && (
                                    <span style={{ color: '#f87171', fontSize: '0.8rem' }}>♥ {likes}</span>
                                )}
                            </div>
                        </div>
                        <div className="text-end">
                            <span className="badge fs-6 px-3 py-2" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                                {price}
                            </span>
                        </div>
                    </div>

                    {actionMsg && <div className="text-center mb-2" style={{ color: '#4ade80', fontSize: '0.85rem' }}>{actionMsg}</div>}

                    <div className="mt-auto d-grid gap-2">
                        {actions.map((action, index) => (
                            <button
                                key={index}
                                className="btn w-100"
                                style={{
                                    borderRadius: '8px',
                                    border: '1px solid rgba(100, 116, 139, 0.4)',
                                    color: '#e2e8f0',
                                    backgroundColor: 'transparent',
                                    transition: 'all 0.2s ease',
                                    fontSize: '0.9rem',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3b82f6'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#3b82f6'; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.borderColor = 'rgba(100, 116, 139, 0.4)'; }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const fn = buttonFunctions[action];
                                    if (fn) fn();
                                }}
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModelItem;
