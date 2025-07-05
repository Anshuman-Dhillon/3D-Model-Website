import React from 'react';
import '../component design/SettingsItem.css';
import { useNavigate } from "react-router-dom";

export default function SettingsItem({ title, description, icon, link }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <div
      className="settings-item"
      onClick={handleClick}
      style={{ cursor: link ? 'pointer' : 'default' }}
    >
      <div className="icon-circle">{icon}</div>
      <div className="text-content">
        <h3 className="item-title">{title}</h3>
        <p className="item-desc">{description}</p>
      </div>
    </div>
  );
}
