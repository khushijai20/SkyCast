import { motion } from 'framer-motion';
import {
    Wind, Droplets, Thermometer, Eye,
    ArrowUp, ArrowDown, Sunrise, Sunset,
    Timer, CloudLightning, Activity
} from 'lucide-react';
import { format } from 'date-fns';

const HighlightCard = ({ title, value, unit, icon: Icon, description, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="glass-card rounded-[2rem] p-6 flex flex-col justify-between"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl ${color} bg-opacity-20 flex items-center justify-center`}>
                <Icon size={20} className={color.replace('bg-', 'text-')} />
            </div>
            <span className="text-white/30 text-[10px] font-black uppercase tracking-widest">{title}</span>
        </div>

        <div>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
                <span className="text-white/40 font-medium">{unit}</span>
            </div>
            <p className="text-white/40 text-[11px] mt-2 font-medium leading-relaxed">
                {description}
            </p>
        </div>
    </motion.div>
);

const WeatherHighlights = ({ weather, airQuality }) => {
    if (!weather) return null;

    const { main, wind, visibility, sys } = weather;
    const aqi = airQuality?.list?.[0]?.main?.aqi || 1;

    const aqiText = ["Good", "Fair", "Moderate", "Poor", "Very Poor"][aqi - 1];
    const aqiColor = ["bg-green-500", "bg-yellow-500", "bg-orange-500", "bg-red-500", "bg-purple-500"][aqi - 1];

    const highlights = [
        {
            title: "Feels Like",
            value: Math.round(main.feels_like),
            unit: "°",
            icon: Thermometer,
            description: "Humidity is making it feel warmer.",
            color: "bg-orange-500",
            delay: 0.1
        },
        {
            title: "Wind Speed",
            value: (wind.speed * 3.6).toFixed(1), // Convert m/s to km/h
            unit: "km/h",
            icon: Wind,
            description: `Direction: ${wind.deg}° degrees`,
            color: "bg-blue-500",
            delay: 0.2
        },
        {
            title: "Humidity",
            value: main.humidity,
            unit: "%",
            icon: Droplets,
            description: "The dew point is 12° right now.",
            color: "bg-cyan-500",
            delay: 0.3
        },
        {
            title: "Visibility",
            value: (visibility / 1000).toFixed(1),
            unit: "km",
            icon: Eye,
            description: "Clear view of the horizon.",
            color: "bg-indigo-500",
            delay: 0.4
        },
        {
            title: "Pressure",
            value: main.pressure,
            unit: "hPa",
            icon: Timer,
            description: "Atmospheric pressure is stable.",
            color: "bg-purple-500",
            delay: 0.5
        },
        {
            title: "Air Quality",
            value: aqiText,
            unit: "",
            icon: Activity,
            description: "Air is healthy for outdoor activities.",
            color: aqiColor,
            delay: 0.6
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {highlights.map((h, i) => (
                <HighlightCard key={i} {...h} />
            ))}

            {/* Sunrise & Sunset - Wide Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="glass-card rounded-[2rem] p-6 lg:col-span-1 xl:col-span-3 flex flex-col md:flex-row gap-8 justify-around items-center"
            >
                <div className="flex items-center gap-6">
                    <div className="p-4 rounded-3xl bg-yellow-500/20">
                        <Sunrise size={32} className="text-yellow-400" />
                    </div>
                    <div>
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Sunrise</p>
                        <p className="text-2xl font-bold text-white">{format(new Date(sys.sunrise * 1000), 'p')}</p>
                    </div>
                </div>

                <div className="w-px h-12 bg-white/10 hidden md:block"></div>

                <div className="flex items-center gap-6">
                    <div className="p-4 rounded-3xl bg-orange-500/20">
                        <Sunset size={32} className="text-orange-400" />
                    </div>
                    <div>
                        <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Sunset</p>
                        <p className="text-2xl font-bold text-white">{format(new Date(sys.sunset * 1000), 'p')}</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default WeatherHighlights;
