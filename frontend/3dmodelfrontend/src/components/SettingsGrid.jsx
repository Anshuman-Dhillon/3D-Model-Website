import React from 'react';
import '../component design/SettingsGrid.css';
import SettingsItem from './SettingsItem';

const settings = [
  { title: 'Account', description: 'Manage login & profile.', icon: '👤', link: '/profile' },
  { title: 'Notifications', description: 'Notification preferences.', icon: '🔔', link: '/settings/notifications' },
  { title: 'Manage Models', description: 'Manage your uploaded assets.', icon: '💾', link: '/mymodels' },
  { title: 'Support', description: 'Get help & support.', icon: '🛠️', link: '/support' },
];

export default function SettingsGrid() {
  return (
    <div className="settings-grid">
      {settings.map((s, i) => (
        <SettingsItem
          key={i}
          title={s.title}
          description={s.description}
          icon={s.icon}
          link={s.link}
        />
      ))}
    </div>
  );
}
