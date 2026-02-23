import { useState, useEffect } from 'react';
import { useWeather } from './hooks/useWeather';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import Search from './components/Search';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import AISuggestions from './components/AISuggestions';
import Logo from './components/Logo';
import SkeletonLoader from './components/SkeletonLoader';
import WeatherAlerts from './components/WeatherAlerts';
import { getAISuggestions } from './utils/aiLogic';
import { Github, MapPin, Star, History, Info, ExternalLink } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import WeatherMap from './components/WeatherMap';

function AppContent() {
  const { weather, forecast, airQuality, loading, error, fetchWeather, fetchWeatherByCoords } = useWeather();
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('weather_favorites')) || []);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('search_history')) || []);

  useEffect(() => {
    localStorage.setItem('weather_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const handleStorageChange = () => {
      setHistory(JSON.parse(localStorage.getItem('search_history')) || []);
    }
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleFavorite = (cityName) => {
    setFavorites(prev =>
      prev.includes(cityName)
        ? prev.filter(c => c !== cityName)
        : [...prev, cityName]
    );
  };

  useEffect(() => {
    if (weather) {
      setAiSuggestions(getAISuggestions(weather));
    }
  }, [weather]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        () => fetchWeather("London")
      );
    } else {
      fetchWeather("London");
    }
  }, []);

  const getBackgroundClass = () => {
    if (!weather) return 'from-indigo-600 via-purple-600 to-pink-500';
    const main = weather.weather[0].main.toLowerCase();
    const isNight = weather.weather[0].icon.includes('n');

    if (isNight) return 'from-slate-950 via-blue-950 to-indigo-900';
    if (main.includes('clear')) return 'from-sky-400 via-blue-500 to-indigo-600';
    if (main.includes('cloud')) return 'from-blue-500 via-slate-400 to-gray-500';
    if (main.includes('rain') || main.includes('drizzle')) return 'from-slate-800 via-blue-900 to-slate-900';
    if (main.includes('snow')) return 'from-blue-100 via-sky-200 to-indigo-100';
    if (main.includes('thunderstorm')) return 'from-purple-900 via-slate-900 to-black';

    return 'from-indigo-600 via-purple-600 to-pink-500';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundClass()} transition-all duration-1000 flex flex-col items-center custom-scrollbar`}>
      <WeatherAlerts weather={weather} />
      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Logo />
          <div className="hidden lg:flex items-center gap-6 text-white/70 font-medium">
            <a href="#" className="hover:text-white transition-colors">Dashboard</a>
            <a href="#" className="hover:text-white transition-colors">Forecasting</a>
            <a href="#satellite-map" className="hover:text-white transition-colors flex items-center gap-1">
              Satellite <ExternalLink size={12} />
            </a>
          </div>
        </div>
        <div className="flex-1 max-w-md mx-6 hidden md:block">
          <Search onSearch={fetchWeather} onLocation={fetchWeatherByCoords} />
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <button className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-sm font-medium transition-all active:scale-95">
            <Star size={16} className={favorites.length > 0 ? "text-yellow-400 fill-yellow-400" : ""} />
            Favorites
          </button>
        </div>
      </nav>

      {/* Mobile Search - Visible only on mobile */}
      <div className="w-full px-4 md:hidden mt-2 mb-4">
        <Search onSearch={fetchWeather} onLocation={fetchWeatherByCoords} />
      </div>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-grow">
        <AnimatePresence mode='wait'>
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonLoader />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center p-12 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-2xl mt-10 max-w-xl mx-auto text-center"
            >
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                <Info size={40} className="text-red-400" />
              </div>
              <h2 className="text-3xl text-white font-bold mb-4">{error}</h2>
              <p className="text-white/60 mb-8">We couldn't find the weather data for that location. Please try searching for a major city.</p>
              <button
                onClick={() => fetchWeather("London")}
                className="px-8 py-3 bg-white text-indigo-600 rounded-full font-bold hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
              >
                Reset to London
              </button>
            </motion.div>
          ) : (
            weather && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-4 gap-8"
              >
                {/* Left Side: Current Weather & Highlights */}
                <div className="lg:col-span-3 space-y-8">
                  <WeatherCard
                    weather={weather}
                    airQuality={airQuality}
                    isFavorite={favorites.includes(weather.name)}
                    toggleFavorite={() => toggleFavorite(weather.name)}
                  />

                  {/* Satellite Section */}
                  <div id="satellite-map" className="scroll-mt-24">
                    <WeatherMap
                      lat={weather.coord.lat}
                      lon={weather.coord.lon}
                      city={weather.name}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-7">
                      <AISuggestions suggestions={aiSuggestions} />
                    </div>
                    <div className="md:col-span-5 flex flex-col gap-6">
                      <div className="glass-card rounded-[2rem] p-6 flex-grow">
                        <h3 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                          <History size={16} /> Search History
                        </h3>
                        <div className="space-y-3">
                          {history.length === 0 ? (
                            <p className="text-white/40 text-sm italic">Recently searched cities will appear here.</p>
                          ) : (
                            history.map((city, idx) => (
                              <button
                                key={idx}
                                onClick={() => fetchWeather(city)}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/10 text-white transition-all text-left"
                              >
                                <span>{city}</span>
                                <MapPin size={14} className="text-white/40" />
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Forecast */}
                <div className="lg:col-span-1">
                  <Forecast forecast={forecast} />
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-12 border-t border-white/10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start">
            <Logo />
            <p className="text-white/40 text-sm mt-4">© 2026 SkyCast Intelligence. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-8 text-white/50 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">API Docs</a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all"
            >
              <Github size={20} />
            </a>
          </div>
        </div>
        <div className="mt-8 text-center md:text-right">
          <p className="text-white/30 text-xs">Developed with ❤️ by Senior Engineer</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
