import React from 'react';

function OrderSummary({ cartItems = [], totalCost = 0, onCheckout, checkoutMsg, checkingOut }) {
    return (
        <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(100, 116, 139, 0.3)',
            borderRadius: '16px',
            padding: '28px',
        }}>
            <h4 style={{
                color: '#e2e8f0', fontWeight: 700, textAlign: 'center',
                paddingBottom: '16px', marginBottom: '20px',
                borderBottom: '1px solid rgba(100, 116, 139, 0.2)',
            }}>
                Order Summary
            </h4>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#94a3b8', fontSize: '0.95rem' }}>
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${totalCost.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#94a3b8', fontSize: '0.95rem' }}>
                <span>Processing Fee</span>
                <span style={{ color: '#4ade80' }}>Free</span>
            </div>

            <div style={{
                display: 'flex', justifyContent: 'space-between',
                paddingTop: '16px', borderTop: '1px solid rgba(100, 116, 139, 0.2)',
                marginBottom: '24px', fontWeight: 700, color: '#e2e8f0',
            }}>
                <span style={{ fontSize: '1.1rem' }}>Total</span>
                <span style={{ fontSize: '1.3rem', color: '#60a5fa' }}>${totalCost.toFixed(2)}</span>
            </div>

            {checkoutMsg && (
                <div style={{
                    textAlign: 'center', marginBottom: '16px', fontSize: '0.9rem', padding: '8px', borderRadius: '8px',
                    color: checkoutMsg.includes('success') ? '#4ade80' : '#f87171',
                    background: checkoutMsg.includes('success') ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                }}>
                    {checkoutMsg}
                </div>
            )}

            <button
                onClick={onCheckout}
                disabled={cartItems.length === 0 || checkingOut}
                style={{
                    width: '100%', padding: '14px', border: 'none', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    color: '#fff', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                    opacity: (cartItems.length === 0 || checkingOut) ? 0.4 : 1,
                    transition: 'opacity 0.2s',
                }}
            >
                {checkingOut ? 'Redirecting to Stripe...' : 'Proceed to Checkout'}
            </button>
        </div>
    );
}

export default OrderSummary;