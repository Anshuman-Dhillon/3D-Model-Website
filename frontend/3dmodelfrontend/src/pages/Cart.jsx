import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGetCart, apiRemoveFromCart, apiCheckout } from '../api';
import '../pages design/Cart.css';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [loading, setLoading] = useState(true);
    const [checkoutMsg, setCheckoutMsg] = useState('');
    const [checkingOut, setCheckingOut] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        setLoading(true);
        const data = await apiGetCart();
        setCartItems(data.items || []);
        setTotalCost(data.total_cost || 0);
        setLoading(false);
    };

    const deleteItem = async (modelId) => {
        try {
            await apiRemoveFromCart(modelId);
        } catch {
            // Ignore network errors — refetch will show true state
        }
        fetchCart();
    };

    const handleCheckout = async () => {
        setCheckoutMsg('');
        setCheckingOut(true);
        try {
            const result = await apiCheckout();
            if (result.ok && result.data.url) {
                window.location.href = result.data.url;
            } else {
                setCheckoutMsg(result.data?.message || 'Checkout failed');
            }
        } catch {
            setCheckoutMsg('Network error. Please try again.');
        }
        setCheckingOut(false);
    };

    return (
        <div className="cart-page">
            <div className="cart-layout">
                {/* Cart Items */}
                <div className="cart-items-section">
                    <div className="cart-header">
                        <h1 className="cart-title">My Cart</h1>
                        <span className="cart-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
                    </div>

                    {loading ? (
                        <p className="cart-loading">Loading cart...</p>
                    ) : cartItems.length === 0 ? (
                        <div className="cart-empty">
                            <span className="cart-empty-icon">🛒</span>
                            <p>Your cart is empty</p>
                            <button className="cart-browse-btn" onClick={() => navigate('/catalog')}>Browse Models</button>
                        </div>
                    ) : (
                        <div className="cart-items-list">
                            {cartItems.map((item) => (
                                <div key={item._id} className="cart-item">
                                    <div
                                        className="cart-item-image"
                                        style={{
                                            backgroundImage: item.thumbnailUrl ? `url(${item.thumbnailUrl})` : 'none',
                                        }}
                                        onClick={() => navigate(`/modelview/${item._id}`)}
                                    >
                                        {!item.thumbnailUrl && <span className="cart-item-placeholder">🎮</span>}
                                    </div>

                                    <div className="cart-item-info">
                                        <h3 className="cart-item-name" onClick={() => navigate(`/modelview/${item._id}`)}>
                                            {item.name}
                                        </h3>
                                        <p className="cart-item-meta">
                                            {item.format && <span className="cart-item-format">{item.format}</span>}
                                            {item.sellerName && <span>by {item.sellerName}</span>}
                                        </p>
                                    </div>

                                    <div className="cart-item-price">
                                        ${(item.price ?? 0).toFixed(2)}
                                    </div>

                                    <button className="cart-item-remove" onClick={() => deleteItem(item._id)} title="Remove from cart">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div className="cart-summary-section">
                    <div className="cart-summary">
                        <h2 className="cart-summary-title">Order Summary</h2>

                        <div className="cart-summary-rows">
                            <div className="cart-summary-row">
                                <span>Subtotal ({cartItems.length} items)</span>
                                <span>${totalCost.toFixed(2)}</span>
                            </div>
                            <div className="cart-summary-row">
                                <span>Processing Fee</span>
                                <span className="cart-free">Free</span>
                            </div>
                        </div>

                        <div className="cart-summary-total">
                            <span>Total</span>
                            <span className="cart-total-amount">${totalCost.toFixed(2)}</span>
                        </div>

                        {checkoutMsg && (
                            <div className={`cart-checkout-msg ${checkoutMsg.includes('successful') ? 'success' : 'error'}`}>
                                {checkoutMsg}
                            </div>
                        )}

                        <button
                            className="cart-checkout-btn"
                            disabled={cartItems.length === 0 || checkingOut}
                            onClick={handleCheckout}
                        >
                            {checkingOut ? 'Redirecting to Stripe...' : 'Proceed to Checkout'}
                        </button>

                        <div className="cart-secure-note">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
                            <span>Secure checkout powered by Stripe</span>
                        </div>

                        <button className="cart-continue-btn" onClick={() => navigate('/catalog')}>
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
