import React from 'react';
import ItemGrid from '../components/ItemGrid';
import SearchBar from '../components/SearchBar';

function Catalog() {
    return (
        <div>
        <SearchBar/>
        <div className="container py-4">
            <h1 className="text-center mb-5" style={{ color: '#bed5ed' }}>Marketplace</h1>
            <ItemGrid />
        </div>
        </div>
    );
}

export default Catalog;