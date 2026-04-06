import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../pages design/SupportPage.css';
import { apiSubmitSupport } from '../api';

function SupportPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: 'general', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const result = await apiSubmitSupport(form.name, form.email, form.message, form.subject);
            if (result.ok) {
                setSubmitted(true);
                setForm({ name: '', email: '', subject: 'general', message: '' });
            } else {
                setError(result.data?.message || 'Failed to send message');
            }
        } catch {
            setError('Network error. Please try again.');
        }
        setSubmitting(false);
    };

    if (submitted) {
        return (
            <div className="support-page">
                <div className="support-success-card">
                    <div className="success-icon">✓</div>
                    <h2>Message Sent!</h2>
                    <p>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                    <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
                        Send Another Message
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="support-page">
            {/* Header */}
            <div className="support-header">
                <h1>How can we help?</h1>
                <p>Get in touch with our team — we're here to assist with anything.</p>
            </div>

            {/* Quick Help Cards */}
            <div className="quick-help-row">
                <div className="quick-help-card">
                    <div className="qh-icon">📧</div>
                    <h6>Email Support</h6>
                    <p>support@3dmodeller.com</p>
                </div>
                <div className="quick-help-card">
                    <div className="qh-icon">💳</div>
                    <h6>Billing Issues</h6>
                    <p>billing@3dmodeller.com</p>
                </div>
                <div className="quick-help-card">
                    <div className="qh-icon">🕐</div>
                    <h6>Response Time</h6>
                    <p>Within 24 hours</p>
                </div>
                <div className="quick-help-card">
                    <div className="qh-icon">📅</div>
                    <h6>Business Hours</h6>
                    <p>Mon–Fri, 9AM–6PM EST</p>
                </div>
            </div>

            {/* Contact Form */}
            <div className="support-form-card">
                <h3>Send us a message</h3>
                <p className="form-subtitle">Fill out the form below and we'll respond as soon as possible.</p>

                {error && <div className="support-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-row-2col">
                        <div className="form-group">
                            <label htmlFor="name">Your Name</label>
                            <input
                                type="text" id="name" name="name"
                                value={form.name} onChange={handleChange}
                                placeholder="John Doe" required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email" id="email" name="email"
                                value={form.email} onChange={handleChange}
                                placeholder="you@example.com" required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="subject">Topic</label>
                        <select
                            id="subject" name="subject"
                            value={form.subject} onChange={handleChange}
                        >
                            <option value="general">General Inquiry</option>
                            <option value="billing">Billing & Payments</option>
                            <option value="technical">Technical Issue</option>
                            <option value="account">Account Help</option>
                            <option value="report">Report a Problem</option>
                            <option value="feedback">Feedback & Suggestions</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Your Message</label>
                        <textarea
                            id="message" name="message" rows="5"
                            value={form.message} onChange={handleChange}
                            placeholder="Describe your issue or question in detail..."
                            required maxLength={3000}
                        />
                        <div className="char-count">{form.message.length} / 3000</div>
                    </div>

                    <button type="submit" className="support-submit-btn" disabled={submitting}>
                        {submitting ? (
                            <><span className="spinner-border spinner-border-sm me-2" /> Sending...</>
                        ) : (
                            <>Send Message <span className="btn-arrow">→</span></>
                        )}
                    </button>
                </form>
            </div>

            {/* FAQ teaser */}
            <div className="faq-section">
                <h4>Frequently Asked Questions</h4>
                <div className="faq-grid">
                    <div className="faq-item">
                        <h6>How do I download a purchased model?</h6>
                        <p>Go to the model page and click "Download". Your purchase is linked to your account permanently.</p>
                    </div>
                    <div className="faq-item">
                        <h6>Can I get a refund?</h6>
                        <p>Refunds are handled case-by-case. Contact billing@3dmodeller.com within 7 days of purchase.</p>
                    </div>
                    <div className="faq-item">
                        <h6>What file formats are supported?</h6>
                        <p>We support OBJ, FBX, GLTF, GLB, STL, and USDZ files up to 100MB.</p>
                    </div>
                    <div className="faq-item">
                        <h6>How do I upload and sell models?</h6>
                        <p>Sign in, click the "+" icon in the navbar, and fill out the listing form with your model file.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SupportPage;
