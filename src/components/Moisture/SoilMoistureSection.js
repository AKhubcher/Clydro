import React from 'react';
import { FaTint } from 'react-icons/fa';
import '../../styles/moisture.css';

const SoilMoistureSection = ({ soilMoisture, moistureHistory, isDarkMode }) => {
  const stats = {
    average: 45,
    min: 30,
    max: 60
  };

  return (
    <section className="soil-moisture">
      <h2><FaTint /> Soil Moisture Monitoring</h2>
      <div className="moisture-stats-container">
        <div className="moisture-value">
          <span>Current Moisture Level:</span>
          <strong>{Math.round(soilMoisture)}%</strong>
          <span className={`trend down`}>↓ 7.6%</span>
        </div>

        <div className="moisture-bar-container">
          <div 
            className={`moisture-bar ${
              soilMoisture < 30 ? 'low' :
              soilMoisture > 70 ? 'high' : 'optimal'
            }`}
            style={{ width: `${soilMoisture}%` }}
          ></div>
        </div>
        <div className="moisture-labels">
          <span>Dry (30%)</span>
          <span>Optimal (50%)</span>
          <span>Wet (70%)</span>
        </div>
        
        <div className="moisture-stats">
          <div className="stat-item">
            <span className="stat-label">Average</span>
            <span className="stat-value">{stats.average}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Low</span>
            <span className="stat-value">{stats.min}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">High</span>
            <span className="stat-value">{stats.max}%</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SoilMoistureSection; 