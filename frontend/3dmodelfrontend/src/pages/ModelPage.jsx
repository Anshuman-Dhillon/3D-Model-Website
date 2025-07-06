import React from 'react';
import "../pages design/ModelPage.css";
import ModelItem from '../components/ModelItem'; // Adjust path if needed

function ModelPage() {
    const relatedModels = [
        {
            name: 'Space Drone',
            description: 'A futuristic drone used in zero-gravity missions.',
            price: '$12.99',
            image: 'https://via.placeholder.com/300x180?text=Space+Drone'
        },
        {
            name: 'Fantasy Castle',
            description: 'A high-poly medieval castle with towers and walls.',
            price: '$34.50',
            image: 'https://via.placeholder.com/300x180?text=Fantasy+Castle'
        },
        {
            name: 'Sci-Fi Crate',
            description: 'A modular sci-fi crate for space stations.',
            price: '$6.99',
            image: 'https://via.placeholder.com/300x180?text=Sci-Fi+Crate'
        }
    ];

    return (
        <div className="model-page-container">
            {/* Top Section */}
            <div className="top-section">
                {/* Left Box */}
                <div className="left-box">
                    <div className="model-preview"></div>
                    <div className="thumbnail-scroll">
                        <div className="thumbnail"></div>
                        <div className="thumbnail"></div>
                        <div className="thumbnail"></div>
                    </div>
                </div>

                {/* Right Box */}
                <div className="right-box">
                    <h2>Sci-Fi Spaceship</h2>
                    <p>
                        A detailed 3D spaceship model perfect for animation and gaming. Includes .obj and .gltf formats.
                    </p>
                    <ul>
                        <li><strong>Price:</strong> $19.99</li>
                        <li><strong>Uploader:</strong> Armaan Bhatti</li>
                        <li><strong>Formats:</strong> .obj, .fbx, .gltf</li>
                    </ul>
                    <button className="btn btn-primary mt-2">Buy Now</button>
                </div>
            </div>

            {/* Related Models Section */}
            <div className="bottom-box">
                <h4>Related Models</h4>
                <div className="related-grid">
                    {relatedModels.map((model, index) => (
                        <ModelItem
                            key={index}
                            name={model.name}
                            description={model.description}
                            price={model.price}
                            image={model.image}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ModelPage;
