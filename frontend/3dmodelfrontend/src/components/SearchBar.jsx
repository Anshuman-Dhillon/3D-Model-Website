import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../component design/SearchBar.css'; // custom styling like .rounded_box

function SearchBar() {
    const [showFilters, setShowFilters] = useState(false);

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    return (
        <div className='rounded_box d-flex align-items-center px-3'>
            {/* Search input */}
            <input
                type="text"
                className="form-control me-2"
                placeholder="Search models..."
                style={{ maxWidth: '300px' }}
            />

            {/* Filters button */}
            <button className="btn btn-outline-secondary" onClick={toggleFilters}>
                Filters
            </button>

            {/* Filters panel */}
            {showFilters && (
                <div className="filters-panel mt-3 p-3 bg-light border rounded" style={{ position: 'absolute', top: '90px', zIndex: 10 }}>
                    <h6>Filter Models</h6>
                    <div className="mb-2">
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
                        <input type="range" className="form-range" min="0" max="100" />
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchBar;
