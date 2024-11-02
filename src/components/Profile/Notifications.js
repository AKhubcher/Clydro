import React, { useState } from 'react';
import { FaBell, FaEnvelope, FaMobile, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/profilePages.css';

const Notifications = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    lowMoisture: true,
    systemUpdates: true,
    weatherAlerts: true
  });

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="page-container">
      <button className="back-button" onClick={() => navigate('/')}>
        <FaArrowLeft /> Back to Dashboard
      </button>

      <div className="page-content">
        <div className="page-header">
          <h2>Notification Preferences</h2>
        </div>

        <section className="notification-section">
          <h3>Notification Methods</h3>
          <div className="notification-method">
            <div className="method-info">
              <FaEnvelope />
              <span>Email Notifications</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={preferences.email}
                onChange={() => togglePreference('email')}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="notification-method">
            <div className="method-info">
              <FaMobile />
              <span>Push Notifications</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={preferences.push}
                onChange={() => togglePreference('push')}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </section>

        <section className="notification-section">
          <h3>Alert Types</h3>
          <div className="alert-type">
            <div className="alert-info">
              <FaBell />
              <div className="alert-details">
                <span>Low Moisture Alerts</span>
                <p>Get notified when soil moisture is below optimal levels</p>
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={preferences.lowMoisture}
                onChange={() => togglePreference('lowMoisture')}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="alert-type">
            <div className="alert-info">
              <FaBell />
              <div className="alert-details">
                <span>System Updates</span>
                <p>Notifications about system maintenance and updates</p>
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={preferences.systemUpdates}
                onChange={() => togglePreference('systemUpdates')}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="alert-type">
            <div className="alert-info">
              <FaBell />
              <div className="alert-details">
                <span>Weather Alerts</span>
                <p>Get notified about significant weather changes</p>
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={preferences.weatherAlerts}
                onChange={() => togglePreference('weatherAlerts')}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Notifications; 