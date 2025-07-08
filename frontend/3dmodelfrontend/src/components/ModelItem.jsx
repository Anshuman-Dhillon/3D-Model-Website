import React, { useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "../component design/ModelItem.css";
import { useNavigate } from 'react-router-dom';
import MessageBox from './MessageBox'; // Ensure this exists

function ModelItem({ name, description, price, image, viewLink, actions = ["Add to Cart"] }) {
    const navigate = useNavigate();
    const [hover, setHover] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    // Handles user response in MessageBox
    const handleDeleteConfirm = (confirmed) => {
        setShowMessage(false);
        if (confirmed) {
            console.log(`Deleted ${name}`);
            // Place delete logic here
        }
    };

    // Create button functions with necessary scope
    const buttonFunctions = {
        "Add to Cart": () => {
            console.log(`Added ${name} to cart`);
        },
        "Delete": () => {
            setShowMessage(true);
        },
        "Edit": () => {
            navigate('/managemodel/1');
        }
    };

    return (
        <>
            {showMessage && (
                <MessageBox
                    message={`Are you sure you want to delete "${name}"?`}
                    buttons={[
                        { text: "Yes", onClick: () => handleDeleteConfirm(true) },
                        { text: "No", onClick: () => handleDeleteConfirm(false) }
                    ]}
                />
            )}

            <div
                onClick={() => navigate(viewLink)}
                className="card h-100 shadow-sm border-0"
                style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    width: '320px',
                    backgroundColor: '#748aa1',
                    cursor: 'pointer'
                }}
            >
                {/* Image */}
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

                {/* Info */}
                <div className="card-body d-flex flex-column p-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="flex-grow-1 me-3">
                            <h5
                                className="card-title mb-2"
                                style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    color: hover ? '#0056b3' : '#2c3e50',
                                    transition: 'color 0.3s ease'
                                }}
                                onMouseEnter={() => setHover(true)}
                                onMouseLeave={() => setHover(false)}
                            >
                                {name}
                            </h5>
                            <p className="card-text text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                                {description}
                            </p>
                        </div>
                        <div className="text-end">
                            <span className="badge fs-6 px-3 py-2" style={{ backgroundColor: '#000', color: '#fff' }}>
                                {price}
                            </span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-auto d-grid gap-2">
                        {actions.map((action, index) => (
                            <button
                                key={index}
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const fn = buttonFunctions[action];
                                    if (fn) fn();
                                    else console.warn(`No function for "${action}"`);
                                }}
                            >
                                {action}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModelItem;
