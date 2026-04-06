import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../component design/SearchBar.css';

const categories = ['All', 'Sci-Fi', 'Fantasy', 'Architecture', 'Weapons', 'Vehicles'];
const formats = ['All', 'OBJ', 'FBX', 'GLTF', 'GLB', 'STL', 'USDZ'];
const sortOptions = [
    { value: '', label: 'Newest' },
    { value: 'price_asc', label: 'Price: Low → High' },
    { value: 'price_desc', label: 'Price: High → Low' },
    { value: 'popular', label: 'Most Downloaded' },
    { value: 'top_rated', label: 'Top Rated' },
    { value: 'most_liked', label: 'Most Liked' },
];

function SearchBar({ onSearch, initialQuery = '', initialFilters = {} }) {
    const [query, setQuery] = useState(initialQuery);
    const [category, setCategory] = useState(initialFilters.category || 'All');
    const [format, setFormat] = useState(initialFilters.format || 'All');
    const [minPrice, setMinPrice] = useState(initialFilters.minPrice || '');
    const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || '');
    const [sort, setSort] = useState(initialFilters.sort || '');
    const [minRating, setMinRating] = useState(initialFilters.minRating || '');
    const [showFilters, setShowFilters] = useState(false);

    const buildFilters = () => ({ q: query, category, format, minPrice, maxPrice, sort, minRating });

    const handleSearch = (e) => {
        e?.preventDefault();
        onSearch?.(buildFilters());
    };

    const handleClear = () => {
        setQuery('');
        setCategory('All');
        setFormat('All');
        setMinPrice('');
        setMaxPrice('');
        setSort('');
        setMinRating('');
        onSearch?.({ q: '', category: 'All', format: 'All', minPrice: '', maxPrice: '', sort: '', minRating: '' });
    };

    const hasActiveFilters = category !== 'All' || format !== 'All' || minPrice || maxPrice || sort || minRating;

    return (
        <div className="search-bar-wrapper">
            {/* Top row: search + filter toggle */}
            <div className="search-top-row">
                <form className="search-input-group" onSubmit={handleSearch}>
                    <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search models by name, description..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit" className="search-go-btn">Search</button>
                </form>

                <button
                    className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
                        <circle cx="6" cy="6" r="2" fill="currentColor"/><circle cx="10" cy="12" r="2" fill="currentColor"/><circle cx="14" cy="18" r="2" fill="currentColor"/>
                    </svg>
                    Filters
                    {hasActiveFilters && <span className="filter-badge" />}
                </button>
            </div>

            {/* Filter panel */}
            {showFilters && (
                <div className="filter-panel">
                    <div className="filter-grid">
                        {/* Category */}
                        <div className="filter-group">
                            <label>Category</label>
                            <div className="chip-group">
                                {categories.map(c => (
                                    <button
                                        key={c}
                                        className={`filter-chip ${category === c ? 'active' : ''}`}
                                        onClick={() => { setCategory(c); onSearch?.({ ...buildFilters(), category: c }); }}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Format */}
                        <div className="filter-group">
                            <label>File Format</label>
                            <div className="chip-group">
                                {formats.map(f => (
                                    <button
                                        key={f}
                                        className={`filter-chip ${format === f ? 'active' : ''}`}
                                        onClick={() => { setFormat(f); onSearch?.({ ...buildFilters(), format: f }); }}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price + Rating + Sort row */}
                        <div className="filter-controls-row">
                            <div className="filter-control">
                                <label>Price Range</label>
                                <div className="price-inputs">
                                    <input
                                        type="number" min={0} placeholder="Min $"
                                        value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                                    />
                                    <span className="price-sep">–</span>
                                    <input
                                        type="number" min={0} placeholder="Max $"
                                        value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="filter-control">
                                <label>Min Rating</label>
                                <div className="rating-selector">
                                    {[0, 1, 2, 3, 4, 5].map(r => (
                                        <button
                                            key={r}
                                            className={`rating-btn ${minRating === String(r) || (r === 0 && !minRating) ? 'active' : ''}`}
                                            onClick={() => { const val = r === 0 ? '' : String(r); setMinRating(val); onSearch?.({ ...buildFilters(), minRating: val }); }}
                                        >
                                            {r === 0 ? 'Any' : '★'.repeat(r) + '+'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-control">
                                <label>Sort By</label>
                                <select value={sort} onChange={(e) => { setSort(e.target.value); onSearch?.({ ...buildFilters(), sort: e.target.value }); }}>
                                    {sortOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="filter-actions">
                        <button className="apply-btn" onClick={handleSearch}>Apply Filters</button>
                        {hasActiveFilters && (
                            <button className="clear-btn" onClick={handleClear}>Clear All</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchBar;
