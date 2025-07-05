import React, { useState } from 'react';
import NotificationSetting from './NotificationSetting';
import '../component design/NotificationSettingsGrid.css';

function NotificationSettingsGrid() {
    const [settings, setSettings] = useState([
        { id: 1, label: 'Email Notifications', description: 'Receive notifications by email.', enabled: true },
        { id: 2, label: 'Push Notifications', description: 'Receive notifications on your device.', enabled: false },
        { id: 3, label: 'SMS Alerts', description: 'Get SMS alerts for important updates.', enabled: false },
        { id: 4, label: 'Newsletter Subscription', description: 'Get monthly newsletters.', enabled: true },
    ]);

    const toggleSetting = (id) => {
        setSettings((prev) =>
            prev.map((setting) =>
                setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
            )
        );
    };

    return (
        <div className="notification-settings-grid">
            {settings.map((setting) => (
                <NotificationSetting
                    key={setting.id}
                    label={setting.label}
                    description={setting.description}
                    enabled={setting.enabled}
                    onToggle={() => toggleSetting(setting.id)}
                />
            ))}
        </div>
    );
}

export default NotificationSettingsGrid;
