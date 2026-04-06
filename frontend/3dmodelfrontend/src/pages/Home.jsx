import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../pages design/Home.css";
import Scene from '../components/Scene';

function Home() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/catalog?q=${encodeURIComponent(query.trim())}`);
        } else {
            navigate('/catalog');
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
            <div className="home-header-overlay" style={{background: 'rgba(255,255,255,0.0)', position: 'absolute', top: '-5vh', left: 0, width: '100%', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none'}}>
                <h1 style={{color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.25)', pointerEvents: 'auto'}}>Welcome to 3DModeller Marketplace</h1>
                <form className="home-search-form" style={{ pointerEvents: 'auto' }} onSubmit={handleSearch}>
                    <input
                        type="search"
                        placeholder="Search 3D Models..."
                        aria-label="Search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit">
                        SEARCH
                    </button>
                </form>
            </div>
            <Scene />
        </div>
    );
}

export default Home;