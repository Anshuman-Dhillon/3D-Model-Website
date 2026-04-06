import React from 'react';
import '../component design/Notification.css';

function Notification({ title, message, time }) {
    return (
        <div className="notification-item p-3 mb-2 rounded" style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(100,116,139,0.25)' }}>
            <div className="d-flex justify-content-between align-items-start">
                <h6 className="mb-1" style={{ color: '#e2e8f0' }}>{title}</h6>
                {time && <small style={{ color: '#64748b' }}>{time}</small>}
            </div>
            <p className="mb-0" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{message}</p>
        </div>
    );
}

export default Notification;
