import React from 'react';
import '../component design/SettingsGrid.css';
import SettingsItem from './SettingsItem';

const settings = [
  { title: 'Account',       description: 'Manage login & profile.',        icon: '👤' },
  { title: 'Notifications', description: 'Notification preferences.',      icon: '🔔' },
  { title: 'Manage Models',       description: 'Manage your uploaded assets.',    icon: '💾' },
  { title: 'Support',       description: 'Get help & support.',              icon: '🛠️' },
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
        />
      ))}
    </div>
  );
}
