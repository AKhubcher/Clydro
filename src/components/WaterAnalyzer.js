import React from 'react';
import { FaWater, FaCloud, FaTint, FaThermometerHalf } from 'react-icons/fa';
import '../styles/waterAnalyzer.css';

const WaterAnalyzer = ({ 
  weather, 
  soilMoisture,
  isSprinklerOn,
  setIsSprinklerOn,
  isAutoMode,
  currentDayStats
}) => {
  const analyzeWateringNeed = () => {
    // Use forecast data for rain chance
    const isRainy = currentDayStats?.precipitationChance > 30;
    const isHotAndDry = currentDayStats?.maxTemp > 85 && weather.humidity < 40;
    const isSoilDry = soilMoisture < 35;
    
    const needsWatering = (isSoilDry || isHotAndDry) && !isRainy;
    
    return {
      needsWatering,
      reasons: {
        moisture: isSoilDry ? 'Soil moisture is low' : 'Soil moisture is adequate',
        weather: isRainy ? 'Rain is expected' : isHotAndDry ? 'Hot and dry conditions' : 'Weather conditions are moderate',
      }
    };
  };

  const analysis = analyzeWateringNeed();

  return (
    <section className="water-analyzer">
      <h2><FaWater /> Water Analyzer</h2>
      <div className="analyzer-content">
        <div className="current-conditions">
          <div className="condition-item">
            <FaTint />
            <span>Soil Moisture:</span>
            <span className="value">{soilMoisture}%</span>
          </div>
          <div className="condition-item">
            <FaThermometerHalf />
            <span>Temperature:</span>
            <span className="value">{Math.round(currentDayStats?.maxTemp || weather.temperature)}°F</span>
          </div>
          <div className="condition-item">
            <FaCloud />
            <span>Rain Chance:</span>
            <span className="value">{Math.round(currentDayStats?.precipitationChance || 0)}%</span>
          </div>
        </div>

        <div className="analysis-result">
          <div className="recommendation">
            <h3>Watering Recommendation</h3>
            <div className={`status-badge ${analysis.needsWatering ? 'needs-water' : 'no-water'}`}>
              {analysis.needsWatering ? 'Watering Recommended' : 'No Watering Needed'}
            </div>
          </div>
          
          <div className="analysis-reasons">
            <div className="reason-item">
              <FaTint />
              <span>{analysis.reasons.moisture}</span>
            </div>
            <div className="reason-item">
              <FaCloud />
              <span>{analysis.reasons.weather}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaterAnalyzer; 