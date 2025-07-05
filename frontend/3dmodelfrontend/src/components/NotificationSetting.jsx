import React from 'react';
import '../component design/NotificationSetting.css';

function NotificationSetting({ label, description, enabled, onToggle }) {
    return (
        <div className="notification-setting">
            <div className="setting-text">
                <h5>{label}</h5>
                <p>{description}</p>
            </div>
            <label className="switch">
                <input type="checkbox" checked={enabled} onChange={onToggle} />
                <span className="slider round"></span>
            </label>
        </div>
    );
}

export default NotificationSetting;
