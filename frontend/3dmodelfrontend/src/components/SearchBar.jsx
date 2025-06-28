import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../component design/SearchBar.css';

function SearchBar() {
    const [showFilters, setShowFilters] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [shakeMin, setShakeMin] = useState(false);
    const [shakeMax, setShakeMax] = useState(false);
    const buttonRef = useRef(null);
    const panelRef = useRef(null);
    const [panelPosition, setPanelPosition] = useState({ left: 0 });

    const toggleFilters = () => setShowFilters(!showFilters);

    useLayoutEffect(() => {
        if (showFilters && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPanelPosition({ left: rect.left });
        }
    }, [showFilters]);

    const validatePrices = (min, max) => {
        const minVal = Number(min);
        const maxVal = Number(max);
        const shakeMinNow = minVal < 0 || (maxVal && minVal > maxVal);
        const shakeMaxNow = maxVal < 0 || (minVal && maxVal < minVal);

        setShakeMin(shakeMinNow);
        setShakeMax(shakeMaxNow);

        if (shakeMinNow) setTimeout(() => setShakeMin(false), 500);
        if (shakeMaxNow) setTimeout(() => setShakeMax(false), 500);
    };

    return (
        <div className="rounded_box d-flex align-items-center px-3 position-relative" style={{ height: '75px' }}>
            {/* Search input */}
            <input
                type="text"
                className="form-control me-2"
                placeholder="Search models..."
                style={{ maxWidth: '300px' }}
            />

            {/* Filters button */}
            <button
                className="btn btn-outline-secondary"
                onClick={toggleFilters}
                ref={buttonRef}
            >
                Filters
            </button>

            {/* Filters panel */}
            {showFilters && (
                <div
                    ref={panelRef}
                    className="filters-panel bg-light border rounded shadow p-3"
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: buttonRef.current?.offsetLeft ?? 0,
                        marginTop: '10px',
                        minWidth: '250px',
                        zIndex: 1000,
                    }}
                >
                    <h6 className="mb-3">Filter Models</h6>

                    <div className="mb-3">
                        <label>Category:</label>
                        <select className="form-select">
                            <option>All</option>
                            <option>Architecture</option>
                            <option>Character</option>
                            <option>Vehicle</option>
                        </select>
                    </div>

                    <div className="mb-2">
                        <label>Price Range:</label>
                        <div className="d-flex gap-2">
                            <input
                                type="number"
                                min={0}
                                className={`form-control ${shakeMin ? 'shake' : ''}`}
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => {
                                    setMinPrice(e.target.value);
                                    validatePrices(e.target.value, maxPrice);
                                }}
                            />
                            <input
                                type="number"
                                min={0}
                                className={`form-control ${shakeMax ? 'shake' : ''}`}
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => {
                                    setMaxPrice(e.target.value);
                                    validatePrices(minPrice, e.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchBar;
