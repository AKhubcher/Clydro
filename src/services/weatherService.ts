import { fetchWeatherApi } from 'openmeteo';

export interface ProcessedWeatherData {
  current: {
    temperature: number;
    humidity: number;
    precipitation: number;
    rain: number;
    windSpeed: number;
    condition: WeatherDescription;
  };
  daily: Array<{
    date: number;
    dayName: string;
    maxTemp: number;
    minTemp: number;
    precipitationChance: number;
    rainSum: number;
    maxWindSpeed: number;
    condition: WeatherDescription;
  }>;
}

interface WeatherDescription {
  description: string;
  icon: string;
}

const getDayName = (timestamp: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date(timestamp * 1000).getDay()];
};

export const fetchWeatherData = async (latitude: number, longitude: number): Promise<ProcessedWeatherData> => {
  try {
    const params = {
      latitude,
      longitude,
      current: ["temperature_2m", "relative_humidity_2m", "precipitation", "rain", "weather_code", "wind_speed_10m"],
      hourly: ["temperature_2m", "relative_humidity_2m", "rain", "weather_code"],
      daily: ["weather_code", "temperature_2m_max", "temperature_2m_min", "rain_sum", "precipitation_probability_max", "wind_speed_10m_max"],
      temperature_unit: "fahrenheit",
      wind_speed_unit: "mph",
      precipitation_unit: "inch",
      timezone: "America/Los_Angeles",
      forecast_days: 7
    };

    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];

    const current = response.current()!;
    const daily = response.daily()!;

    // Process current weather
    const currentWeather = {
      temperature: current.variables(0)!.value(),
      humidity: current.variables(1)!.value(),
      precipitation: current.variables(2)!.value(),
      rain: current.variables(3)!.value(),
      condition: getWeatherDescription(current.variables(4)!.value()),
      windSpeed: current.variables(5)!.value()
    };

    // Get daily time array and values
    const dailyTimes = daily.time();
    const weatherCodes = daily.variables(0)!.valuesArray()!;
    const maxTemps = daily.variables(1)!.valuesArray()!;
    const minTemps = daily.variables(2)!.valuesArray()!;
    const rainSums = daily.variables(3)!.valuesArray()!;
    const precipProbs = daily.variables(4)!.valuesArray()!;
    const maxWindSpeeds = daily.variables(5)!.valuesArray()!;

    // Process daily forecast ensuring all 7 days
    const dailyForecast = Array.from({ length: 7 }, (_, i) => ({
      date: Number(dailyTimes[i]),
      dayName: getDayName(Number(dailyTimes[i])),
      maxTemp: maxTemps[i],
      minTemp: minTemps[i],
      rainSum: rainSums[i],
      precipitationChance: precipProbs[i],
      maxWindSpeed: maxWindSpeeds[i],
      condition: getWeatherDescription(weatherCodes[i])
    }));

    return {
      current: currentWeather,
      daily: dailyForecast
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const getWeatherDescription = (code: number): WeatherDescription => {
  const weatherCodes: Record<number, WeatherDescription> = {
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

interface MoistureData {
  currentMoisture: number;
  history: Array<{
    timestamp: number;
    value: number;
  }>;
}

export const fetchMoistureData = async (): Promise<MoistureData> => {
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