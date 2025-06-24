import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "../component design/ModelItem.css";

function ModelItem({ name, description, price, image }) {
    return (
        <div
            className="card h-100 shadow-sm border-0"
            style={{ borderRadius: '12px', overflow: 'hidden', width: '320px' }}
        >
            {/* Image section with zoom */}
            <div style={{ height: '180px', overflow: 'hidden' }}>
                <img
                    src={image}
                    className="card-img-top"
                    alt={name}
                    style={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                />
            </div>

            {/* Info section */}
            <div className="card-body d-flex flex-column p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="flex-grow-1 me-3">
                        <h5 className="card-title mb-2" style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2c3e50' }}>
                            {name}
                        </h5>
                        <p className="card-text text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                            {description}
                        </p>
                    </div>
                    <div className="text-end">
                        {/* Price badge with black background */}
                        <span
                            className="badge fs-6 px-3 py-2"
                            style={{ backgroundColor: '#000', color: '#fff' }}
                        >
                            {price}
                        </span>
                    </div>
                </div>

                <div className="mt-auto">
                    {/* Button with black border and black hover background */}
                    <button
                        className="btn w-100"
                        style={{
                            borderRadius: '8px',
                            border: '1px solid black',
                            color: 'black',
                            backgroundColor: 'transparent',
                            transition: 'background-color 0.3s ease, color 0.3s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = 'black';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'black';
                        }}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModelItem;
