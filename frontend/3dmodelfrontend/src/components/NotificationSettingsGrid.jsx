import React, { useState, useEffect } from 'react';
import NotificationSetting from './NotificationSetting';
import { apiGetProfile, apiUpdateNotifications } from '../api';
import '../component design/NotificationSettingsGrid.css';

function NotificationSettingsGrid() {
    const [settings, setSettings] = useState([
        { key: 'email_notifications', label: 'Email Notifications', description: 'Receive notifications by email.', enabled: false },
        { key: 'push_notifications', label: 'Push Notifications', description: 'Receive notifications on your device.', enabled: false },
        { key: 'sms_alerts', label: 'SMS Alerts', description: 'Get SMS alerts for important updates.', enabled: false },
        { key: 'newsletter_subscription', label: 'Newsletter Subscription', description: 'Get monthly newsletters.', enabled: false },
    ]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        apiGetProfile().then(profile => {
            if (profile?.notifications) {
                setSettings(prev => prev.map(s => ({
                    ...s,
                    enabled: !!profile.notifications[s.key]
                })));
            }
        });
    }, []);

    const toggleSetting = async (key) => {
        const updated = settings.map(s =>
            s.key === key ? { ...s, enabled: !s.enabled } : s
        );
        setSettings(updated);

        setSaving(true);
        const body = {};
        updated.forEach(s => { body[s.key] = s.enabled; });
        await apiUpdateNotifications(body);
        setSaving(false);
    };

    return (
        <div className="notification-settings-grid">
            <h2 className="text-center mb-4" style={{ color: '#bed5ed' }}>Notification Settings</h2>
            {settings.map((setting) => (
                <NotificationSetting
                    key={setting.key}
                    label={setting.label}
                    description={setting.description}
                    enabled={setting.enabled}
                    onToggle={() => toggleSetting(setting.key)}
                />
            ))}
            {saving && <p className="text-center text-light mt-2">Saving...</p>}
        </div>
    );
}

export default NotificationSettingsGrid;
