import { AlertTriangle, X, Info, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const WeatherAlerts = ({ weather }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        if (!weather) return;

        const condition = weather.weather[0].main.toLowerCase();
        const windSpeed = weather.wind.speed * 3.6; // km/h

        if (condition.includes('thunderstorm')) {
            setAlert({
                type: 'warning',
                title: 'Severe Thunderstorm Warning',
                message: 'Heavy rain and lightning detected in your area. Seek shelter immediately.',
                icon: Zap,
                color: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            });
            setIsVisible(true);
        } else if (windSpeed > 50) {
            setAlert({
                type: 'danger',
                title: 'High Wind Advisory',
                message: 'Dangerous wind gusts detected. Secure loose outdoor objects.',
                icon: AlertTriangle,
                color: 'bg-red-500/20 text-red-400 border-red-500/30'
            });
            setIsVisible(true);
        } else {
            setIsVisible(false);
            setAlert(null);
        }
    }, [weather]);

    return (
        <AnimatePresence>
            {isVisible && alert && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className={`fixed top-24 left-1/2 -translate-x-1/2 z-[60] w-full max-w-lg px-4`}
                >
                    <div className={`glass-morphism rounded-3xl p-4 flex items-start gap-4 shadow-2xl ${alert.color}`}>
                        <div className="mt-1">
                            <alert.icon size={24} />
                        </div>
                        <div className="flex-grow">
                            <h4 className="font-bold text-sm tracking-tight">{alert.title}</h4>
                            <p className="text-xs opacity-80 mt-1 leading-relaxed font-medium">{alert.message}</p>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
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
