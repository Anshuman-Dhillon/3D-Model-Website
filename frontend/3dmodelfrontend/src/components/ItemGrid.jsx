import React from 'react';
import ModelItem from './ModelItem';  // Adjust the path if needed
import "../component design/ItemGrid.css"; // Optional for grid styling

function ItemGrid() {
    const products = [
        {
            id: 1,
            name: "Wireless Headphones",
            description: "Premium quality wireless headphones with noise cancellation",
            price: "$89.99",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
        },
        {
            id: 2,
            name: "Smart Watch",
            description: "Advanced fitness tracking with heart rate monitor",
            price: "$199.99",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop"
        },
        {
            id: 3,
            name: "Laptop Stand",
            description: "Ergonomic aluminum laptop stand for better posture",
            price: "$45.00",
            image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop"
        },
        {
            id: 4,
            name: "Coffee Maker",
            description: "Automatic drip coffee maker with programmable timer",
            price: "$79.99",
            image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop"
        },
        {
            id: 5,
            name: "Bluetooth Speaker",
            description: "Portable waterproof speaker with 12-hour battery life",
            price: "$59.99",
            image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop"
        },
        {
            id: 6,
            name: "Desk Lamp",
            description: "LED desk lamp with adjustable brightness and color temperature",
            price: "$34.99",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
        },
        {
            id: 7,
            name: "Phone Case",
            description: "Protective silicone case with reinforced corners",
            price: "$24.99",
            image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=300&fit=crop"
        },
        {
            id: 8,
            name: "Water Bottle",
            description: "Insulated stainless steel water bottle keeps drinks cold for 24hrs",
            price: "$29.99",
            image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop"
        },
        {
            id: 9,
            name: "Wireless Charger",
            description: "Fast wireless charging pad compatible with all Qi devices",
            price: "$39.99",
            image: "https://images.unsplash.com/photo-1609592806739-b6238ab7deb4?w=400&h=300&fit=crop"
        }
    ];

    return (
        <div className="d-flex justify-content-center py-4">
            <div className="container" style={{ maxWidth: '1200px' }}>
                <div className="row g-4 justify-content-center">
                    {products.map(product => (
                        <div key={product.id} className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center">
                            <ModelItem
                                name={product.name}
                                description={product.description}
                                price={product.price}
                                image={product.image}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ItemGrid;
