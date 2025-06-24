import React from 'react';
import ItemGrid from '../components/ItemGrid';

function Catalog() {
    return (
        <div className="container py-4" style={{ backgroundColor: '#f8f9fa' }}>
            <h1 className="text-center mb-5">Marketplace</h1>
            <ItemGrid />
        </div>
    );
}

export default Catalog;