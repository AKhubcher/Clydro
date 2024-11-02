import React from 'react';
import { format } from 'date-fns';
import { FaUmbrella, FaWind } from 'react-icons/fa';
import { getWeatherIcon } from '../../utils/weatherIcons';
import '../../styles/weather.css';

const WeeklyForecast = ({ forecast }) => {
  if (!forecast || !Array.isArray(forecast) || forecast.length === 0) {
    return <div className="weekly-forecast">No forecast data available</div>;
  }

  const currentDayName = format(new Date(), 'EEEE').toUpperCase();
  
  return (
    <div className="weekly-forecast">
      {forecast.map((day, index) => {
        if (!day || !day.dayName) return null;
        
        const isCurrentDay = day.dayName.toUpperCase() === currentDayName;
        
        return (
          <div 
            key={index} 
            className={`forecast-day ${isCurrentDay ? 'current-day' : ''}`}
          >
            <div className="forecast-day-name">
              {day.dayName.toUpperCase()}
            </div>
            <div className="forecast-icon-wrapper">
              {React.createElement(getWeatherIcon(day.condition?.icon || 'question'))}
            </div>
            <div className="forecast-temp">
              <span className="temp-max">{Math.round(day.maxTemp || 0)}°</span>
              <span className="temp-min">{Math.round(day.minTemp || 0)}°</span>
            </div>
            <div className="forecast-details">
              <div className="forecast-rain">
                <FaUmbrella className="forecast-detail-icon" />
                {Math.round(day.precipitationChance || 0)}%
              </div>
              <div className="forecast-wind">
                <FaWind className="forecast-detail-icon" />
                {Math.round(day.maxWindSpeed || 0)} mph
              </div>
            </div>
            <div className="forecast-condition">
              {day.condition?.description || 'No data'}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeeklyForecast; 