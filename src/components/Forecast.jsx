import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Cloud, Droplets, Thermometer, Wind } from 'lucide-react';

const ForecastItem = ({ day, tempMax, tempMin, icon, condition, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="flex justify-between items-center px-4 py-4 rounded-2xl hover:bg-white/5 transition-all group"
    >
        <div className="flex flex-col">
            <span className="font-bold text-sm text-white/90 group-hover:text-white transition-colors">
                {day}
            </span>
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-tight">
                {condition}
            </span>
        </div>

        <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-white/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                <img
                    src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                    alt="weather"
                    className="w-10 h-10 group-hover:scale-110 transition-transform relative z-10"
                />
            </div>
        </div>

        <div className="flex gap-4 items-center min-w-[80px] justify-end">
            <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-white tracking-tight">
                    {Math.round(tempMax)}°
                </span>
                <span className="text-[10px] font-bold text-white/30 tracking-tight">
                    {Math.round(tempMin)}°
                </span>
            </div>
            <div className="w-[3px] h-8 bg-gradient-to-b from-indigo-500/40 to-transparent rounded-full"></div>
        </div>
    </motion.div>
);

const Forecast = ({ forecast }) => {
    if (!forecast || !forecast.list) return null;

    // Filter by "12:00:00" for Daily view
    const dailyForecast = forecast.list.filter(item => item.dt_txt.includes("12:00:00"));

    return (
        <div className="space-y-6 h-full flex flex-col">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card rounded-[2.5rem] p-7 flex-grow flex flex-col"
            >
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                            <Calendar size={18} className="text-indigo-400" />
                        </div>
                        <h3 className="text-sm font-bold text-white/90 uppercase tracking-[0.1em]">5-Day Forecast</h3>
                    </div>
                    <span className="text-[10px] font-bold text-white/30 bg-white/5 px-3 py-1 rounded-full uppercase">
                        Updated
                    </span>
                </div>

                <div className="space-y-1 flex-grow">
                    {dailyForecast.length > 0 ? (
                        dailyForecast.map((item, idx) => (
                            <ForecastItem
                                key={idx}
                                day={format(new Date(item.dt * 1000), 'EEEE')}
                                tempMax={item.main.temp_max}
                                tempMin={item.main.temp_min}
                                icon={item.weather[0].icon}
                                condition={item.weather[0].main}
                                delay={idx * 0.1}
                            />
                        ))
                    ) : (
                        <div className="py-20 text-center space-y-4">
                            <div className="animate-pulse flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-white/5"></div>
                                <div className="h-4 w-24 bg-white/5 rounded"></div>
                            </div>
                            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Awaiting Data Sync</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 group hover:bg-white/10 transition-colors">
                            <div className="text-blue-400 transform group-hover:rotate-12 transition-transform">
                                <Wind size={16} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-white/30 uppercase tracking-tighter">Avg Wind</span>
                                <span className="text-xs font-bold text-white">{Math.round(dailyForecast[0]?.wind?.speed || 0)} km/h</span>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 group hover:bg-white/10 transition-colors">
                            <div className="text-indigo-400 transform group-hover:scale-110 transition-transform">
                                <Droplets size={16} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black text-white/30 uppercase tracking-tighter">Humidity</span>
                                <span className="text-xs font-bold text-white">{dailyForecast[0]?.main?.humidity || 0}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* AI Insight Snippet */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-indigo-600/30 backdrop-blur-md border border-indigo-500/30 rounded-[2rem] p-5"
            >
                <div className="flex items-center gap-2 mb-2">
                    <Thermometer size={14} className="text-indigo-300" />
                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">SkyCast Insight</span>
                </div>
                <p className="text-[11px] text-white/70 leading-relaxed">
                    Temperature will {dailyForecast[1]?.main?.temp > dailyForecast[0]?.main?.temp ? 'rise' : 'cool down'} by {Math.abs(Math.round((dailyForecast[1]?.main?.temp || 0) - (dailyForecast[0]?.main?.temp || 0)))}°C tomorrow.
                    {dailyForecast[0]?.weather[0].main.includes('Rain') ? ' Keep your umbrella handy.' : ' Perfect for outdoor activities.'}
                </p>
            </motion.div>
        </div>
    );
};

export default Forecast;
