import React, { useEffect, useState } from 'react';
import ItemGrid from '../components/ItemGrid';
import { useNavigate } from 'react-router-dom';
import { apiGetMyModels } from '../api';
import { useAuth } from '../context/AuthContext';
import '../pages design/EditModelsPage.css';

function EditModelsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiGetMyModels().then(data => {
            setModels(Array.isArray(data) ? data : []);
            setLoading(false);
        });
    }, [user]);

    return (
        <div className="container py-4" style={{ position: 'relative', minHeight: '100vh' }}>
            <h1 className="text-center mb-5" style={{ color: '#bed5ed' }}>My Models</h1>
            {loading ? (
                <p className="text-center text-light">Loading...</p>
            ) : (
                <ItemGrid models={models} actions={["Edit", "Delete"]} />
            )}

            <button
                onClick={() => navigate("/managemodel")}
                className="fab-upload"
                title="Upload New Model"
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
            </button>
        </div>
    );
}

export default EditModelsPage;
