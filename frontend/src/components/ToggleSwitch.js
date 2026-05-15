import React from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ checked, onChange, label }) => {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="toggle-input"
      />
      <span className="toggle-slider">
        <span className="toggle-icon">
          {checked ? '🌙' : '☀️'}
        </span>
      </span>
      {label && <span className="toggle-label">{label}</span>}
    </label>
  );
};

export default ToggleSwitch;