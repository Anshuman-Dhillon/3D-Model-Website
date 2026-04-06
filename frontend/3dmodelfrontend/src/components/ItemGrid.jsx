import React, { useState } from 'react';
import ModelItem from './ModelItem';  
import "../component design/ItemGrid.css"; 

function ItemGrid({ models: initialModels = [], actions = ["Add to Cart"] }) {
    const [models, setModels] = useState(initialModels);

    // Update models when prop changes
    React.useEffect(() => {
        setModels(initialModels);
    }, [initialModels]);

    const handleDelete = (deletedId) => {
        setModels(prev => prev.filter(m => m._id !== deletedId));
    };

    if (models.length === 0) {
        return (
            <div className="text-center py-5">
                <p style={{ color: '#bed5ed', fontSize: '1.2rem' }}>No models found. Be the first to upload one!</p>
            </div>
        );
    }

    return (
        <div className="d-flex justify-content-center py-4">
            <div className="container" style={{ maxWidth: '1200px' }}>
                <div className="row g-4 justify-content-center">
                    {models.map(model => (
                        <div key={model._id} className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center">
                            <ModelItem
                                id={model._id}
                                name={model.name}
                                description={model.description}
                                price={`$${(model.price ?? 0).toFixed(2)}`}
                                image={model.thumbnailUrl || ""}
                                imageUrls={model.imageUrls || []}
                                viewLink={`/modelview/${model._id}`}
                                actions={actions}
                                sellerName={model.sellerName}
                                format={model.format}
                                onDelete={handleDelete}
                                likes={model.likes}
                                averageRating={model.averageRating}
                                reviewCount={model.reviewCount}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ItemGrid;