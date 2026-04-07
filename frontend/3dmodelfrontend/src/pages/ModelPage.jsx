import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../pages design/ModelPage.css";
import { apiGetModelById, apiAddToCart, apiDownloadModel, apiSearchModels, apiGetLikedModels, API_BASE } from '../api';
import { useAuth } from '../context/AuthContext';
import ModelItem from '../components/ModelItem';
import LikeButton from '../components/LikeButton';
import FollowButton from '../components/FollowButton';
import MessageSeller from '../components/MessageSeller';
import ReviewSection from '../components/ReviewSection';
import QASection from '../components/QASection';
import ModelViewer from '../components/ModelViewer';

function ModelPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [model, setModel] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');
    const [initialLiked, setInitialLiked] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [viewerLoading, setViewerLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        apiGetModelById(id).then(data => {
            setModel(data);
            setLoading(false);
            // Fetch related models in same category
            if (data.category) {
                apiSearchModels({ category: data.category, limit: 4 }).then(results => {
                    const models = results?.models || results || [];
                    setRelated(Array.isArray(models) ? models.filter(m => m._id !== id).slice(0, 3) : []);
                });
            }
        }).catch(() => setLoading(false));

        // Check if user has liked this model and follows the seller
        if (user) {
            apiGetLikedModels().then(likedIds => {
                if (Array.isArray(likedIds)) {
                    setInitialLiked(likedIds.some(likedId => likedId === id || likedId.toString() === id));
                }
            });
        }
    }, [id, user]);

    const handleAddToCart = async () => {
        if (!user) { navigate('/login'); return; }
        const result = await apiAddToCart(id);
        setMsg(result.ok ? 'Added to cart!' : (result.data?.message || 'Failed'));
        setTimeout(() => setMsg(''), 3000);
    };

    const handleDownload = async () => {
        if (!user) { navigate('/login'); return; }
        const result = await apiDownloadModel(id);
        if (result.ok && result.data.downloadUrl) {
            window.open(result.data.downloadUrl, '_blank');
        } else {
            setMsg(result.data?.message || 'Download failed');
            setTimeout(() => setMsg(''), 3000);
        }
    };

    const handleViewModel = () => {
        setPreviewData({ previewUrl: `${API_BASE}/models/${id}/preview`, format: model.format });
        setViewerOpen(true);
    };

    if (loading) return <div className="model-page-container"><p style={{ color: '#ccc' }}>Loading...</p></div>;
    if (!model) return <div className="model-page-container"><p style={{ color: '#ccc' }}>Model not found.</p></div>;

    // Build gallery: thumbnail first, then extra images
    const gallery = [];
    if (model.thumbnailUrl) gallery.push(model.thumbnailUrl);
    if (model.imageUrls?.length) gallery.push(...model.imageUrls);

    const prevImage = () => setCurrentImageIndex(i => (i - 1 + gallery.length) % gallery.length);
    const nextImage = () => setCurrentImageIndex(i => (i + 1) % gallery.length);

    return (
        <div className="model-page-container">
            {/* Top Section */}
            <div className="top-section">
                <div className="left-box">
                    {/* Image Carousel */}
                    <div className="model-carousel">
                        <div className="model-carousel-main" style={{
                            backgroundImage: gallery.length ? `url(${gallery[currentImageIndex]})` : 'none',
                            backgroundSize: 'cover', backgroundPosition: 'center',
                        }}>
                            {!gallery.length && <span style={{ color: '#888', fontSize: '4rem' }}>🎮</span>}
                            {gallery.length > 1 && (
                                <>
                                    <button className="carousel-arrow carousel-arrow-left" onClick={prevImage}>‹</button>
                                    <button className="carousel-arrow carousel-arrow-right" onClick={nextImage}>›</button>
                                </>
                            )}
                        </div>
                        {gallery.length > 1 && (
                            <div className="carousel-dots">
                                {gallery.map((_, i) => (
                                    <button
                                        key={i}
                                        className={`carousel-dot ${i === currentImageIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentImageIndex(i)}
                                    />
                                ))}
                            </div>
                        )}
                        {gallery.length > 1 && (
                            <div className="carousel-thumbnails">
                                {gallery.map((url, i) => (
                                    <div
                                        key={i}
                                        className={`carousel-thumb ${i === currentImageIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentImageIndex(i)}
                                        style={{ backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="right-box">
                    <h2>{model.name}</h2>
                    <p>{model.description}</p>
                    <ul>
                        <li><strong>Price:</strong> ${(model.price ?? 0).toFixed(2)}</li>
                        <li><strong>Category:</strong> {model.category}</li>
                        <li><strong>Uploader:</strong>{' '}
                            <span
                                style={{ cursor: 'pointer', color: '#60a5fa', textDecoration: 'underline' }}
                                onClick={() => model.seller && navigate(`/user/${model.seller}`)}
                            >
                                {model.sellerName}
                            </span>
                            {model.seller && <FollowButton targetUserId={model.seller} />}
                        </li>
                        <li><strong>Format:</strong> {model.format}</li>
                        <li><strong>Downloads:</strong> {model.downloads || 0}</li>
                        {model.averageRating > 0 && (
                            <li><strong>Rating:</strong> {'★'.repeat(Math.round(model.averageRating))}{'☆'.repeat(5 - Math.round(model.averageRating))} ({model.reviewCount})</li>
                        )}
                    </ul>

                    {msg && <div style={{ color: msg.includes('Added') ? '#4CAF50' : '#ff6b6b', marginBottom: '10px' }}>{msg}</div>}

                    <div className="d-flex gap-2 align-items-center flex-wrap">
                        <button className="btn-view-model mt-2" onClick={handleViewModel} disabled={viewerLoading}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                            {viewerLoading ? 'Loading...' : 'View Model'}
                        </button>
                        <button className="btn btn-primary mt-2" onClick={handleAddToCart}>
                            Add to Cart
                        </button>
                        <button className="btn btn-success mt-2" onClick={handleDownload}>
                            Download
                        </button>
                        <LikeButton modelId={id} initialLiked={initialLiked} initialLikes={model.likes || 0} />
                    </div>

                    {model.seller && model.seller !== user?.id && (
                        <div style={{ marginTop: '12px' }}>
                            <MessageSeller modelId={id} sellerId={model.seller} sellerName={model.sellerName} />
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews */}
            <div style={{ marginTop: '32px' }}>
                <ReviewSection modelId={id} />
            </div>

            {/* Q&A */}
            <div style={{ marginTop: '24px' }}>
                <QASection modelId={id} />
            </div>

            {/* Related Models */}
            {related.length > 0 && (
                <div className="bottom-box">
                    <h4>Related Models</h4>
                    <div className="related-grid">
                        {related.map((m) => (
                            <ModelItem
                                key={m._id}
                                id={m._id}
                                name={m.name}
                                description={m.description}
                                price={`$${(m.price ?? 0).toFixed(2)}`}
                                image={m.thumbnailUrl || ""}
                                imageUrls={m.imageUrls || []}
                                viewLink={`/modelview/${m._id}`}
                                sellerName={m.sellerName}
                                format={m.format}
                                likes={m.likes}
                                averageRating={m.averageRating}
                                reviewCount={m.reviewCount}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* 3D Model Viewer Modal */}
            {viewerOpen && previewData && (
                <ModelViewer
                    previewUrl={previewData.previewUrl}
                    format={previewData.format}
                    onClose={() => { setViewerOpen(false); setPreviewData(null); }}
                />
            )}
        </div>
    );
}

export default ModelPage;
