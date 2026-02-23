import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org';

const weatherApi = axios.create({
    baseURL: BASE_URL,
    params: {
        appid: API_KEY,
        units: 'metric',
    },
});

// OpenMeteo Fallback Service
const openMeteoApi = axios.create({
    baseURL: 'https://api.open-meteo.com/v1',
});

const mapOpenMeteoToOpenWeather = (data, city) => {
    const current = data.current_weather;
    return {
        name: city || "Current Location",
        sys: { country: "" },
        main: {
            temp: current.temperature,
            humidity: 50, // Mock, as OpenMeteo needs extra params for this
            pressure: 1013,
            temp_min: current.temperature - 2,
            temp_max: current.temperature + 2,
        },
        wind: { speed: current.windspeed },
        weather: [{
            main: "Clear", // Simplified mapping
            description: "Clear sky",
            icon: "01d"
        }],
        dt: current.time,
        coord: { lat: data.latitude, lon: data.longitude }
    };
};

export const getCurrentWeather = async (city) => {
    try {
        const response = await weatherApi.get('/data/2.5/weather', {
            params: { q: city },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Fallback to OpenMeteo Geocoding then Weather
            console.warn("OpenWeatherMap Key Invalid. Falling back to OpenMeteo.");
            try {
                const geo = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`);
                if (geo.data.results && geo.data.results.length > 0) {
                    const { latitude, longitude, name } = geo.data.results[0];
                    const weather = await openMeteoApi.get(`/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
                    return mapOpenMeteoToOpenWeather(weather.data, name);
                }
            } catch (omError) {
                throw error; // Throw original error if fallback fails
            }
        }
        throw error;
    }
};

export const getCurrentWeatherByCoords = async (lat, lon) => {
    try {
        const response = await weatherApi.get('/data/2.5/weather', {
            params: { lat, lon },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            try {
                const weather = await openMeteoApi.get(`/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
                return mapOpenMeteoToOpenWeather(weather.data, "Current Location");
            } catch (omError) {
                throw error;
            }
        }
        throw error;
    }
};

export const getForecast = async (lat, lon) => {
    try {
        const response = await weatherApi.get('/data/2.5/forecast', {
            params: { lat, lon },
        });
        return response.data;
    } catch (error) {
        console.warn("OpenWeatherMap Forecast API failed. Attempting OpenMeteo fallback.");
        try {
            const response = await openMeteoApi.get('/forecast', {
                params: {
                    latitude: lat,
                    longitude: lon,
                    hourly: 'temperature_2m,weathercode',
                    daily: 'temperature_2m_max,temperature_2m_min,weathercode',
                    timezone: 'auto'
                }
            });

            // Map OpenMeteo to OpenWeather Format
            return {
                list: response.data.hourly.time.map((time, index) => ({
                    dt: new Date(time).getTime() / 1000,
                    main: {
                        temp: response.data.hourly.temperature_2m[index],
                        temp_max: response.data.hourly.temperature_2m[index],
                        temp_min: response.data.hourly.temperature_2m[index],
                    },
                    weather: [{
                        main: "Clear", // Simplified
                        icon: "01d",
                        description: "Clear sky"
                    }],
                    dt_txt: time.replace('T', ' ')
                })).slice(0, 40) // 5 days, 3-hour intervals would be 40. OpenMeteo hourly is 168.
            };
        } catch (omError) {
            return { list: [] };
        }
    }
};

export const searchCities = async (query) => {
    try {
        const response = await weatherApi.get('/geo/1.0/direct', {
            params: { q: query, limit: 5 },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            const geo = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`);
            return geo.data.results?.map(item => ({
                name: item.name,
                lat: item.latitude,
                lon: item.longitude,
                country: item.country,
                state: item.admin1
            })) || [];
        }
        throw error;
    }
};

export const getAirQuality = async (lat, lon) => {
    try {
        const response = await weatherApi.get('/data/2.5/air_pollution', {
            params: { lat, lon }
        });
        return response.data;
    } catch (error) {
        return null; // Fail silently for AQI if key invalid
    }
}
