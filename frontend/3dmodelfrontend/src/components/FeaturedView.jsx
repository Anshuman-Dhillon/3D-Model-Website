import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGetModels } from '../api';

function FeaturedView() {
    const [featured, setFeatured] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        apiGetModels().then(data => {
            const models = Array.isArray(data) ? data.slice(0, 6) : [];
            setFeatured(models);
        }).catch(() => setFeatured([]));
    }, []);

    if (featured.length === 0) return null;

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4" style={{ color: '#e2e8f0' }}>Featured Models</h2>
            <div className="row g-4">
                {featured.map(model => (
                    <div key={model._id} className="col-md-4 col-sm-6">
                        <div
                            className="card h-100"
                            style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(100,116,139,0.3)', cursor: 'pointer' }}
                            onClick={() => navigate(`/modelview/${model._id}`)}
                        >
                            {model.thumbnailUrl ? (
                                <img src={model.thumbnailUrl} className="card-img-top" alt={model.name} style={{ height: 180, objectFit: 'cover' }} />
                            ) : (
                                <div style={{ height: 180, background: 'rgba(100,116,139,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ color: '#64748b' }}>No Preview</span>
                                </div>
                            )}
                            <div className="card-body">
                                <h6 className="card-title" style={{ color: '#e2e8f0' }}>{model.name}</h6>
                                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }} className="mb-1">{model.category} &middot; {model.format}</p>
                                <span style={{ color: '#60a5fa', fontWeight: 600 }}>${(model.price ?? 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FeaturedView;