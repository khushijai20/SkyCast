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
import WeatherHighlights from './components/WeatherHighlights';
import { getAISuggestions } from './utils/aiLogic';
import { Github, History, Info, ExternalLink, Star } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

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
    if (!weather) return 'from-indigo-900 via-slate-900 to-black';
    const main = weather.weather[0].main.toLowerCase();
    const isNight = weather.weather[0].icon.includes('n');

    if (isNight) return 'from-slate-950 via-blue-950 to-indigo-950';
    if (main.includes('clear')) return 'from-sky-500 via-indigo-500 to-purple-600';
    if (main.includes('cloud')) return 'from-blue-600 via-slate-500 to-gray-700';
    if (main.includes('rain') || main.includes('drizzle')) return 'from-slate-800 via-blue-900 to-slate-950';
    if (main.includes('snow')) return 'from-blue-100 via-sky-200 to-indigo-200';
    if (main.includes('thunderstorm')) return 'from-purple-900 via-slate-950 to-black';

    return 'from-indigo-600 via-purple-600 to-pink-500';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundClass()} transition-all duration-1000 flex flex-col items-center custom-scrollbar selection:bg-indigo-500/30`}>
      <WeatherAlerts weather={weather} />

      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-12">
          <Logo />
          <div className="hidden lg:flex items-center gap-8 text-white/50 text-xs font-black uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-white transition-colors">Dashboard</a>
            <a href="#" className="hover:text-white transition-colors">Forecasting</a>
            <a href="#" className="hover:text-white transition-colors">Analytics</a>
          </div>
        </div>

        <div className="flex-1 max-w-lg mx-12 hidden md:block">
          <Search onSearch={fetchWeather} onLocation={fetchWeatherByCoords} />
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <button className="hidden sm:flex items-center gap-2 bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
            <Star size={14} className={favorites.length > 0 ? "text-yellow-400 fill-yellow-400" : ""} />
            Favorites
          </button>
        </div>
      </nav>

      {/* Mobile Search */}
      <div className="w-full px-6 md:hidden mt-2 mb-6">
        <Search onSearch={fetchWeather} onLocation={fetchWeatherByCoords} />
      </div>

      <main className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-4 flex-grow">
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
              className="flex flex-col items-center justify-center p-16 glass-panel rounded-[3rem] mt-10 max-w-2xl mx-auto text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
              <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
                <Info size={48} className="text-red-400" />
              </div>
              <h2 className="text-4xl text-white font-black mb-4 tracking-tight">{error}</h2>
              <p className="text-white/50 mb-10 text-lg font-medium leading-relaxed">The city you're looking for seems to be off the grid. <br />Check for typos or try a different location.</p>
              <button
                onClick={() => fetchWeather("London")}
                className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95"
              >
                Back to London
              </button>
            </motion.div>
          ) : (
            weather && (
              <div className="flex flex-col gap-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                  {/* Left Column: Hero & Highlights */}
                  <div className="lg:col-span-3 space-y-10">
                    <WeatherCard
                      weather={weather}
                      isFavorite={favorites.includes(weather.name)}
                      toggleFavorite={() => toggleFavorite(weather.name)}
                    />

                    <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between px-2">
                        <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.3em]">Today's Overviews</h3>
                        <div className="h-px bg-white/10 flex-grow mx-8 hidden sm:block"></div>
                        <div className="flex gap-2 text-white/30">
                          <div className="w-2 h-2 rounded-full bg-white/20"></div>
                          <div className="w-2 h-2 rounded-full bg-white/20"></div>
                        </div>
                      </div>
                      <WeatherHighlights weather={weather} airQuality={airQuality} />
                    </div>

                    <div id="ai-assistant">
                      <AISuggestions suggestions={aiSuggestions} />
                    </div>
                  </div>

                  {/* Right Column: Forecast */}
                  <div className="lg:col-span-1 space-y-10">
                    <Forecast forecast={forecast} />

                    {/* Recent Search Cards */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="glass-panel rounded-[2.5rem] p-8"
                    >
                      <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <History size={14} className="text-indigo-400" /> Recent Lookups
                      </h3>
                      <div className="space-y-4">
                        {history.length === 0 ? (
                          <div className="text-center py-6">
                            <p className="text-xs text-white/20 font-medium italic">History is clear</p>
                          </div>
                        ) : (
                          history.map((city, idx) => (
                            <button
                              key={idx}
                              onClick={() => fetchWeather(city)}
                              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all group"
                            >
                              <span className="font-bold text-white/80 group-hover:text-white">{city}</span>
                              <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-white/20 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                                <ExternalLink size={12} />
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            )
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-10 py-16 mt-20 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <Logo />
            <p className="text-sm text-white/40 font-medium leading-relaxed max-w-xs">
              State-of-the-art weather intelligence platform providing real-time data insights for a smarter lifestyle.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Resources</h4>
            <a href="#" className="text-sm text-white/50 hover:text-indigo-400 transition-colors">Documentation</a>
            <a href="#" className="text-sm text-white/50 hover:text-indigo-400 transition-colors">API Reference</a>
            <a href="#" className="text-sm text-white/50 hover:text-indigo-400 transition-colors">Open Source</a>
          </div>

          <div className="space-y-6 md:text-right flex flex-col items-center md:items-end">
            <div className="flex gap-4">
              <a href="https://github.com" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 transition-all border border-white/10">
                <Github size={20} />
              </a>
            </div>
            <p className="text-xs text-white/20 font-medium">Developed with Passion by <span className="text-white/40">Senior Engineer</span></p>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/[0.02] text-center">
          <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">© 2026 SkyCast Intelligence Systems</p>
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
