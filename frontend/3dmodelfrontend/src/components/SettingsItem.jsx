import React from 'react';
import '../component design/SettingsItem.css';

export default function SettingsItem({ title, description, icon }) {
  return (
    <div className="settings-item">
      <div className="icon-circle">{icon}</div>
      <div className="text-content">
        <h3 className="item-title">{title}</h3>
        <p className="item-desc">{description}</p>
      </div>
    </div>
  );
}
