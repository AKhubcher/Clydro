import React from 'react';
import { FaWifi, FaLanguage, FaGlobe, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/profilePages.css';

const Settings = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="page-container">
      <button className="back-button" onClick={() => navigate('/')}>
        <FaArrowLeft /> Back to Dashboard
      </button>

      <div className="page-content">
        <div className="page-header">
          <h2>Settings</h2>
        </div>

        <section className="settings-section">
          <h3>Device Connection</h3>
          <div className="wifi-settings">
            <button className="scan-button">
              <FaWifi /> Scan for Sprinkler Systems
            </button>
          </div>
        </section>

        <section className="settings-section">
          <h3>Regional Settings</h3>
          <div className="setting-item">
            <div className="setting-row">
              <FaLanguage />
              <select className="language-select">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-row">
              <FaGlobe />
              <select className="timezone-select">
                <option value="UTC-8">Pacific Time (PT)</option>
                <option value="UTC-5">Eastern Time (ET)</option>
                <option value="UTC+0">UTC</option>
              </select>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <h3>Appearance</h3>
          <div className="setting-item">
            <span>Dark Mode</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={toggleDarkMode}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings; 