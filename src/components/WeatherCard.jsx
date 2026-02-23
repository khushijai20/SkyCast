import { Droplets, Wind, Thermometer, Sunrise, Sunset, Gauge, Heart, Eye, Sun, Navigation } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const HighlightCard = ({ icon: Icon, label, value, subValue, colorClass = "text-white" }) => (
    <motion.div
        whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
        className="glass-card rounded-3xl p-5 flex flex-col justify-between transition-all duration-300"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-xl bg-white/5 ${colorClass}`}>
                <Icon size={20} />
            </div>
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{label}</span>
        </div>
        <div>
            <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
            {subValue && <div className="text-white/50 text-xs mt-1 font-medium">{subValue}</div>}
        </div>
    </motion.div>
);

const WeatherCard = ({ weather, airQuality, isFavorite, toggleFavorite }) => {
    if (!weather) return null;

    const { main, wind, sys, weather: weatherDetails, name, visibility } = weather;
    const description = weatherDetails[0].description;
    const iconCode = weatherDetails[0].icon;
    const isNight = iconCode.includes('n');

    const formatDate = (timestamp) => {
        return format(new Date(timestamp * 1000), 'h:mm a');
    };

    const getAqiConfig = (aqi) => {
        const levels = {
            1: { label: 'Good', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
            2: { label: 'Fair', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
            3: { label: 'Moderate', color: 'text-orange-400', bg: 'bg-orange-400/10' },
            4: { label: 'Poor', color: 'text-red-400', bg: 'bg-red-400/10' },
            5: { label: 'Very Poor', color: 'text-purple-400', bg: 'bg-purple-400/10' },
        };
        return levels[aqi] || { label: 'Unknown', color: 'text-gray-400', bg: 'bg-gray-400/10' };
    };

    const aqiConfig = getAqiConfig(airQuality?.list?.[0]?.main?.aqi);

    return (
        <div className="space-y-8">
            {/* Main Weather Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-[2.5rem] p-8 md:p-10 overflow-hidden relative"
            >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-white/80 uppercase tracking-widest flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                Live Report
                            </span>
                            <span className="text-white/40 text-xs font-medium tracking-wide">
                                {format(new Date(), 'EEEE, dd MMM yyyy')}
                            </span>
                        </div>

                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight flex items-center gap-2">
                                    {name}
                                    <span className="text-xl font-medium text-white/40">{sys.country}</span>
                                </h2>
                                <p className="text-xl text-white/70 mt-2 font-medium capitalize prose">
                                    {description}
                                </p>
                            </div>
                            <button
                                onClick={toggleFavorite}
                                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-90"
                            >
                                <Heart
                                    size={24}
                                    fill={isFavorite ? "#ef4444" : "none"}
                                    className={isFavorite ? "text-red-500" : "text-white/60"}
                                />
                            </button>
                        </div>

                        <div className="mt-10 flex items-center gap-6">
                            <div className="text-8xl md:text-9xl font-bold text-white tracking-tighter drop-shadow-2xl flex">
                                {Math.round(main.temp)}
                                <span className="text-4xl md:text-5xl font-light text-white/40 mt-6 md:mt-10">°C</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-white/60">
                                    <Thermometer size={16} />
                                    <span className="text-sm font-medium">Feels like {Math.round(main.feels_like)}°</span>
                                </div>
                                <div className="flex items-center gap-2 text-white/60">
                                    <Navigation size={16} />
                                    <span className="text-sm font-medium">Pressure: {main.pressure} hPa</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-white/5 rounded-[2rem] p-8 order-first md:order-last border border-white/5 backdrop-blur-sm self-start md:self-stretch">
                        <motion.img
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            key={iconCode}
                            transition={{ type: "spring", stiffness: 100 }}
                            src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`}
                            alt={description}
                            className="w-40 h-40 md:w-56 md:h-56 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        />
                        <div className="text-white font-semibold text-lg -mt-4 uppercase tracking-widest opacity-80">
                            {weatherDetails[0].main}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <HighlightCard
                    icon={Droplets}
                    label="Humidity"
                    value={`${main.humidity}%`}
                    subValue={main.humidity > 60 ? "Humid air" : "Comfortable"}
                    colorClass="text-blue-400"
                />
                <HighlightCard
                    icon={Wind}
                    label="Wind"
                    value={`${(wind.speed * 3.6).toFixed(1)} km/h`}
                    subValue={`${wind.deg}° Direction`}
                    colorClass="text-indigo-400"
                />
                <HighlightCard
                    icon={Eye}
                    label="Visibility"
                    value={`${(visibility / 1000).toFixed(1)} km`}
                    subValue={visibility > 5000 ? "Clear vision" : "Low visibility"}
                    colorClass="text-cyan-400"
                />
                <HighlightCard
                    icon={Sun}
                    label="Air Quality"
                    value={aqiConfig.label}
                    subValue={`Index: ${airQuality?.list?.[0]?.main?.aqi || 0}`}
                    colorClass={aqiConfig.color}
                />

                {/* Sun & Moon Grid */}
                <div className="col-span-2 glass-card rounded-3xl p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-orange-400/10 text-orange-400">
                            <Sunrise size={24} />
                        </div>
                        <div>
                            <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Sunrise</div>
                            <div className="text-xl font-bold text-white">{formatDate(sys.sunrise)}</div>
                        </div>
                    </div>
                    <div className="h-10 w-[1px] bg-white/10 mx-4"></div>
                    <div className="flex items-center gap-4 text-right">
                        <div>
                            <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Sunset</div>
                            <div className="text-xl font-bold text-white">{formatDate(sys.sunset)}</div>
                        </div>
                        <div className="p-3 rounded-2xl bg-indigo-400/10 text-indigo-400">
                            <Sunset size={24} />
                        </div>
                    </div>
                </div>

                <HighlightCard
                    icon={Gauge}
                    label="Pressure"
                    value={`${main.pressure} hPa`}
                    subValue="Standard"
                    colorClass="text-sky-400"
                />
                <HighlightCard
                    icon={Thermometer}
                    label="Ground"
                    value={`${Math.round(main.temp_max)}° / ${Math.round(main.temp_min)}°`}
                    subValue="Daily Range"
                    colorClass="text-rose-400"
                />
            </div>
        </div>
    );
};

export default WeatherCard;
