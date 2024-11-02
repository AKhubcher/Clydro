import { 
  FaCloud, FaTint, FaSun, 
  FaBolt, FaSnowflake, FaSmog, FaCloudSun
} from 'react-icons/fa';

export const getWeatherIcon = (iconName) => {
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