import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Wind, Droplets, ArrowUp, ArrowDown, Star } from 'lucide-react';
import { format } from 'date-fns';

const WeatherCard = ({ weather, isFavorite, toggleFavorite }) => {
    if (!weather) return null;

    const { main, weather: details, name, sys, dt } = weather;
    const condition = details[0].main;
    const description = details[0].description;
    const iconCode = details[0].icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="glass-panel rounded-[3rem] p-10 relative overflow-hidden group"
        >
            {/* Dynamic Background Visuals */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] -mr-16 -mt-16 group-hover:bg-indigo-500/30 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-[80px] -ml-12 -mb-12"></div>

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:rotate-12 transition-transform duration-500">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h2 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                                    {name} <span className="text-xl font-medium text-white/30">{sys.country}</span>
                                </h2>
                                <div className="flex items-center gap-4 mt-1">
                                    <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-black uppercase tracking-widest">
                                        <Calendar size={12} /> {format(new Date(dt * 1000), 'EEEE, d MMM')}
                                    </div>
                                    <div className="w-1 h-1 rounded-full bg-white/20"></div>
                                    <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-black uppercase tracking-widest">
                                        <Clock size={12} /> {format(new Date(), 'p')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={toggleFavorite}
                        className={`p-4 rounded-3xl transition-all duration-300 ${isFavorite
                                ? 'bg-yellow-500 text-slate-900 border-none scale-110 shadow-[0_0_20px_rgba(234,179,8,0.4)]'
                                : 'bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <Star size={24} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="flex items-center gap-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/20 blur-[50px] scale-150 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <img
                                src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`}
                                alt={condition}
                                className="w-48 h-48 relative z-10 animate-float"
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-start">
                                <span className="text-9xl font-black text-white tracking-tighter leading-none drop-shadow-2xl">
                                    {Math.round(main.temp)}
                                </span>
                                <span className="text-5xl font-bold text-indigo-400 mt-4 leading-none">°</span>
                            </div>
                            <div className="mt-2 text-center md:text-left">
                                <p className="text-2xl font-bold text-white/90 capitalize tracking-tight">{condition}</p>
                                <p className="text-sm font-medium text-white/40 uppercase tracking-[0.2em]">{description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
                        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center min-w-[140px] group/item hover:bg-white/10 transition-colors">
                            <ArrowUp size={20} className="text-red-400 mb-2 group-hover/item:-translate-y-1 transition-transform" />
                            <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Max Temp</span>
                            <span className="text-xl font-bold text-white">{Math.round(main.temp_max)}°</span>
                        </div>
                        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 flex flex-col items-center min-w-[140px] group/item hover:bg-white/10 transition-colors">
                            <ArrowDown size={20} className="text-blue-400 mb-2 group-hover/item:translate-y-1 transition-transform" />
                            <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Min Temp</span>
                            <span className="text-xl font-bold text-white">{Math.round(main.temp_min)}°</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        </motion.div>
    );
};

export default WeatherCard;
