import { useState } from 'react';
import { getCurrentWeather, getForecast, getCurrentWeatherByCoords, getAirQuality } from '../api/weather';

export const useWeather = () => {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [airQuality, setAirQuality] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWeather = async (city) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCurrentWeather(city);
            setWeather(data);
            const { lat, lon } = data.coord;
            await fetchAdditionalData(lat, lon);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch weather data');
        } finally {
            setLoading(false);
        }
    };

    const fetchWeatherByCoords = async (lat, lon) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCurrentWeatherByCoords(lat, lon);
            setWeather(data);
            await fetchAdditionalData(lat, lon);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch weather data');
        } finally {
            setLoading(false);
        }
    };

    const fetchAdditionalData = async (lat, lon) => {
        try {
            const forecastData = await getForecast(lat, lon);
            setForecast(forecastData);
            const aqData = await getAirQuality(lat, lon);
            setAirQuality(aqData);
        } catch (err) {
            console.error("Failed to fetch additional data", err);
        }
    }

    return { weather, forecast, airQuality, loading, error, fetchWeather, fetchWeatherByCoords };
};
