import React, { useState } from 'react';
import OrderSummary from '../components/OrderSummary'; // Import the separate OrderSummary component
import "../pages design/Cart.css";

function Cart() {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            title: "SWORD ART ONLINE Fractured Daydream PC",
            price: 45.19,
            quantity: 1,
            image: "https://via.placeholder.com/150x200/4a5568/ffffff?text=SAO+Game"
        },
        {
            id: 2,
            title: "Dune: Awakening PC",
            price: 63.19,
            quantity: 1,
            image: "https://via.placeholder.com/150x200/8b5a3c/ffffff?text=Dune+Game"
        }
    ]);

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity <= 0) {
            removeItem(id);
            return;
        }
        setCartItems(cartItems.map(item => 
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const addItem = (newItem) => {
        const existingItem = cartItems.find(item => item.id === newItem.id);
        if (existingItem) {
            updateQuantity(newItem.id, existingItem.quantity + 1);
        } else {
            setCartItems([...cartItems, { ...newItem, quantity: 1 }]);
        }
    };

    const handleCheckout = () => {
        alert('Proceeding to checkout...');
    };

    return (
        <div className="bg-dark text-light min-vh-100">
            <div className="container-fluid py-4">
                <div className="row">
                    {/* Cart Section */}
                    <div className="col-lg-8 col-md-7">
                        <div className="d-flex align-items-center mb-4">
                            <button className="btn btn-link text-light p-0 me-3 text-decoration-none">
                                <i className="bi bi-arrow-left me-2"></i>Continue Shopping
                            </button>
                        </div>
                        
                        <h2 className="mb-4">My Cart</h2>
                        
                        {cartItems.length === 0 ? (
                            <div className="text-center py-5">
                                <h4 className="text-muted">Your cart is empty</h4>
                                <p className="text-muted">Add some games to get started!</p>
                            </div>
                        ) : (
                            <div className="cart-items" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                {cartItems.map((item) => (
                                    <div key={item.id} className="card bg-dark border-secondary mb-3">
                                        <div className="card-body">
                                            <div className="row align-items-center">
                                                <div className="col-md-2 col-3 mb-3 mb-md-0">
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.title}
                                                        className="img-fluid rounded"
                                                        style={{ maxHeight: '120px', objectFit: 'cover', width: '100%' }}
                                                    />
                                                </div>
                                                <div className="col-md-6 col-9 mb-3 mb-md-0">
                                                    <h5 className="text-light mb-2">{item.title}</h5>
                                                </div>
                                                <div className="col-md-2 col-6 mb-3 mb-md-0">
                                                    <div className="d-flex align-items-center justify-content-center">
                                                        <button 
                                                            className="btn btn-outline-secondary btn-sm"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="mx-3 fw-bold">{item.quantity}</span>
                                                        <button 
                                                            className="btn btn-outline-secondary btn-sm"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="col-md-2 col-6 text-md-end">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <h5 className="text-light mb-0">CA${item.price.toFixed(2)}</h5>
                                                        <button 
                                                            className="btn btn-outline-danger btn-sm ms-2"
                                                            onClick={() => removeItem(item.id)}
                                                            title="Remove item"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Order Summary Section - Using separate component */}
                    <OrderSummary 
                        cartItems={cartItems} 
                        onCheckout={handleCheckout}
                    />
                </div>
            </div>
        </div>
    );
}

export default Cart;