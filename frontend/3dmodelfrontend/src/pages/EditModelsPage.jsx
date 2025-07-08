import React from 'react';
import ItemGrid from '../components/ItemGrid';

function EditModelsPage() {
    return (
        <div className="container py-4">
            <h1 className="text-center mb-5" style={{ color: '#bed5ed' }}>My Models</h1>
            <ItemGrid actions={["Edit", "Delete"]} />
        </div>
    );
}

export default EditModelsPage;