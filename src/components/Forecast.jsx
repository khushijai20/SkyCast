import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Cloud, Droplets, Thermometer, Wind } from 'lucide-react';

const ForecastItem = ({ day, tempMax, tempMin, icon, condition, delay }) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay }}
        className="flex justify-between items-center px-4 py-3.5 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group"
    >
        <div className="flex flex-col">
            <span className="font-bold text-xs text-white/90 group-hover:text-white transition-colors">
                {day}
            </span>
            <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">
                {condition}
            </span>
        </div>

        <div className="flex items-center gap-3">
            <img
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt="weather"
                className="w-10 h-10 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all"
            />
        </div>

        <div className="flex gap-4 items-center min-w-[70px] justify-end">
            <div className="flex flex-col items-end">
                <span className="text-sm font-black text-white tracking-tighter">
                    {Math.round(tempMax)}°
                </span>
                <span className="text-[10px] font-bold text-white/20 tracking-tighter">
                    {Math.round(tempMin)}°
                </span>
            </div>
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
                className="glass-panel rounded-[2.5rem] p-7 flex-grow flex flex-col"
            >
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                            <Calendar size={20} className="text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-white/90 uppercase tracking-widest">Weekly Forecast</h3>
                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] leading-none mt-1">Next 5 Days</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-1 flex-grow">
                    {dailyForecast.length > 0 ? (
                        dailyForecast.map((item, idx) => (
                            <ForecastItem
                                key={idx}
                                day={idx === 0 ? "Tomorrow" : format(new Date(item.dt * 1000), 'EEEE')}
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
                            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Syncing Forecast Data</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 group hover:bg-white/10 transition-colors border border-transparent hover:border-white/5">
                            <div className="text-blue-400 group-hover:rotate-12 transition-transform">
                                <Wind size={16} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-tighter">Forecast Wind</span>
                                <span className="text-xs font-bold text-white">{Math.round(dailyForecast[0]?.wind?.speed || 0)} km/h</span>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 group hover:bg-white/10 transition-colors border border-transparent hover:border-white/5">
                            <div className="text-indigo-400 group-hover:scale-110 transition-transform">
                                <Droplets size={16} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-white/20 uppercase tracking-tighter">Humidity</span>
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
                className="bg-indigo-500/20 backdrop-blur-3xl border border-indigo-500/20 rounded-[2rem] p-6 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/20 blur-3xl -mr-8 -mt-8"></div>
                <div className="flex items-center gap-2 mb-3 relative z-10">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                        <Thermometer size={12} className="text-indigo-400" />
                    </div>
                    <span className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em]">SkyCast Insight</span>
                </div>
                <p className="text-[11px] text-white/60 leading-relaxed font-medium relative z-10">
                    Temperature will {dailyForecast[1]?.main?.temp > dailyForecast[0]?.main?.temp ? 'rise' : 'cool down'} by {Math.abs(Math.round((dailyForecast[1]?.main?.temp || 0) - (dailyForecast[0]?.main?.temp || 0)))}°C tomorrow.
                    {dailyForecast[0]?.weather[0].main.includes('Rain') ? ' It’s advised to carry an umbrella for your commute.' : ' Perfect conditions for your morning workout.'}
                </p>
            </motion.div>
        </div>
    );
};

export default Forecast;
