import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: '70vh', padding: '40px 20px' }}>
            <h6 className="text-uppercase fw-bold mb-3" style={{ letterSpacing: '3px', color: '#64748b', fontSize: '0.85rem' }}>
                OOPS!
            </h6>
            <h1 className="fw-bold mb-4" style={{ fontSize: 'clamp(5rem, 15vw, 10rem)', lineHeight: '0.9', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                404
            </h1>
            <p className="mb-4" style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '400px' }}>
                The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="d-flex gap-3">
                <button className="btn btn-outline-light px-4 py-2" onClick={() => navigate(-1)}>
                    Go Back
                </button>
                <button className="btn btn-primary px-4 py-2" onClick={() => navigate('/')}>
                    Home
                </button>
            </div>
        </div>
    );
}

export default NotFound;