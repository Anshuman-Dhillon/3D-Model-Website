import React from 'react';
import ModelItem from './ModelItem';  
import "../component design/ItemGrid.css"; 

function ItemGrid({actions = ["Add to Cart"]}) {
    const products = [
        {
            id: 1,
            name: "3D Model 1 image test",
            description: "3d model description",
            price: "$9.99",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
        },
        {
            id: 2,
            name: "3D Model 2",
            description: "3d model description",
            price: "$12.99",
            image: ""
        },
        {
            id: 3,
            name: "3D Model 3",
            description: "3d model description",
            price: "$8.99",
            image: ""
        },
        {
            id: 4,
            name: "3D Model 4",
            description: "3d model description",
            price: "$15.99",
            image: ""
        },
        {
            id: 5,
            name: "3D Model 5",
            description: "3d model description",
            price: "$11.99",
            image: ""
        },
        {
            id: 6,
            name: "3D Model 6",
            description: "3d model description",
            price: "$7.99",
            image: ""
        },
        {
            id: 7,
            name: "3D Model 7",
            description: "3d model description",
            price: "$13.99",
            image: ""
        },
        {
            id: 8,
            name: "3D Model 8",
            description: "3d model description",
            price: "$10.99",
            image: ""
        },
        {
            id: 9,
            name: "3D Model 9",
            description: "3d model description",
            price: "$14.99",
            image: ""
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
                                viewLink={"/modelview"}
                                actions={actions}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ItemGrid;