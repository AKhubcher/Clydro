import React from 'react';
import '../../styles/weather.css';

const WeatherDetail = ({ icon: IconComponent, label, value, unit, trend }) => (
  <div className="weather-detail">
    <div className="weather-detail-content">
      <IconComponent className="weather-icon" />
      <div className="weather-info">
        <div className="weather-label">{label}</div>
        <div className="weather-value">
          {value !== undefined ? value : 'N/A'}{unit}
          {trend && <span className={`trend ${trend < 0 ? 'down' : 'up'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}
          </span>}
        </div>
      </div>
    </div>
  </div>
);

export default WeatherDetail; 