import { Droplets, Wind, Thermometer, Sunrise, Sunset, Gauge, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const WeatherCard = ({ weather, airQuality, isFavorite, toggleFavorite }) => {
    if (!weather) return null;

    const { main, wind, sys, weather: weatherDetails, name } = weather;
    const description = weatherDetails[0].description;
    const iconCode = weatherDetails[0].icon;

    const formatDate = (timestamp) => {
        return format(new Date(timestamp * 1000), 'h:mm a');
    };

    const getAqiConfig = (aqi) => {
        // API returns 1,2,3,4,5
        const levels = {
            1: { label: 'Good', color: 'text-green-400' },
            2: { label: 'Fair', color: 'text-yellow-400' },
            3: { label: 'Moderate', color: 'text-orange-400' },
            4: { label: 'Poor', color: 'text-red-400' },
            5: { label: 'Very Poor', color: 'text-purple-400' },
        };
        return levels[aqi] || { label: 'Unknown', color: 'text-gray-400' };
    };

    const aqiConfig = getAqiConfig(airQuality?.list?.[0]?.main?.aqi);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/20 dark:bg-black/30 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 text-white shadow-xl w-full max-w-3xl mx-auto mt-8 relative"
        >
            <button
                onClick={toggleFavorite}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
                <Heart fill={isFavorite ? "currentColor" : "none"} className={isFavorite ? "text-red-500" : "text-white"} />
            </button>

            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <div>
                    <h2 className="text-3xl font-bold tracking-wide">{name}, {sys.country}</h2>
                    <p className="text-lg text-blue-100 mt-1 capitalize">{description}</p>
                    <div className="text-6xl md:text-8xl font-bold mt-4">
                        {Math.round(main.temp)}°
                    </div>
                </div>
                <div className="mt-6 md:mt-0">
                    <img
                        src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`}
                        alt={description}
                        className="w-32 h-32 md:w-48 md:h-48 drop-shadow-lg"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white/10 rounded-2xl p-4 flex flex-col items-center justify-center backdrop-blur-sm">
                    <Droplets className="text-blue-300 mb-2" />
                    <span className="text-sm text-blue-100">Humidity</span>
                    <span className="text-xl font-semibold">{main.humidity}%</span>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 flex flex-col items-center justify-center backdrop-blur-sm">
                    <Wind className="text-blue-300 mb-2" />
                    <span className="text-sm text-blue-100">Wind</span>
                    <span className="text-xl font-semibold">{wind.speed} m/s</span>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 flex flex-col items-center justify-center backdrop-blur-sm">
                    <Gauge className="text-blue-300 mb-2" />
                    <span className="text-sm text-blue-100">Pressure</span>
                    <span className="text-xl font-semibold">{main.pressure} hPa</span>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 flex flex-col items-center justify-center backdrop-blur-sm">
                    <span className="flex items-center gap-1 mb-2">
                        <span className="text-xs text-blue-100">AQI</span>
                    </span>
                    <span className={`text-xl font-semibold ${aqiConfig.color}`}>{aqiConfig.label}</span>
                </div>
            </div>

            <div className="flex justify-between mt-6 px-4 text-blue-100 text-sm">
                <div className="flex items-center gap-2">
                    <Sunrise size={18} />
                    <span>Sunrise: {formatDate(sys.sunrise)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Sunset size={18} />
                    <span>Sunset: {formatDate(sys.sunset)}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default WeatherCard;
