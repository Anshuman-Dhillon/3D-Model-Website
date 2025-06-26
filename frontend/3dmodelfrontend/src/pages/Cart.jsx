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
        <div style={{ 
            backgroundImage: 'linear-gradient(to right,rgb(34, 39, 79),rgb(35, 48, 88))', 
            minHeight: '100vh', 
            padding: '40px',
            display: 'flex',
            justifyContent: 'center'
        }}>
            {/* Fixed width container to prevent responsive changes */}
            <div style={{ 
                width: '1200px', 
                maxWidth: '100%',
                display: 'flex',
                gap: '30px'
            }}>
                {/* Left Column - Cart Items (Fixed width) */}
                <div style={{ width: '750px', flexShrink: 0 }}>
                    {/* Cart Header */}
                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '30px' 
                    }}>
                        <div style={{ 
                            color: 'white',
                            fontSize: '24px',
                            fontWeight: 'bold'
                        }}>
                            My Cart
                        </div>
                        <button 
                            onClick={addTestItem}
                            style={{
                                backgroundColor: '#358278',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Add Test Item
                        </button>
                    </div>

                    {/* Cart Items Container */}
                    <div style={{ 
                        maxHeight: '80vh', 
                        overflowY: 'auto',
                        paddingRight: '15px'
                    }}>
                        {cartItems.map((item) => (
                            <div 
                                key={item.id}
                                style={{ 
                                    backgroundImage: 'linear-gradient(to right,rgb(62, 65, 81),rgb(35, 61, 77))',
                                    borderRadius: '12px',
                                    border: '1px solid #3A3A4A',
                                    padding: '20px',
                                    marginBottom: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    minHeight: '140px'
                                }}
                            >
                                {/* Game Image - Fixed size */}
                                <div style={{ 
                                    width: '180px',
                                    height: '120px',
                                    backgroundColor: '#3A3A4A',
                                    borderRadius: '8px',
                                    backgroundImage: `url(${item.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    flexShrink: 0,
                                    marginRight: '30px'
                                }}>
                                </div>

                                {/* Game Details - Fixed width */}
                                <div style={{ 
                                    flex: 1,
                                    paddingRight: '20px'
                                }}>
                                    <div style={{ 
                                        color: 'white',
                                        fontSize: '20px',
                                        fontWeight: '500',
                                        marginBottom: '20px'
                                    }}>
                                        {item.name}
                                    </div>
                                    <div 
                                        onClick={() => deleteItem(item.id)}
                                        style={{ 
                                            cursor: 'pointer',
                                            width: '45px',
                                            height: '45px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#8a373f',
                                            borderRadius: '8px',
                                            transition: 'opacity 0.2s'
                                        }}
                                        onMouseOver={(e) => e.target.closest('div').style.opacity = '0.8'}
                                        onMouseOut={(e) => e.target.closest('div').style.opacity = '1'}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 6h18l-1.5 14H4.5L3 6z" fill="white" stroke="white" strokeWidth="1"/>
                                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="white" strokeWidth="1" fill="none"/>
                                            <path d="M10 11v6" stroke="#dc3545" strokeWidth="1"/>
                                            <path d="M14 11v6" stroke="#dc3545" strokeWidth="1"/>
                                            <path d="M5 6h14" stroke="white" strokeWidth="1"/>
                                        </svg>
                                    </div>
                                </div>

                                {/* Cost - Fixed width */}
                                <div style={{ 
                                    width: '100px',
                                    textAlign: 'center',
                                    color: '#358278',
                                    fontSize: '24px',
                                    fontWeight: 'bold'
                                }}>
                                    ${item.cost.toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Order Summary (Fixed width) */}
                <div style={{ width: '420px', flexShrink: 0 }}>
                    <div style={{ position: 'sticky', top: '20px' }}>
                        {/* Order Summary Container */}
                        <div style={{ 
                            backgroundColor: '#1b283d',
                            borderRadius: '12px',
                            border: '1px solid #3A3A4A',
                            padding: '30px'
                        }}>
                            {/* Order Summary Title */}
                            <div style={{ 
                                color: 'white',
                                fontSize: '22px',
                                fontWeight: 'bold',
                                borderBottom: '2px solid #8B7DC7',
                                paddingBottom: '10px',
                                marginBottom: '25px',
                                textAlign: 'center'
                            }}>
                                Order Summary
                            </div>

                            {/* Items Count */}
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                marginBottom: '15px'
                            }}>
                                <span style={{ color: '#B8B8B8', fontSize: '16px' }}>
                                    Items ({cartItems.length})
                                </span>
                                <span style={{ color: 'white', fontSize: '16px' }}>
                                    ${calculateTotal()}
                                </span>
                            </div>

                            {/* Total Section */}
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                borderTop: '1px solid #3A3A4A',
                                paddingTop: '15px',
                                marginBottom: '30px'
                            }}>
                                <span style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
                                    TOTAL
                                </span>
                                <span style={{ color: '#358278', fontSize: '20px', fontWeight: 'bold' }}>
                                    ${calculateTotal()}
                                </span>
                            </div>

                            {/* Payment Buttons */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <button style={{ 
                                    backgroundColor: '#03a63f',
                                    border: '2px solid #03a63f',
                                    color: 'white',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    borderRadius: '8px',
                                    width: '100%',
                                    padding: '15px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#4CAF50'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#03a63f'}
                                >
                                    💳 PAYPAL
                                </button>

                                <button style={{ 
                                    backgroundColor: '#0272c2',
                                    border: '2px solid #0272c2',
                                    color: 'white',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    borderRadius: '8px',
                                    width: '100%',
                                    padding: '15px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.backgroundColor = '#4C63D2'}
                                onMouseOut={(e) => e.target.style.backgroundColor = '#0272c2'}
                                >
                                    🏪 GOOGLE PAY
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;