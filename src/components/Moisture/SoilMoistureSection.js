import React, { useState, useEffect, useCallback } from 'react';
import { FaTint } from 'react-icons/fa';
import axios from 'axios';
import '../../styles/moisture.css';

const SoilMoistureSection = ({ isDarkMode }) => {
  const [moistureData, setMoistureData] = useState({
    current: 0,
    trend: 0
  });

  // Convert sensor value (0-3800) to percentage (100-0)
  const convertToPercentage = useCallback((value) => {
    // 3800 = 0%, 0 = 100%
    const percentage = 100 - (value / 3800 * 100);
    return Math.round(percentage);
  }, []);

  const fetchMoistureData = useCallback(async () => {
    try {
      // Fetch all historical data
      const response = await axios.get('https://api.thingspeak.com/channels/2794876/fields/1.json?results=1000');
      const feeds = response.data.feeds;
      
      if (feeds && feeds.length > 0) {
        // Get the most recent value (last entry is the current reading)
        const currentValue = parseFloat(feeds[feeds.length - 1].field1);
        
        // Calculate trend using the last two values
        const previousValue = feeds.length > 1 ? parseFloat(feeds[feeds.length - 2].field1) : currentValue;
        const trendDiff = convertToPercentage(currentValue) - convertToPercentage(previousValue);

        setMoistureData({
          current: convertToPercentage(currentValue),
          trend: trendDiff
        });
      }
    } catch (error) {
      console.error('Error fetching moisture data:', error);
    }
  }, [convertToPercentage]);

  useEffect(() => {
    // Fetch initial data
    fetchMoistureData();

    // Set up interval for periodic updates (every 3 hours)
    const interval = setInterval(fetchMoistureData, 3 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchMoistureData]);

  return (
    <section className="soil-moisture">
      <h2><FaTint /> Soil Moisture Monitoring</h2>
      <div className="moisture-stats-container">
        <div className="moisture-value">
          <span>Current Moisture Level:</span>
          <strong>{moistureData.current}%</strong>
          {moistureData.trend !== 0 && (
            <span className={`trend ${moistureData.trend > 0 ? 'up' : 'down'}`}>
              {moistureData.trend > 0 ? '↑' : '↓'} {Math.abs(moistureData.trend).toFixed(1)}%
            </span>
          )}
        </div>

        <div className="moisture-bar-container">
          <div 
            className={`moisture-bar ${
              moistureData.current < 30 ? 'low' :
              moistureData.current > 70 ? 'high' : 'optimal'
            }`}
            style={{ width: `${moistureData.current}%` }}
          ></div>
        </div>
        <div className="moisture-labels">
          <span>Dry (0%)</span>
          <span>Optimal (50%)</span>
          <span>Wet (100%)</span>
        </div>
      </div>
    </section>
  );
};

export default SoilMoistureSection;