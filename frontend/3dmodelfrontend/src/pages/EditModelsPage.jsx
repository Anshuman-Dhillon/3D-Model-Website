import React, { useRef, useEffect, useState } from 'react';
import ItemGrid from '../components/ItemGrid';

function EditModelsPage() {
    const containerRef = useRef(null);
    const [atBottom, setAtBottom] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const containerBottom = containerRef.current.getBoundingClientRect().bottom;
            const windowHeight = window.innerHeight;
            setAtBottom(containerBottom <= windowHeight + 20); // 20px buffer
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
                <div
                    className="container py-4"
                    ref={containerRef}
                    style={{ position: 'relative', minHeight: '100vh' }}
                >
                    <h1 className="text-center mb-5" style={{ color: '#bed5ed' }}>
                        My Models
                    </h1>

                    <ItemGrid actions={["Edit", "Delete"]} />

                    {/* Floating Add New Model button */}
                    <button
  onClick={() => console.log("Add New Model")}
  className="btn"
  style={{
    position: 'fixed',
    bottom: atBottom ? '120px' : '60px',
    right: '60px',
    zIndex: 1000,
    borderRadius: '50%',
    backgroundColor: '#3092bf',
    color: '#000',
    border: '1px solid #000',
    width: '56px',
    height: '56px',
    fontSize: '2rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,           // explicitly zero padding
    lineHeight: 1,        // remove extra line height
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, color 0.3s ease, bottom 0.3s ease',
  }}
  
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = '#1d6fa5';  // darker blue on hover
    e.currentTarget.style.color = '#fff';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = '#3092bf';
    e.currentTarget.style.color = '#000';
  }}
>
  +
</button>




        </div>
    );
}

export default EditModelsPage;
