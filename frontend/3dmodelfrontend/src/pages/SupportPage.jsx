// src/pages/SupportPage.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../pages design/SupportPage.css';

function SupportPage() {
    return (
        <div className="support-wrapper">
            <div className="container py-5">
                <h1 className="text-center mb-4">Contact Us</h1>
                <div className="row">
                    {/* Contact Info */}
                    <div className="col-md-6 mb-4">
                        <h5>Support Contacts</h5>
                        <ul className="list-unstyled">
                            <li>Email 1: armaanbhatti973@gmail.com</li>
                            <li>Email 2: billing@3dmodeller.com</li>
                            <li>Email 3: help@3dmodeller.com</li>
                        </ul>
                    </div>

                    {/* Contact Form */}
                    <div className="col-md-6">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Your Name</label>
                                <input type="text" className="form-control" id="name" placeholder="Your Name" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email Address</label>
                                <input type="email" className="form-control" id="email" placeholder="yourname@gmail.com" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="message" className="form-label">Your Message</label>
                                <textarea className="form-control" id="message" rows="4" placeholder="Your Request"></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SupportPage;
