import React, { useState, useEffect } from 'react';
import { 
  FaCloud, FaTint, FaSun, FaWind, 
  FaThermometerHalf, FaUmbrella, FaMoon,
  FaBolt, FaSnowflake, FaSmog, FaCloudSun,
  FaCog, FaStopwatch
} from 'react-icons/fa';
import './styles/index.css';
import { fetchWeatherData, fetchMoistureData } from './services/weatherService';

const getWeatherIcon = (iconName) => {
  const icons = {
    'sun': FaSun,
    'cloud': FaCloud,
    'cloud-sun': FaCloudSun,
    'cloud-rain': FaTint,
    'cloud-showers-heavy': FaTint,
    'bolt': FaBolt,
    'snowflake': FaSnowflake,
    'smog': FaSmog,
    'cloud-meatball': FaBolt,
    'question': FaCloudSun
  };
  return icons[iconName] || icons['question'];
};

const WeatherDetail = ({ icon: IconComponent, label, value, unit, trend }) => (
  <div className="weather-detail">
    <IconComponent className="weather-icon" />
    <div>
      <div className="weather-label">{label}</div>
      <div className="weather-value">
        {value}{unit}
        {trend && <span className={`trend ${trend > 0 ? 'up' : 'down'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}
        </span>}
      </div>
    </div>
  </div>
);

const WeeklyForecast = ({ forecast }) => {
  const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Create a fixed order of days starting with Monday
  const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Sort and filter forecast to ensure one entry per day
  const uniqueForecast = dayOrder.map(targetDay => {
    return forecast.find(day => getDayName(day.date) === targetDay);
  }).filter(Boolean); // Remove any undefined entries

  return (
    <div className="weekly-forecast">
      {uniqueForecast.map((day, index) => (
        <div key={index} className="forecast-day">
          <div className="forecast-day-name">{getDayName(day.date)}</div>
          <div className="forecast-icon-wrapper">
            {React.createElement(getWeatherIcon(day.condition.icon))}
          </div>
          <div className="forecast-temp">
            <span className="temp-max">{Math.round(day.maxTemp)}°</span>
            <span className="temp-min">{Math.round(day.minTemp)}°</span>
          </div>
          <div className="forecast-details">
            <div className="forecast-rain">
              <FaUmbrella className="forecast-detail-icon" />
              {Math.round(day.precipitationChance)}%
            </div>
            <div className="forecast-wind">
              <FaWind className="forecast-detail-icon" />
              {Math.round(day.windSpeed)} mph
            </div>
          </div>
          <div className="forecast-condition">
            {day.condition.description}
          </div>
        </div>
      ))}
    </div>
  );
};

const RuleEditor = ({ rule, updateRule, removeRule }) => (
  <div className="rule-editor">
    <div className="rule-description">
      When <select
        value={rule.condition}
        onChange={(e) => updateRule('condition', e.target.value)}
      >
        <option value="moisture">Soil Moisture</option>
        <option value="temperature">Temperature</option>
        <option value="rain">Rain Chance</option>
        <option value="uv">UV Index</option>
      </select>
      is <select
        value={rule.operator}
        onChange={(e) => updateRule('operator', e.target.value)}
      >
        <option value="below">Below</option>
        <option value="above">Above</option>
      </select>
      <input
        type="number"
        value={rule.value}
        onChange={(e) => updateRule('value', parseInt(e.target.value))}
      />
      , <select
        value={rule.action}
        onChange={(e) => updateRule('action', e.target.value)}
      >
        <option value="start">Start</option>
        <option value="stop">Stop</option>
      </select>
      watering
      {rule.action === 'start' && (
        <> for <input
          type="number"
          value={rule.duration}
          onChange={(e) => updateRule('duration', parseInt(e.target.value))}
        /> minutes</>
      )}
    </div>
    <button className="remove-rule" onClick={removeRule}>Remove Rule</button>
  </div>
);

const AutomationRules = ({ rules, setRules }) => {
  const addRule = () => {
    setRules([...rules, {
      condition: 'moisture',
      operator: 'below',
      value: 30,
      action: 'start',
      duration: 30
    }]);
  };

  const updateRule = (index, field, value) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const removeRule = (index) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  return (
    <div className="automation-rules">
      {rules.map((rule, index) => (
        <RuleEditor
          key={index}
          rule={rule}
          updateRule={(field, value) => updateRule(index, field, value)}
          removeRule={() => removeRule(index)}
        />
      ))}
      <button className="add-rule" onClick={addRule}>Add Rule</button>
    </div>
  );
};

const ScheduleEditor = ({ schedule, setSchedule }) => {
  const addScheduleItem = () => {
    setSchedule([...schedule, {
      day: 'Monday',
      time: '06:00',
      duration: 30,
      adjustForWeather: true
    }]);
  };

  const updateScheduleItem = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setSchedule(newSchedule);
  };

  const removeScheduleItem = (index) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  return (
    <div className="schedule-editor">
      {schedule.map((item, index) => (
        <div key={index} className="schedule-item-editor">
          <div className="schedule-field">
            <label>Day</label>
            <select
              value={item.day}
              onChange={(e) => updateScheduleItem(index, 'day', e.target.value)}
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <div className="schedule-controls">
              <label className="weather-adjust-toggle">
                <input
                  type="checkbox"
                  checked={item.adjustForWeather}
                  onChange={(e) => updateScheduleItem(index, 'adjustForWeather', e.target.checked)}
                />
                Adjust for weather
              </label>
              <button 
                className="remove-rule"
                onClick={() => removeScheduleItem(index)}
              >
                Remove
              </button>
            </div>
          </div>
          
          <div className="schedule-field">
            <label>Time</label>
            <input
              type="time"
              value={item.time}
              onChange={(e) => updateScheduleItem(index, 'time', e.target.value)}
            />
          </div>
          
          <div className="schedule-field">
            <label>Duration (minutes)</label>
            <input
              type="number"
              min="1"
              max="120"
              value={item.duration}
              onChange={(e) => updateScheduleItem(index, 'duration', parseInt(e.target.value))}
            />
          </div>
        </div>
      ))}
      <button className="add-rule" onClick={addScheduleItem}>
        + Add Schedule
      </button>
    </div>
  );
};

const SoilMoistureSection = ({ soilMoisture, moistureHistory, isDarkMode }) => {
  // Generate sample data if no history exists
  const sampleData = Array.from({ length: 24 }, (_, i) => ({
    timestamp: Date.now() - (23 - i) * 3600000,
    value: 45 + Math.sin(i / 4) * 15 + (Math.random() - 0.5) * 5
  }));

  const data = moistureHistory.length > 0 ? moistureHistory : sampleData;

  const stats = {
    average: Math.round(data.reduce((acc, curr) => acc + curr.value, 0) / data.length),
    min: Math.round(Math.min(...data.map(d => d.value))),
    max: Math.round(Math.max(...data.map(d => d.value))),
    trend: Math.round((data[data.length - 1].value - data[0].value) * 10) / 10
  };

  return (
    <section className="soil-moisture">
      <h2><FaTint /> Soil Moisture Monitoring</h2>
      <div className="moisture-display">
        <div className="moisture-value">
          <span>Current Moisture Level:</span>
          <strong>{Math.round(soilMoisture)}%</strong>
          <span className={`trend ${stats.trend >= 0 ? 'up' : 'down'}`}>
            {stats.trend >= 0 ? '↑' : '↓'} {Math.abs(stats.trend)}%
          </span>
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
            <span className="stat-label">24h Average</span>
            <span className="stat-value">{stats.average}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">24h Low</span>
            <span className="stat-value">{stats.min}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">24h High</span>
            <span className="stat-value">{stats.max}%</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const SchedulingAndRules = ({ automationRules, schedule, isAutoMode, setIsConfigureOpen, setConfigureTab }) => {
  const [activeTab, setActiveTab] = useState('schedule');

  return (
    <section className="scheduling-rules">
      <div className="tabs-container">
        <div className="tabs-header">
          <button 
            className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <FaStopwatch /> Watering Schedule
          </button>
          <button 
            className={`tab-button ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            <FaCog /> Automation Rules
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'schedule' && (
            <div className="schedule-content">
              <div className="content-header">
                <h3>Active Schedule</h3>
                {!isAutoMode && (
                  <button 
                    className="configure-button"
                    onClick={() => {
                      setConfigureTab('schedule');
                      setIsConfigureOpen(true);
                    }}
                  >
                    Configure Schedule
                  </button>
                )}
              </div>
              <div className="schedule-grid">
                {schedule.map((item, index) => (
                  <div key={index} className="schedule-item">
                    <div className="schedule-time">
                      <div className="time-info">
                        <div className="day-container">
                          <FaStopwatch className="schedule-icon" />
                          <span className="day">{item.day}</span>
                        </div>
                        <span className="time">
                          {new Date(`2000-01-01 ${item.time}`).toLocaleTimeString([], {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </div>
                      <span className="duration">{item.duration}min</span>
                    </div>
                    {item.adjustForWeather && (
                      <div className="weather-adjusted">
                        <FaCloud className="weather-icon" />
                        Weather Adjusted
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="rules-content">
              <div className="content-header">
                <h3>Active Rules</h3>
                {!isAutoMode && (
                  <button 
                    className="configure-button"
                    onClick={() => {
                      setConfigureTab('rules');
                      setIsConfigureOpen(true);
                    }}
                  >
                    Configure Rules
                  </button>
                )}
              </div>
              <div className="rules-grid">
                {automationRules.map((rule, index) => (
                  <div key={index} className="rule-item">
                    <div className="rule-details">
                      <div className="rule-condition">
                        <div className="rule-icon">
                          {rule.condition === 'moisture' ? <FaTint /> :
                           rule.condition === 'temperature' ? <FaThermometerHalf /> :
                           rule.condition === 'rain' ? <FaUmbrella /> : <FaSun />}
                        </div>
                        When {rule.condition} is {rule.operator} {rule.value}
                        {rule.condition === 'temperature' ? '°F' : '%'}
                      </div>
                      <div className="rule-action" data-action={rule.action}>
                        {rule.action === 'start' 
                          ? `Water for ${rule.duration}min` 
                          : 'Stop watering'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const SprinklerDashboard = () => {
  const [weather, setWeather] = useState({
    temperature: 75,
    humidity: 65,
    conditions: 'Partly Cloudy',
    precipitation: 20,
    windSpeed: 8,
    uvIndex: 6,
    pressure: 1015,
    visibility: 10
  });
  
  const [soilMoisture, setSoilMoisture] = useState(45);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [isSprinklerOn, setIsSprinklerOn] = useState(false);
  const [automationRules, setAutomationRules] = useState([
    {
      condition: 'moisture',
      operator: 'below',
      value: 30,
      action: 'start',
      duration: 30
    },
    {
      condition: 'rain',
      operator: 'above',
      value: 40,
      action: 'stop'
    }
  ]);
  
  const [schedule, setSchedule] = useState([
    {
      day: 'Monday',
      time: '06:00',
      duration: 30,
      adjustForWeather: true
    }
  ]);

  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [configureTab, setConfigureTab] = useState('schedule'); // 'schedule' or 'rules'
  const [tempSchedule, setTempSchedule] = useState([]);
  const [tempRules, setTempRules] = useState([]);
  const [isAutoDeciding, setIsAutoDeciding] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [moistureHistory, setMoistureHistory] = useState([]);

  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get your location. Using default location.');
          // Use a default location (e.g., New York City)
          setLocation({
            latitude: 40.7128,
            longitude: -74.0060
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
      // Use default location
      setLocation({
        latitude: 40.7128,
        longitude: -74.0060
      });
    }
  }, []);

  useEffect(() => {
    setTempSchedule(schedule);
    setTempRules(automationRules);
  }, [isConfigureOpen, schedule, automationRules]);

  // Simulate weather updates
  useEffect(() => {
    const fetchData = async () => {
      if (location) {
        const weatherData = await fetchWeatherData(
          location.latitude,
          location.longitude
        );
        
        if (weatherData) {
          // Update current weather
          setWeather({
            temperature: weatherData.current.temperature,
            humidity: weatherData.current.humidity,
            conditions: weatherData.current.condition.description,
            precipitation: weatherData.current.precipitation * 100,
            windSpeed: weatherData.current.windSpeed,
            windDirection: weatherData.current.windDirection,
            uvIndex: weatherData.hourly?.[0]?.uvIndex || 0,
            icon: weatherData.current.condition.icon
          });

          // Update forecast data
          setForecast(weatherData.daily || []);
        }

        const moistureData = await fetchMoistureData();
        if (moistureData) {
          setSoilMoisture(moistureData.currentMoisture);
          setMoistureHistory(moistureData.history || []);
        }
      }
    };

    if (location) {
      fetchData();
      const interval = setInterval(fetchData, 300000); // Update every 5 minutes
      return () => clearInterval(interval);
    }
  }, [location]);

  // Enhanced automation logic
  useEffect(() => {
    if (isAutoMode) {
      const shouldActivate = automationRules.some(rule => {
        const value = {
          moisture: soilMoisture,
          temperature: weather.temperature,
          rain: weather.precipitation,
          wind: weather.windSpeed,
          uv: weather.uvIndex
        }[rule.condition];

        const meetsCondition = rule.operator === 'below' ? 
          value < rule.value : 
          value > rule.value;

        return meetsCondition && rule.action === 'start';
      });

      const shouldDeactivate = automationRules.some(rule => {
        const value = {
          moisture: soilMoisture,
          temperature: weather.temperature,
          rain: weather.precipitation,
          wind: weather.windSpeed,
          uv: weather.uvIndex
        }[rule.condition];

        const meetsCondition = rule.operator === 'below' ? 
          value < rule.value : 
          value > rule.value;

        return meetsCondition && rule.action === 'stop';
      });

      setIsSprinklerOn(shouldActivate && !shouldDeactivate);
    }
  }, [soilMoisture, weather, automationRules, isAutoMode]);

  const handleSaveChanges = () => {
    if (configureTab === 'schedule') {
      setSchedule(tempSchedule);
    } else {
      setAutomationRules(tempRules);
    }
    setIsConfigureOpen(false);
  };

  const handleCancelChanges = () => {
    setIsConfigureOpen(false);
  };

  const handleAutoModeDecide = () => {
    setIsAutoDeciding(true);
    // Simulate auto mode decision process
    setTimeout(() => {
      // Here you would typically have some logic to determine optimal settings
      // For this example, we'll just use some preset values
      const autoSchedule = [
        {
          day: 'Monday',
          time: '06:00',
          duration: 25,
          adjustForWeather: true,
          minMoisture: 35,
          rainThreshold: 30
        },
        {
          day: 'Thursday',
          time: '07:00',
          duration: 30,
          adjustForWeather: true,
          minMoisture: 35,
          rainThreshold: 30
        }
      ];
      const autoRules = [
        {
          condition: 'moisture',
          operator: 'below',
          value: 30,
          action: 'start',
          duration: 20
        },
        {
          condition: 'rain',
          operator: 'above',
          value: 50,
          action: 'stop'
        }
      ];
      setSchedule(autoSchedule);
      setAutomationRules(autoRules);
      setIsAutoMode(true);
      setIsAutoDeciding(false);
      setIsConfigureOpen(false);
    }, 3000); // Simulate 3 seconds of "thinking"
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const [forecast, setForecast] = useState([]);

  return (
    <div className={`dashboard ${isDarkMode ? 'dark-mode' : ''}`}>
      <header>
        <h1>Smart Sprinkler Control</h1>
        <div className="header-controls">
          <div className="auto-mode">
            <span>Auto Mode</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={isAutoMode} 
                onChange={(e) => setIsAutoMode(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <button onClick={toggleDarkMode} className="dark-mode-toggle">
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </header>

      <section className="weather-overview">
        <h2><FaCloud /> Weather Details & Forecast</h2>
        <div className="weather-grid">
          <WeatherDetail
            icon={FaThermometerHalf}
            label="Temperature"
            value={Math.round(weather.temperature)}
            unit="°F"
          />
          <WeatherDetail
            icon={FaTint}
            label="Humidity"
            value={Math.round(weather.humidity)}
            unit="%"
          />
          <WeatherDetail
            icon={FaWind}
            label="Wind"
            value={Math.round(weather.windSpeed)}
            unit="mph"
          />
          <WeatherDetail
            icon={FaUmbrella}
            label="Rain Chance"
            value={Math.round(forecast[0]?.precipitationChance || 0)}
            unit="%"
          />
          <WeatherDetail
            icon={getWeatherIcon(weather.icon)}
            label="Conditions"
            value={weather.conditions}
            unit=""
          />
        </div>
        <WeeklyForecast forecast={forecast} />
      </section>

      <div className="dashboard-grid">
        <SoilMoistureSection 
          soilMoisture={soilMoisture}
          moistureHistory={moistureHistory}
          isDarkMode={isDarkMode}
        />
        <section className="system-status">
          <h2><FaCog /> System Status & Control</h2>
          <div className="status-content">
            <div className="power-control">
              <span>System Power</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isSprinklerOn}
                  onChange={(e) => !isAutoMode && setIsSprinklerOn(e.target.checked)}
                  disabled={isAutoMode}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="status-display">
              <div className="status-main">
                <span>Current Status</span>
                <div className="status-badge" data-status={isSprinklerOn ? 'active' : 'inactive'}>
                  {isSprinklerOn ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div className="status-info">
                <span>Operation Mode</span>
                <div className="mode-badge" data-mode={isAutoMode ? 'auto' : 'manual'}>
                  {isAutoMode ? 'Automatic' : 'Manual'} Control
                </div>
              </div>
              <div className="next-schedule">
                <span>Next Scheduled</span>
                <span className="next-schedule-time">
                  {schedule[0] ? 
                    `${schedule[0].day} at ${new Date(`2000-01-01 ${schedule[0].time}`).toLocaleTimeString([], {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}` : 
                    'No schedule'
                  }
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <SchedulingAndRules 
        automationRules={automationRules}
        schedule={schedule}
        isAutoMode={isAutoMode}
        setIsConfigureOpen={setIsConfigureOpen}
        setConfigureTab={setConfigureTab}
      />

      {isSprinklerOn && schedule.length > 0 && (
        <div className="status-alert">
          Sprinkler system is currently active. Next scheduled watering: {schedule[0].day} at {schedule[0].time}
        </div>
      )}

      {isConfigureOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Configure {configureTab === 'schedule' ? 'Schedule' : 'Rules'}</h2>
              <div className="tab-buttons">
                <button 
                  className={`modal-button ${configureTab === 'schedule' ? 'active' : ''}`}
                  onClick={() => setConfigureTab('schedule')}
                >
                  Schedule
                </button>
                <button 
                  className={`modal-button ${configureTab === 'rules' ? 'active' : ''}`}
                  onClick={() => setConfigureTab('rules')}
                >
                  Rules
                </button>
              </div>
            </div>
            
            <div className="modal-body">
              {isAutoDeciding ? (
                <div className="auto-deciding">
                  <div className="loader"></div>
                  <p>Auto Mode is analyzing optimal settings...</p>
                </div>
              ) : (
                <>
                  {configureTab === 'schedule' ? (
                    <ScheduleEditor schedule={tempSchedule} setSchedule={setTempSchedule} />
                  ) : (
                    <AutomationRules rules={tempRules} setRules={setTempRules} />
                  )}
                </>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={handleAutoModeDecide} className="modal-button auto-decide-button">
                Let Auto Mode Decide
              </button>
              <button onClick={handleCancelChanges} className="modal-button cancel-button">
                Cancel
              </button>
              <button onClick={handleSaveChanges} className="modal-button save-button">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {locationError && (
        <div className="location-error">
          {locationError}
        </div>
      )}
    </div>
  );
};

export default SprinklerDashboard;
