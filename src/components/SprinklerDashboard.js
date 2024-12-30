import React, { useState, useEffect } from 'react';
import { 
  FaCloud, FaTint, FaSun, FaWind, 
  FaThermometerHalf, FaUmbrella, 
  FaBolt, FaSnowflake, FaSmog, FaCloudSun
} from 'react-icons/fa';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { fetchWeatherData} from '../services/weatherService.ts';
import '../styles/index.css';
import axios from 'axios';

// Import components
import SoilMoistureSection from './Moisture/SoilMoistureSection';
import WeatherDetail from './Weather/WeatherDetail';
import WeeklyForecast from './Weather/WeeklyForecast';
import Header from './Header/Header';
import ProfileMenu from './Profile/ProfileMenu';
import WaterAnalyzer from './WaterAnalyzer';

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
  const [isDarkMode, setIsDarkMode] = useState(false);
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

          const response = await axios.get('https://api.thingspeak.com/channels/2794876/fields/1.json?results=1000');
          const feeds = response.data.feeds;
          if (feeds && feeds.length > 0 && isMounted) {
            const currentValue = parseFloat(feeds[feeds.length - 1].field1);
            const moisturePercentage = 100 - (currentValue / 3800 * 100);
            setSoilMoisture(Math.round(moisturePercentage));
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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleProfileNavigate = (section) => {
    setIsProfileMenuOpen(false);
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
          isDarkMode={isDarkMode}
        />
        
        <WaterAnalyzer 
          weather={weather}
          soilMoisture={soilMoisture}
          isSprinklerOn={isSprinklerOn}
          setIsSprinklerOn={setIsSprinklerOn}
          isAutoMode={isAutoMode}
          currentDayStats={currentDayStats}
        />
      </div>

      {isSprinklerOn && (
        <div className="status-alert">
          Sprinkler system is currently active
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