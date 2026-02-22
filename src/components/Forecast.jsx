import { format } from 'date-fns';
import { motion } from 'framer-motion';

const Forecast = ({ forecast }) => {
    if (!forecast || !forecast.list) return null;

    // Hourly Forecast (Next 24 hours - take first 8 items)
    const hourly = forecast.list.slice(0, 8);

    // Daily Forecast (Approximate by taking 12:00 PM entry or the 4th/5th item of each day)
    // Logic: Group by date, pick noon.
    const daily = [];
    const processedDates = new Set();

    forecast.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!processedDates.has(date)) {
            // If it's noon or close to noon, take it. Or just take the first one we see for that day if we want simple.
            // Better: try to find the one closest to 12:00
            if (item.dt_txt.includes("12:00:00")) {
                daily.push(item);
                processedDates.add(date);
            }
        }
    });

    // If no noon data found for a day (e.g. today has passed noon), take the first available for that new day?
    // Let's refine:
    // 1. Group all items by date.
    // 2. For each date, pick the one at 12:00 or max temp.
    // Simply: iterating and if date is new, add. NOTE: This might pick random times.
    // Let's stick to the "12:00:00" filter, but if today doesn't have 12:00 left, we missed it.

    // Alternative simple approach for "Daily":
    // Just Filter by "12:00:00".
    const dailyForecast = forecast.list.filter(item => item.dt_txt.includes("12:00:00"));

    return (
        <div className="w-full max-w-3xl mx-auto mt-8 space-y-8 pb-10">

            {/* Hourly Forecast */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/20 dark:bg-black/30 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-lg"
            >
                <h3 className="text-xl font-semibold text-white mb-4">Hourly Forecast</h3>
                <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
                    {hourly.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center min-w-[60px]">
                            <span className="text-sm text-blue-100">{format(new Date(item.dt * 1000), 'h a')}</span>
                            <img
                                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                                alt="icon"
                                className="w-12 h-12"
                            />
                            <span className="font-bold text-white">{Math.round(item.main.temp)}°</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Daily Forecast */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/20 dark:bg-black/30 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-lg"
            >
                <h3 className="text-xl font-semibold text-white mb-4">5-Day Forecast</h3>
                <div className="space-y-4">
                    {dailyForecast.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-white/90">
                            <span className="w-24 font-medium">{format(new Date(item.dt * 1000), 'EEEE')}</span>
                            <div className="flex items-center gap-2">
                                <img
                                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                                    alt="icon"
                                    className="w-10 h-10"
                                />
                                <span className="capitalize text-sm text-blue-100 hidden sm:block">{item.weather[0].main}</span>
                            </div>
                            <div className="w-24 text-right flex gap-4 justify-end">
                                <span className="font-bold">{Math.round(item.main.temp_max)}°</span>
                                <span className="text-blue-200">{Math.round(item.main.temp_min)}°</span>
                            </div>
                        </div>
                    ))}
                    {dailyForecast.length === 0 && <p className="text-white/60 text-center">Forecast data updating...</p>}
                </div>
            </motion.div>
        </div>
    );
};

export default Forecast;
