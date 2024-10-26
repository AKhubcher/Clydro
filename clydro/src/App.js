import React, { useState, useEffect } from 'react';
import { 
  FaCloud, FaTint, FaSun, FaWind, 
  FaThermometerHalf, FaUmbrella, FaTachometerAlt, FaStopwatch, FaCog, FaEye, FaCloudSun, FaMoon
} from 'react-icons/fa';
import './App.css';

const WeatherDetail = ({ icon: Icon, label, value, unit }) => (
  <div className="weather-detail">
    <Icon className="weather-icon" />
    <div>
      <div className="weather-label">{label}</div>
      <div className="weather-value">
        {value}{unit}
      </div>
    </div>
  </div>
);

const WeeklyForecast = () => {
  const forecast = [
    { 
      day: 'Today', 
      temp: 75, 
      condition: 'Sunny', 
      icon: <FaSun className="forecast-icon" />, 
      precipitation: 0,
      humidity: 45,
      windSpeed: 8,
      uvIndex: 6 
    },
    { 
      day: 'Tue', 
      temp: 72, 
      condition: 'Partly Cloudy', 
      icon: <FaCloudSun className="forecast-icon" />, 
      precipitation: 10,
      humidity: 50,
      windSpeed: 10,
      uvIndex: 5 
    },
    { 
      day: 'Wed', 
      temp: 68, 
      condition: 'Cloudy', 
      icon: <FaCloud className="forecast-icon" />, 
      precipitation: 30,
      humidity: 60,
      windSpeed: 12,
      uvIndex: 4 
    },
    { 
      day: 'Thu', 
      temp: 70, 
      condition: 'Sunny', 
      icon: <FaSun className="forecast-icon" />, 
      precipitation: 5,
      humidity: 45,
      windSpeed: 8,
      uvIndex: 7 
    },
    { 
      day: 'Fri', 
      temp: 73, 
      condition: 'Partly Cloudy', 
      icon: <FaCloudSun className="forecast-icon" />, 
      precipitation: 15,
      humidity: 55,
      windSpeed: 9,
      uvIndex: 6 
    },
    { 
      day: 'Sat', 
      temp: 76, 
      condition: 'Sunny', 
      icon: <FaSun className="forecast-icon" />, 
      precipitation: 0,
      humidity: 40,
      windSpeed: 7,
      uvIndex: 8 
    },
    { 
      day: 'Sun', 
      temp: 74, 
      condition: 'Partly Cloudy', 
      icon: <FaCloudSun className="forecast-icon" />, 
      precipitation: 20,
      humidity: 50,
      windSpeed: 11,
      uvIndex: 5 
    },
  ];

  return (
    <div className="weekly-forecast">
      {forecast.map((day, index) => (
        <div key={index} className="forecast-day">
          <div className="forecast-day-name">{day.day}</div>
          <div className="forecast-icon-wrapper">{day.icon}</div>
          <div className="forecast-temp">{day.temp}°F</div>
          <div className="forecast-details">
            <div>{day.precipitation}%</div>
            <div>{day.windSpeed} mph</div>
            <div>UV: {day.uvIndex}</div>
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

const ScheduleItem = ({ item, updateItem, removeItem }) => (
  <div className="schedule-item">
    <div className="schedule-description">
      On <select
        value={item.day}
        onChange={(e) => updateItem('day', e.target.value)}
      >
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>
      at <input
        type="time"
        value={item.time}
        onChange={(e) => updateItem('time', e.target.value)}
      />
      have the sprinkler go off for <input
        type="number"
        value={item.duration}
        onChange={(e) => updateItem('duration', parseInt(e.target.value))}
      /> minutes.
    </div>
    <div className="weather-adjustment">
      Adjust for weather? <input
        type="checkbox"
        checked={item.adjustForWeather}
        onChange={(e) => updateItem('adjustForWeather', e.target.checked)}
      />
      {item.adjustForWeather && (
        <>
          <div>
            Minimum soil moisture: <input
              type="number"
              value={item.minMoisture}
              onChange={(e) => updateItem('minMoisture', parseInt(e.target.value))}
            />%
          </div>
          <div>
            Skip if rain chance above: <input
              type="number"
              value={item.rainThreshold}
              onChange={(e) => updateItem('rainThreshold', parseInt(e.target.value))}
            />%
          </div>
        </>
      )}
    </div>
    <button className="remove-schedule" onClick={removeItem}>Remove Schedule</button>
  </div>
);

const ScheduleEditor = ({ schedule, setSchedule }) => {
  const addScheduleItem = () => {
    setSchedule([...schedule, {
      day: 'Monday',
      time: '06:00',
      duration: 30,
      adjustForWeather: true,
      minMoisture: 30,
      maxWind: 15,
      rainThreshold: 40
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
        <ScheduleItem
          key={index}
          item={item}
          updateItem={(field, value) => updateScheduleItem(index, field, value)}
          removeItem={() => removeScheduleItem(index)}
        />
      ))}
      <button onClick={addScheduleItem}>Add Schedule</button>
    </div>
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
      adjustForWeather: true,
      minMoisture: 30,
      rainThreshold: 40
    }
  ]);

  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [configureTab, setConfigureTab] = useState('schedule'); // 'schedule' or 'rules'
  const [tempSchedule, setTempSchedule] = useState([]);
  const [tempRules, setTempRules] = useState([]);
  const [isAutoDeciding, setIsAutoDeciding] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setTempSchedule(schedule);
    setTempRules(automationRules);
  }, [isConfigureOpen, schedule, automationRules]);

  // Simulate weather updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(0, Math.min(100, prev.humidity + (Math.random() - 0.5) * 5)),
        windSpeed: Math.max(0, Math.min(30, prev.windSpeed + (Math.random() - 0.5) * 2)),
      }));
      setSoilMoisture(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 3)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
            label="Wind Speed"
            value={Math.round(weather.windSpeed)}
            unit="mph"
          />
          <WeatherDetail
            icon={FaUmbrella}
            label="Rain Chance"
            value={weather.precipitation}
            unit="%"
          />
          <WeatherDetail
            icon={FaSun}
            label="UV Index"
            value={weather.uvIndex}
            unit=""
          />
          <WeatherDetail
            icon={FaTachometerAlt}
            label="Pressure"
            value={weather.pressure}
            unit="hPa"
          />
          <WeatherDetail
            icon={FaEye}
            label="Visibility"
            value={weather.visibility}
            unit="mi"
          />
          <WeatherDetail
            icon={FaCloud}
            label="Conditions"
            value={weather.conditions}
            unit=""
          />
        </div>
        <WeeklyForecast />
      </section>

      <div className="dashboard-grid">
        <section className="soil-moisture">
          <h2><FaTint /> Soil Moisture Monitoring</h2>
          <div className="moisture-display">
            <div className="moisture-value">
              Current Moisture Level: <strong>{Math.round(soilMoisture)}%</strong>
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
          </div>
        </section>

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
                Status: {isSprinklerOn ? 'Active' : 'Inactive'}
              </div>
              <div className="status-sub">
                Mode: {isAutoMode ? 'Automatic' : 'Manual'} Control
              </div>
              {isAutoMode && (
                <div className="status-sub">
                  Using {automationRules.length} automation rules
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <section className="scheduling">
        <div className="section-header">
          <h2><FaStopwatch /> Scheduling & Automation</h2>
          <button onClick={() => setIsConfigureOpen(true)}>Configure</button>
        </div>
        <div className="schedule-content">
          <div className="active-schedule">
            <h3>Active Schedule</h3>
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Time</th>
                  <th>Duration</th>
                  <th>Weather Adjusted</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((item, index) => (
                  <tr key={index}>
                    <td>{item.day}</td>
                    <td>{item.time}</td>
                    <td>{item.duration} minutes</td>
                    <td>{item.adjustForWeather ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="active-rules">
            <h3>Active Rules</h3>
            {automationRules.map((rule, index) => (
              <div key={index} className="rule-item">
                <strong>If {rule.condition}</strong> is {rule.operator} <strong>{rule.value}{rule.condition === 'temperature' ? '°F' : '%'}</strong>:
                <br />
                <span className="rule-action">
                  {rule.action === 'start' ? 'Start' : 'Stop'} watering
                  {rule.action === 'start' && ` for ${rule.duration} minutes`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isSprinklerOn && schedule.length > 0 && (
        <div className="status-alert">
          Sprinkler system is currently active. Next scheduled watering: {schedule[0].day} at {schedule[0].time}
        </div>
      )}

      {isConfigureOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Configure {configureTab === 'schedule' ? 'Schedule' : 'Rules'}</h2>
              <div className="tab-buttons">
                <button 
                  className={configureTab === 'schedule' ? 'active' : ''}
                  onClick={() => setConfigureTab('schedule')}
                >
                  Schedule
                </button>
                <button 
                  className={configureTab === 'rules' ? 'active' : ''}
                  onClick={() => setConfigureTab('rules')}
                >
                  Rules
                </button>
              </div>
            </div>
            {isAutoDeciding ? (
              <div className="auto-deciding">
                <p>Auto Mode is deciding optimal settings...</p>
              </div>
            ) : (
              <>
                {configureTab === 'schedule' ? (
                  <ScheduleEditor schedule={tempSchedule} setSchedule={setTempSchedule} />
                ) : (
                  <AutomationRules rules={tempRules} setRules={setTempRules} />
                )}
                <div className="modal-footer">
                  <button onClick={handleSaveChanges} className="save-button">Save Changes</button>
                  <button onClick={handleCancelChanges} className="cancel-button">Cancel</button>
                  <button onClick={handleAutoModeDecide} className="auto-decide-button">Let Auto Mode Decide</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SprinklerDashboard;