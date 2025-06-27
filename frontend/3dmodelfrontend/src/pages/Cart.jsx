import React, { useState } from 'react';

function Cart() {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Game Name 1",
            image: "https://via.placeholder.com/150x100/4a90e2/ffffff?text=Game+1",
            cost: 29.99
        },
        {
            id: 2,
            name: "Game Name 2", 
            image: "https://via.placeholder.com/150x100/e74c3c/ffffff?text=Game+2",
            cost: 39.99
        },
        {
            id: 3,
            name: "Game Name 3",
            image: "https://via.placeholder.com/150x100/2ecc71/ffffff?text=Game+3", 
            cost: 19.99
        }
    ]);

    const addTestItem = () => {
        const newItem = {
            id: cartItems.length + 1,
            name: `Game Name ${cartItems.length + 1}`,
            image: `https://via.placeholder.com/150x100/9b59b6/ffffff?text=Game+${cartItems.length + 1}`,
            cost: Math.floor(Math.random() * 50) + 10
        };
        setCartItems([...cartItems, newItem]);
    };

    const deleteItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.cost, 0).toFixed(2);
    };

    return (
        <div style={{ backgroundColor: '#2D1B69', minHeight: '100vh', padding: '20px' }}>
            <div className="container-fluid">
                <div className="row">
                    {/* Left Column - Cart Items */}
                    <div className="col-lg-7 col-md-6">
                        {/* Cart Header */}
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <button 
                                className="btn btn-outline-light px-4 py-2"
                                style={{ 
                                    backgroundColor: 'transparent',
                                    border: '2px solid #8B7DC7',
                                    color: 'white',
                                    fontSize: '18px'
                                }}
                            >
                                Cart
                            </button>
                            <button 
                                className="btn btn-success"
                                onClick={addTestItem}
                            >
                                Add Test Item
                            </button>
                        </div>

                        {/* Cart Items Container with Dynamic Scrolling */}
                        <div 
                            style={{ 
                                maxHeight: '70vh', 
                                overflowY: 'auto',
                                paddingRight: '10px'
                            }}
                        >
                            {cartItems.map((item) => (
                                <div 
                                    key={item.id}
                                    className="mb-3 p-3"
                                    style={{ 
                                        backgroundColor: 'transparent',
                                        border: '2px solid #8B7DC7',
                                        borderRadius: '8px'
                                    }}
                                >
                                    <div className="row align-items-center">
                                        {/* Game Image */}
                                        <div className="col-md-3 col-4">
                                            <div 
                                                style={{ 
                                                    backgroundColor: '#3A3A4A',
                                                    border: '2px solid #8B7DC7',
                                                    borderRadius: '4px',
                                                    height: '100px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundImage: `url(${item.image})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            >
                                                {!item.image && (
                                                    <span style={{ color: 'white', fontSize: '12px' }}>Image</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Game Details */}
                                        <div className="col-md-6 col-5">
                                            <div 
                                                className="mb-2 p-2 text-center"
                                                style={{ 
                                                    backgroundColor: 'transparent',
                                                    border: '2px solid #8B7DC7',
                                                    borderRadius: '4px',
                                                    color: 'white'
                                                }}
                                            >
                                                {item.name}
                                            </div>
                                            <button 
                                                className="btn btn-danger btn-sm"
                                                onClick={() => deleteItem(item.id)}
                                                style={{ 
                                                    backgroundColor: 'transparent',
                                                    border: '2px solid #8B7DC7',
                                                    color: 'white',
                                                    fontSize: '10px',
                                                    padding: '4px 8px'
                                                }}
                                            >
                                                delete item image
                                            </button>
                                        </div>

                                        {/* Cost */}
                                        <div className="col-md-3 col-3">
                                            <div 
                                                className="text-center p-2"
                                                style={{ 
                                                    backgroundColor: 'transparent',
                                                    border: '2px solid #8B7DC7',
                                                    borderRadius: '4px',
                                                    color: 'white'
                                                }}
                                            >
                                                ${item.cost.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="col-lg-5 col-md-6">
                        <div className="h-100">
                            {/* Order Options */}
                            <div 
                                className="mb-4 p-3 text-center"
                                style={{ 
                                    backgroundColor: 'transparent',
                                    border: '2px solid #8B7DC7',
                                    borderRadius: '8px'
                                }}
                            >
                                <button 
                                    className="btn btn-outline-light w-100 py-2"
                                    style={{ 
                                        backgroundColor: 'transparent',
                                        border: '2px solid #8B7DC7',
                                        color: 'white',
                                        fontSize: '16px'
                                    }}
                                >
                                    ORDER OPTIONS
                                </button>
                            </div>

                            {/* Payment Buttons */}
                            <div className="mb-4">
                                <button 
                                    className="btn w-100 mb-3 py-3"
                                    style={{ 
                                        backgroundColor: '#5CB85C',
                                        border: '2px solid #8B7DC7',
                                        color: 'white',
                                        fontSize: '16px',
                                        borderRadius: '8px'
                                    }}
                                >
                                    PAYPAL PAY Image button
                                </button>

                                <button 
                                    className="btn w-100 py-3"
                                    style={{ 
                                        backgroundColor: '#5A67D8',
                                        border: '2px solid #8B7DC7',
                                        color: 'white',
                                        fontSize: '16px',
                                        borderRadius: '8px'
                                    }}
                                >
                                    GOOGLE PAY Image button
                                </button>
                            </div>

                            {/* Total Section */}
                            <div className="row">
                                <div className="col-6">
                                    <div 
                                        className="text-center p-2"
                                        style={{ 
                                            backgroundColor: 'transparent',
                                            border: '2px solid #8B7DC7',
                                            borderRadius: '4px',
                                            color: 'white',
                                            fontSize: '16px'
                                        }}
                                    >
                                        TOTAL
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div 
                                        className="text-center p-2"
                                        style={{ 
                                            backgroundColor: 'transparent',
                                            border: '2px solid #8B7DC7',
                                            borderRadius: '4px',
                                            color: 'white',
                                            fontSize: '16px'
                                        }}
                                    >
                                        ${calculateTotal()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;