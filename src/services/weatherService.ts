import { format } from 'date-fns';

interface WeatherPoint {
  properties: {
    forecast: string;
    forecastHourly: string;
    forecastGridData: string;
    gridId: string;
    gridX: number;
    gridY: number;
  }
}

interface WeatherForecast {
  properties: {
    periods: Array<{
      name: string;
      startTime: string;
      temperature: number;
      windSpeed: string;
      icon: string;
      shortForecast: string;
      detailedForecast: string;
      probabilityOfPrecipitation: {
        value: number;
      };
    }>;
  }
}

interface GridDataForecast {
  properties: {
    temperature: {
      values: Array<{
        validTime: string;
        value: number;
      }>;
    };
    probabilityOfPrecipitation: {
      values: Array<{
        validTime: string;
        value: number;
      }>;
    };
    relativeHumidity: {
      values: Array<{
        validTime: string;
        value: number;
      }>;
    };
  }
}

interface DailyForecast {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number | null;
  maxWindSpeed: number;
  precipitationChance: number;
  condition: {
    description: string;
    icon: string;
  };
}

// Add helper function to get temperature stats for a specific day
const getDailyTemperatureStats = (
  gridData: GridDataForecast,
  targetDate: Date
): { maxTemp: number; minTemp: number } => {
  const targetDateStr = targetDate.toDateString();
  
  // Filter temperature values for the target date
  const dayTemps = gridData.properties.temperature.values.filter(item => {
    const itemDate = new Date(item.validTime.split('/')[0]);
    return itemDate.toDateString() === targetDateStr;
  });

  if (dayTemps.length === 0) {
    return { maxTemp: 0, minTemp: 0 };
  }

  // Convert Celsius to Fahrenheit since grid data uses Celsius
  const temps = dayTemps.map(t => (t.value * 9/5) + 32);
  return {
    maxTemp: Math.round(Math.max(...temps)),
    minTemp: Math.round(Math.min(...temps))
  };
};

export const fetchWeatherData = async (latitude: number, longitude: number) => {
  try {
    const headers = {
      'User-Agent': '(Clydro Weather App, contact@clydro.com)',
      'Accept': 'application/json'
    };

    // Get grid point data
    const pointResponse = await fetch(
      `https://api.weather.gov/points/${latitude},${longitude}`,
      { headers }
    );
    
    if (!pointResponse.ok) {
      throw new Error('Failed to fetch weather point data');
    }

    const pointData: WeatherPoint = await pointResponse.json();
    
    // Fetch all three forecast types
    const [forecastResponse, hourlyResponse, gridDataResponse] = await Promise.all([
      fetch(pointData.properties.forecast, { headers }),
      fetch(pointData.properties.forecastHourly, { headers }),
      fetch(pointData.properties.forecastGridData, { headers })
    ]);
    
    if (!forecastResponse.ok || !hourlyResponse.ok || !gridDataResponse.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    const forecastData: WeatherForecast = await forecastResponse.json();
    const hourlyData: WeatherForecast = await hourlyResponse.json();
    const gridData: GridDataForecast = await gridDataResponse.json();

    // Get current conditions from hourly data
    const currentHour = hourlyData.properties.periods[0];
    
    // Get current humidity from grid data
    const currentTime = new Date();
    const currentHumidity = gridData.properties.relativeHumidity.values.find(
      item => {
        const validTime = new Date(item.validTime.split('/')[0]);
        return validTime <= currentTime;
      }
    )?.value || 0;

    // Process daily forecast data
    const daily: DailyForecast[] = [];
    const periods = forecastData.properties.periods;
    const processedDays = new Set();
    
    for (let i = 0; i < periods.length; i++) {
      const period = periods[i];
      const periodDate = new Date(period.startTime);
      const dayKey = periodDate.toDateString();
      
      if (!processedDays.has(dayKey)) {
        // Get temperature stats from grid data
        const tempStats = getDailyTemperatureStats(gridData, periodDate);
        
        // Find all periods for this day for other data
        const dayPeriods = periods.filter(p => 
          new Date(p.startTime).toDateString() === dayKey
        );
        
        // Get precipitation chance from grid data
        const precipData = gridData.properties.probabilityOfPrecipitation.values.find(
          item => new Date(item.validTime.split('/')[0]).toDateString() === dayKey
        );
        
        // Use the first period of the day for conditions and wind
        const dayPeriod = dayPeriods[0];
        
        daily.push({
          date: period.startTime,
          dayName: format(periodDate, 'EEEE'),
          maxTemp: tempStats.maxTemp,
          minTemp: tempStats.minTemp,
          maxWindSpeed: parseInt(dayPeriod.windSpeed.split(' ')[0]),
          precipitationChance: precipData?.value || dayPeriod.probabilityOfPrecipitation?.value || 0,
          condition: {
            description: dayPeriod.shortForecast,
            icon: mapNWSIconToLocal(dayPeriod.icon)
          }
        });
        
        processedDays.add(dayKey);
      }
    }

    // Sort daily forecast by date
    daily.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Get current conditions from grid data for more accuracy
    const currentTemp = gridData.properties.temperature.values[0];
    const currentTempF = currentTemp ? Math.round((currentTemp.value * 9/5) + 32) : currentHour.temperature;

    return {
      current: {
        temperature: currentTempF,
        humidity: Math.round(currentHumidity),
        condition: {
          description: currentHour.shortForecast,
          icon: mapNWSIconToLocal(currentHour.icon)
        },
        precipitation: currentHour.probabilityOfPrecipitation?.value || 0,
        windSpeed: parseInt(currentHour.windSpeed.split(' ')[0]),
        windDirection: 0,
      },
      daily: daily.slice(0, 7)
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

const mapNWSIconToLocal = (nwsIcon: string): string => {
  const iconUrl = nwsIcon.toLowerCase();
  if (iconUrl.includes('/skc') || iconUrl.includes('/few')) return 'sun';
  if (iconUrl.includes('/sct') || iconUrl.includes('/bkn')) return 'cloud-sun';
  if (iconUrl.includes('/ovc')) return 'cloud';
  if (iconUrl.includes('/rain') || iconUrl.includes('/tsra')) return 'cloud-rain';
  if (iconUrl.includes('/tsra')) return 'bolt';
  if (iconUrl.includes('/snow')) return 'snowflake';
  if (iconUrl.includes('/fog')) return 'smog';
  if (iconUrl.includes('/wind')) return 'wind';
  return 'cloud-sun';
};

export const fetchMoistureData = async () => {
  return {
    currentMoisture: 45,
    history: [
      { timestamp: new Date().getTime() - 3600000, value: 48 },
      { timestamp: new Date().getTime() - 7200000, value: 52 },
      { timestamp: new Date().getTime() - 10800000, value: 55 }
    ]
  };
};