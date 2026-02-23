import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Info, CloudRain, Wind } from 'lucide-react';
import { useState, useEffect } from 'react';

const WeatherAlerts = ({ weather }) => {
    const [showAlert, setShowAlert] = useState(false);
    const [alertData, setAlertData] = useState(null);

    useEffect(() => {
        if (weather) {
            const condition = weather.weather[0].main.toLowerCase();
            const temp = weather.main.temp;

            if (condition.includes('rain') || condition.includes('storm')) {
                setAlertData({
                    type: 'warning',
                    title: 'Precipitation Alert',
                    message: `Heavy ${condition} expected in ${weather.name}. Stay indoors if possible.`,
                    icon: CloudRain
                });
                setShowAlert(true);
            } else if (temp > 35) {
                setAlertData({
                    type: 'danger',
                    title: 'Extreme Heat Warning',
                    message: `Temperatures reaching ${Math.round(temp)}°C. Stay hydrated!`,
                    icon: AlertTriangle
                });
                setShowAlert(true);
            } else if (weather.wind.speed > 15) {
                setAlertData({
                    type: 'info',
                    title: 'High Wind Advisory',
                    message: `Strong winds detected at ${(weather.wind.speed * 3.6).toFixed(1)} km/h.`,
                    icon: Wind
                });
                setShowAlert(true);
            } else {
                setShowAlert(false);
            }
        }
    }, [weather]);

    return (
        <AnimatePresence>
            {showAlert && alertData && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-lg"
                >
                    <div className="glass-panel rounded-[2rem] p-5 flex items-center gap-4 overflow-hidden relative">
                        {/* Animated background pulse based on type */}
                        <div className={`absolute inset-0 opacity-10 animate-pulse ${alertData.type === 'danger' ? 'bg-red-500' :
                                alertData.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}></div>

                        <div className={`p-4 rounded-2xl flex-shrink-0 ${alertData.type === 'danger' ? 'bg-red-500/20 text-red-400' :
                                alertData.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                            <alertData.icon size={24} />
                        </div>

                        <div className="flex-grow">
                            <h4 className="text-sm font-bold text-white mb-1">{alertData.title}</h4>
                            <p className="text-xs text-white/60 font-medium leading-tight">{alertData.message}</p>
                        </div>

                        <button
                            onClick={() => setShowAlert(false)}
                            className="p-2 text-white/20 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WeatherAlerts;
