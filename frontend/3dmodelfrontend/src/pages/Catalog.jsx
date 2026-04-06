import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ItemGrid from '../components/ItemGrid';
import SearchBar from '../components/SearchBar';
import { apiSearchModels } from '../api';

function Catalog() {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchParams] = useSearchParams();
    const initialQ = searchParams.get('q') || '';
    const initialSort = searchParams.get('sort') || '';
    const initialCategory = searchParams.get('category') || 'All';
    const [filters, setFilters] = useState({ q: initialQ, category: initialCategory, format: 'All', minPrice: '', maxPrice: '', sort: initialSort, minRating: '' });

    const fetchModels = async (params, pageNum = 1) => {
        setLoading(true);
        try {
            const clean = { page: pageNum, limit: 12 };
            if (params.q) clean.q = params.q;
            if (params.category && params.category !== 'All') clean.category = params.category;
            if (params.format && params.format !== 'All') clean.format = params.format;
            if (params.minPrice) clean.minPrice = params.minPrice;
            if (params.maxPrice) clean.maxPrice = params.maxPrice;
            if (params.sort) clean.sort = params.sort;
            if (params.minRating) clean.minRating = params.minRating;
            const data = await apiSearchModels(clean);
            setModels(Array.isArray(data.models) ? data.models : (Array.isArray(data) ? data : []));
            setTotalPages(data.totalPages || 1);
            setPage(data.page || 1);
        } catch {
            setModels([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchModels(filters, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = (newFilters) => {
        setFilters(newFilters);
        fetchModels(newFilters, 1);
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        fetchModels(filters, newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div>
            <SearchBar onSearch={handleSearch} initialQuery={initialQ} initialFilters={{ category: initialCategory, sort: initialSort }} />
            <div className="container py-4">
                <h1 className="text-center mb-5" style={{ color: '#bed5ed' }}>Marketplace</h1>
                {loading ? (
                    <p className="text-center text-light">Loading models...</p>
                ) : (
                    <>
                        <ItemGrid models={models} />
                        {totalPages > 1 && (
                            <nav className="d-flex justify-content-center mt-4">
                                <ul className="pagination">
                                    <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(page - 1)}
                                            style={{ background: 'rgba(30,41,59,0.8)', color: '#e2e8f0', border: '1px solid rgba(100,116,139,0.3)' }}>
                                            Previous
                                        </button>
                                    </li>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(p => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
                                        .map((p, idx, arr) => (
                                            <React.Fragment key={p}>
                                                {idx > 0 && arr[idx - 1] !== p - 1 && (
                                                    <li className="page-item disabled">
                                                        <span className="page-link" style={{ background: 'rgba(30,41,59,0.8)', color: '#64748b', border: '1px solid rgba(100,116,139,0.3)' }}>...</span>
                                                    </li>
                                                )}
                                                <li className={`page-item ${p === page ? 'active' : ''}`}>
                                                    <button className="page-link" onClick={() => handlePageChange(p)}
                                                        style={p === page
                                                            ? { background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', border: 'none' }
                                                            : { background: 'rgba(30,41,59,0.8)', color: '#e2e8f0', border: '1px solid rgba(100,116,139,0.3)' }}>
                                                        {p}
                                                    </button>
                                                </li>
                                            </React.Fragment>
                                        ))}
                                    <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(page + 1)}
                                            style={{ background: 'rgba(30,41,59,0.8)', color: '#e2e8f0', border: '1px solid rgba(100,116,139,0.3)' }}>
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Catalog;