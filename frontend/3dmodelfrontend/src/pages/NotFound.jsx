import React from 'react';

function NotFound() {
    return (
        <div className="d-flex flex-column" style={{ height: '100vh', overflow: 'hidden' }}>
            {/* 404 Error Content */}
            <div
                className="d-flex flex-column justify-content-center align-items-center flex-grow-1 text-center text-white"
                style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
            >
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-6">
                            {/* OOPS! Text */}
                            <h6 className="text-uppercase fw-bold mb-4 opacity-75" style={{ letterSpacing: '2px' }}>
                                OOPS!
                            </h6>
                           
                            {/* Large 404 */}
                            <h1 className="display-1 fw-bold mb-4" style={{ fontSize: 'clamp(4rem, 15vw, 12rem)', lineHeight: '0.8' }}>
                                404
                            </h1>
                           
                            {/* Error Message */}
                            <p className="lead mb-4" style={{ fontSize: '1.2rem' }}>
                                Sorry we couldn't find that page.
                            </p>
                           
                            {/* Optional: Add a button to go back */}
                            <div className="mt-4">
                                <button
                                    className="btn btn-outline-light btn-lg px-4 py-2"
                                    onClick={() => window.history.back()}
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFound;