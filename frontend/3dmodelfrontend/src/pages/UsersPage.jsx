import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiDiscoverUsers } from '../api';
import { useAuth } from '../context/AuthContext';
import '../pages design/UsersPage.css';

function UsersPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [sort, setSort] = useState(searchParams.get('sort') || 'popular');
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');

    useEffect(() => {
        setLoading(true);
        const params = { page, limit: 12, sort };
        if (search) params.q = search;

        apiDiscoverUsers(params).then(data => {
            setUsers(data.users || []);
            setTotalPages(data.totalPages || 1);
            setTotalCount(data.totalCount || 0);
            setLoading(false);
        }).catch(() => setLoading(false));

        // Update URL params
        const newParams = new URLSearchParams();
        if (page > 1) newParams.set('page', page);
        if (sort !== 'popular') newParams.set('sort', sort);
        if (search) newParams.set('q', search);
        setSearchParams(newParams, { replace: true });
    }, [page, sort, search]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(searchInput.trim());
        setPage(1);
    };

    const handleSortChange = (newSort) => {
        setSort(newSort);
        setPage(1);
    };

    return (
        <div className="users-page-container">
            <div className="users-page-header">
                <div>
                    <h2>Discover Creators</h2>
                    <p className="users-subtitle">
                        Browse {totalCount} talented 3D artists and creators
                    </p>
                </div>
            </div>

            {/* Search & Sort Controls */}
            <div className="users-controls">
                <form className="users-search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        className="users-search-input"
                    />
                    <button type="submit" className="users-search-btn">Search</button>
                </form>
                <div className="users-sort-tabs">
                    <button
                        className={`sort-tab ${sort === 'popular' ? 'active' : ''}`}
                        onClick={() => handleSortChange('popular')}
                    >
                        Popular
                    </button>
                    <button
                        className={`sort-tab ${sort === 'newest' ? 'active' : ''}`}
                        onClick={() => handleSortChange('newest')}
                    >
                        Newest
                    </button>
                    <button
                        className={`sort-tab ${sort === 'models' ? 'active' : ''}`}
                        onClick={() => handleSortChange('models')}
                    >
                        Most Models
                    </button>
                </div>
            </div>

            {/* Users Grid */}
            {loading ? (
                <div className="users-loading">
                    <div className="users-spinner" />
                    <p>Loading creators...</p>
                </div>
            ) : users.length === 0 ? (
                <div className="users-empty">
                    <span className="users-empty-icon">👥</span>
                    <p>No users found{search ? ` for "${search}"` : ''}.</p>
                </div>
            ) : (
                <div className="users-grid">
                    {users.map(u => (
                        <div
                            key={u.id}
                            className="user-card"
                            onClick={() => navigate(`/user/${u.id}`)}
                        >
                            <div className="user-card-avatar">
                                {u.profilePicture ? (
                                    <img src={u.profilePicture} alt={u.username} />
                                ) : (
                                    <span className="user-card-initial">
                                        {u.username?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="user-card-info">
                                <h4 className="user-card-name">{u.username}</h4>
                                <div className="user-card-stats">
                                    <span>
                                        <strong>{u.followerCount}</strong> followers
                                    </span>
                                    <span className="stat-sep">·</span>
                                    <span>
                                        <strong>{u.modelCount}</strong> models
                                    </span>
                                </div>
                                <p className="user-card-joined">
                                    Joined {new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                            <button
                                className="user-card-view-btn"
                                onClick={(e) => { e.stopPropagation(); navigate(`/user/${u.id}`); }}
                            >
                                View Profile
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="users-pagination">
                    <button
                        className="page-btn"
                        disabled={page <= 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        ← Previous
                    </button>
                    <span className="page-info">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        className="page-btn"
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
}

export default UsersPage;
