import React, { useState, useEffect } from 'react';
import { 
  FaCloud, FaTint, FaSun, FaWind, 
  FaThermometerHalf, FaUmbrella, 
  FaBolt, FaSnowflake, FaSmog, FaCloudSun,
  FaCog
} from 'react-icons/fa';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { fetchWeatherData, fetchMoistureData } from '../services/weatherService.ts';
import '../styles/index.css';

// Import all the components we created earlier
import AutomationRules from './Automation/AutomationRules';
import ScheduleEditor from './Scheduling/ScheduleEditor';
import SoilMoistureSection from './Moisture/SoilMoistureSection';
import SchedulingAndRules from './Scheduling/SchedulingAndRules';
import WeatherDetail from './Weather/WeatherDetail';
import WeeklyForecast from './Weather/WeeklyForecast';
import Header from './Header/Header';
import ProfileMenu from './Profile/ProfileMenu';

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

const SprinklerDashboard = () => {
  // State management
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
  const [configureTab, setConfigureTab] = useState('schedule');
  const [tempSchedule, setTempSchedule] = useState([]);
  const [tempRules, setTempRules] = useState([]);
  const [isAutoDeciding, setIsAutoDeciding] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [moistureHistory, setMoistureHistory] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const { logout } = useAuth();

  // Location Effect
  useEffect(() => {
    const getLocation = () => {
      if ("geolocation" in navigator) {
        setLocationError("Getting your location...");
        
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
            switch(error.code) {
              case error.PERMISSION_DENIED:
                setLocationError("Location access denied. Please enable location services.");
                break;
              case error.POSITION_UNAVAILABLE:
                setLocationError("Location information unavailable.");
                break;
              case error.TIMEOUT:
                setLocationError("Location request timed out.");
                break;
              default:
                setLocationError("Unable to get your location. Using default location.");
            }
            setLocation({
              latitude: 40.7128,
              longitude: -74.0060
            });
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      } else {
        setLocationError("Geolocation is not supported by your browser");
        setLocation({
          latitude: 40.7128,
          longitude: -74.0060
        });
      }
    };

    getLocation();
  }, []);

  // Weather Data Effect
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (location && isMounted) {
        try {
          const weatherData = await fetchWeatherData(
            location.latitude,
            location.longitude
          );
          
          if (weatherData && isMounted) {
            setWeather({
              temperature: weatherData.current.temperature,
              humidity: weatherData.current.humidity,
              conditions: weatherData.current.condition.description,
              precipitation: weatherData.current.precipitation * 100,
              windSpeed: weatherData.current.windSpeed,
              windDirection: weatherData.current.windDirection,
              uvIndex: 0,
              icon: weatherData.current.condition.icon
            });

            if (weatherData.daily && Array.isArray(weatherData.daily)) {
              setForecast(weatherData.daily);
            }
          }

          const moistureData = await fetchMoistureData();
          if (moistureData && isMounted) {
            setSoilMoisture(moistureData.currentMoisture);
            setMoistureHistory(moistureData.history || []);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    if (location) {
      fetchData();
      const interval = setInterval(fetchData, 900000); // 15 minutes
      
      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }
  }, [location]);

  // Automation Effect
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

  // Handlers
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
    setTimeout(() => {
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
    }, 3000);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleProfileNavigate = (section) => {
    setIsProfileMenuOpen(false);
    // Handle navigation to different profile sections
    console.log(`Navigating to ${section}`);
  };

  // Get current day stats
  const currentDayStats = forecast.find(day => 
    day?.dayName?.toUpperCase() === format(new Date(), 'EEEE').toUpperCase()
  ) || forecast[0];

  return (
    <div className={`dashboard ${isDarkMode ? 'dark-mode' : ''}`}>
      <Header 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        isAutoMode={isAutoMode}
        setIsAutoMode={setIsAutoMode}
        onProfileClick={() => setIsProfileMenuOpen(true)}
        onLogout={logout}
      />

      <section className="weather-overview">
        <h2><FaCloud /> Weather Details & Forecast</h2>
        <h3 className="current-weather-title">Current Day Stats</h3>
        <div className="weather-grid">
          <WeatherDetail
            icon={FaThermometerHalf}
            label="Temperature"
            value={Math.round(currentDayStats?.maxTemp || 0)}
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
            value={Math.round(currentDayStats?.maxWindSpeed || 0)}
            unit="mph"
          />
          <WeatherDetail
            icon={FaUmbrella}
            label="Rain Chance"
            value={Math.round(currentDayStats?.precipitationChance || 0)}
            unit="%"
          />
          <WeatherDetail
            icon={getWeatherIcon(currentDayStats?.condition?.icon || 'cloud-rain')}
            label="Conditions"
            value={currentDayStats?.condition?.description || 'No data'}
          />
        </div>
        <h3 className="weekly-forecast-title">Weekly Forecast</h3>
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
          <div className="system-controls-container">
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
            <div className="status-main">
              <span>Current Status</span>
              <div className="status-badge" data-status={isSprinklerOn ? 'active' : 'inactive'}>
                {isSprinklerOn ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div className="status-info">
              <span>Operation Mode</span>
              <div className="mode-badge">
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

      <ProfileMenu 
        isOpen={isProfileMenuOpen}
        onClose={() => setIsProfileMenuOpen(false)}
        onNavigate={handleProfileNavigate}
      />

      {locationError && (
        <div className="location-error">
          {locationError}
        </div>
      )}
    </div>
  );
};

export default SprinklerDashboard; 