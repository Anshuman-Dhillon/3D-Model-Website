import React from 'react';
import ItemGrid from '../components/ItemGrid';

function Catalog() {
    return (
        <div className="container py-4">
            <h1 className="text-center mb-5" style={{ color: '#bed5ed' }}>Marketplace</h1>
            <ItemGrid />
        </div>
    );
}

export default Catalog;