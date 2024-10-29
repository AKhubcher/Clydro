export const fetchWeatherData = async (latitude, longitude) => {
  try {
    const url = "https://api.open-meteo.com/v1/forecast";
    const params = {
      latitude: latitude,
      longitude: longitude,
      current: ["temperature_2m", "relative_humidity_2m", "precipitation", "rain", "showers"],
      hourly: ["temperature_2m", "relative_humidity_2m", "precipitation_probability", "rain", "showers"],
      daily: ["weather_code", "temperature_2m_max", "temperature_2m_min", "precipitation_probability_max", "wind_speed_10m_max"],
      temperature_unit: "fahrenheit",
      wind_speed_unit: "mph",
      precipitation_unit: "inch",
      timeformat: "unixtime",
      timezone: "America/Los_Angeles",
      forecast_days: 7
    };

    const queryString = Object.entries(params).map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}=${value.join(",")}`;
      }
      return `${key}=${value}`;
    }).join("&");

    const response = await fetch(`${url}?${queryString}`);
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }
    
    const data = await response.json();
    console.log('Raw Weather API response:', data);

    // Process the data with null checks and default values
    const currentWeather = {
      temperature: data.current?.temperature_2m ?? 0,
      humidity: data.current?.relative_humidity_2m ?? 0,
      precipitation: data.current?.precipitation ?? 0,
      rain: data.current?.rain ?? 0,
      showers: data.current?.showers ?? 0,
      condition: getWeatherDescription(data.daily?.weather_code?.[0] ?? 0)
    };

    // Make sure daily data exists before mapping
    const dailyForecast = data.daily?.time ? 
      data.daily.time.map((time, index) => ({
        date: time,
        maxTemp: data.daily.temperature_2m_max?.[index] ?? 0,
        minTemp: data.daily.temperature_2m_min?.[index] ?? 0,
        precipitationChance: data.daily.precipitation_probability_max?.[index] ?? 0,
        condition: getWeatherDescription(data.daily.weather_code?.[index] ?? 0)
      })) : [];

    return {
      current: currentWeather,
      daily: dailyForecast
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return {
      current: {
        temperature: 0,
        humidity: 0,
        precipitation: 0,
        rain: 0,
        showers: 0,
        condition: getWeatherDescription(0)
      },
      daily: []
    };
  }
};

const getWeatherDescription = (code) => {
  const weatherCodes = {
    0: { description: 'Clear sky', icon: 'sun' },
    1: { description: 'Mainly clear', icon: 'sun' },
    2: { description: 'Partly cloudy', icon: 'cloud-sun' },
    3: { description: 'Overcast', icon: 'cloud' },
    45: { description: 'Foggy', icon: 'smog' },
    48: { description: 'Depositing rime fog', icon: 'smog' },
    51: { description: 'Light drizzle', icon: 'cloud-rain' },
    53: { description: 'Moderate drizzle', icon: 'cloud-rain' },
    55: { description: 'Dense drizzle', icon: 'cloud-rain' },
    61: { description: 'Slight rain', icon: 'cloud-rain' },
    63: { description: 'Moderate rain', icon: 'cloud-rain' },
    65: { description: 'Heavy rain', icon: 'cloud-showers-heavy' },
    71: { description: 'Slight snow', icon: 'snowflake' },
    73: { description: 'Moderate snow', icon: 'snowflake' },
    75: { description: 'Heavy snow', icon: 'snowflake' },
    77: { description: 'Snow grains', icon: 'snowflake' },
    80: { description: 'Slight rain showers', icon: 'cloud-rain' },
    81: { description: 'Moderate rain showers', icon: 'cloud-rain' },
    82: { description: 'Violent rain showers', icon: 'cloud-showers-heavy' },
    85: { description: 'Slight snow showers', icon: 'snowflake' },
    86: { description: 'Heavy snow showers', icon: 'snowflake' },
    95: { description: 'Thunderstorm', icon: 'bolt' },
    96: { description: 'Thunderstorm with slight hail', icon: 'cloud-meatball' },
    99: { description: 'Thunderstorm with heavy hail', icon: 'cloud-meatball' }
  };
  return weatherCodes[code] || { description: 'Unknown', icon: 'question' };
};

export const fetchMoistureData = async () => {
  // Simulate moisture sensor data
  return new Promise((resolve) => {
    setTimeout(() => {
      const baseValue = 45;
      const history = Array.from({ length: 24 }, (_, i) => ({
        timestamp: Date.now() - (23 - i) * 3600000,
        value: baseValue + Math.sin(i / 4) * 15 + (Math.random() - 0.5) * 5
      }));
      
      resolve({
        currentMoisture: history[history.length - 1].value,
        history: history
      });
    }, 1000);
  });
}; 