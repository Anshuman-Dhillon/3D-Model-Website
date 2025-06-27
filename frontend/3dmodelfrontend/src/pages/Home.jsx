import React from 'react';
import "../pages design/Home.css"
import SecondaryBar from '../components/SecondaryBar';"../components/SecondaryBar"
import ItemGrid from '../components/ItemGrid';
import Scene from '../components/Scene';

function Home() {
    return (
        <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
            {/* Overlay header and search bar with transparent background */}
            <div className="home-header-overlay" style={{background: 'rgba(255,255,255,0.0)', position: 'absolute', top: '-5vh', left: 0, width: '100%', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none'}}>
                <h1 style={{color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.25)', pointerEvents: 'auto'}}>Welcome to 3DModeller Marketplace</h1>
                <form className="home-search-form" style={{ pointerEvents: 'auto' }}>
                    <input
                        type="search"
                        placeholder="Search 3D Models..."
                        aria-label="Search"
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