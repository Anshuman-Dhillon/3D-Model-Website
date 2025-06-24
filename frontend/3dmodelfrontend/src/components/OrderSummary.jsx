import React from 'react';

function OrderSummary({ cartItems = [], onCheckout }) {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal; // You can add taxes, shipping, etc. here

    return (
        <div className="col-lg-4 col-md-5">
            <div className="card bg-dark text-light border-secondary">
                <div className="card-body">
                    <h4 className="card-title mb-4">Order Summary</h4>
                    
                    {/* Login/Register Section */}
                    <div className="border border-secondary rounded p-3 mb-4">
                        <h6 className="text-center mb-3">Login or Register</h6>
                        <p className="text-muted small text-center mb-3">Earn 1% Cashback in CDKoins</p>
                        
                        <button className="btn btn-success w-100 mb-2">LOGIN</button>
                        <button className="btn btn-outline-light w-100 mb-3">REGISTER</button>
                        
                        <p className="text-center mb-3">or</p>
                        
                        <div className="row">
                            <div className="col-6">
                                <button className="btn btn-light w-100 d-flex align-items-center justify-content-center">
                                    <span className="fw-bold text-dark">G</span>
                                </button>
                            </div>
                            <div className="col-6">
                                <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center">
                                    <span className="fw-bold">P</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Discount and Gift Cards */}
                    <div className="mb-3">
                        <div className="input-group mb-2">
                            <input 
                                type="text" 
                                className="form-control bg-dark text-light border-secondary" 
                                placeholder="Discount Code"
                            />
                            <button className="btn btn-outline-secondary">APPLY</button>
                        </div>
                        <div className="input-group mb-3">
                            <input 
                                type="text" 
                                className="form-control bg-dark text-light border-secondary" 
                                placeholder="Gift Cards"
                            />
                            <button className="btn btn-outline-secondary">APPLY</button>
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="border-top border-secondary pt-3">
                        <div className="d-flex justify-content-between mb-2">
                            <span>Subtotal</span>
                            <span>CA${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-4">
                            <strong>Total</strong>
                            <strong>CA${total.toFixed(2)}</strong>
                        </div>
                        
                        <button 
                            className="btn btn-success w-100 py-2"
                            onClick={onCheckout}
                            disabled={cartItems.length === 0}
                        >
                            GO TO CHECKOUT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderSummary;