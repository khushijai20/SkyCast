import { useState, useEffect } from 'react';
import { useWeather } from './hooks/useWeather';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import Search from './components/Search';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import AISuggestions from './components/AISuggestions';
import Logo from './components/Logo';
import { getAISuggestions } from './utils/aiLogic';
import { Loader2, AlertTriangle, Menu, MapPin, Home } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function AppContent() {
  const { weather, forecast, airQuality, loading, error, fetchWeather, fetchWeatherByCoords } = useWeather();
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('weather_favorites')) || []);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('search_history')) || []);

  // Sync favorites with local storage
  useEffect(() => {
    localStorage.setItem('weather_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Sync history state just for display if needed, though Search component handles its own history
  useEffect(() => {
    const handleStorageChange = () => {
      setHistory(JSON.parse(localStorage.getItem('search_history')) || []);
    }
    window.addEventListener('storage', handleStorageChange);
    // Also update when Search component updates it (we might need a context or callback, but for now simple reload or props)
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleFavorite = (cityName) => {
    setFavorites(prev =>
      prev.includes(cityName)
        ? prev.filter(c => c !== cityName)
        : [...prev, cityName]
    );
  };

  const handleCityClick = (city) => {
    fetchWeather(city);
    setSidebarOpen(false); // Close sidebar on mobile on selection
  }

  useEffect(() => {
    if (weather) {
      setAiSuggestions(getAISuggestions(weather));
    }
  }, [weather]);

  // Initial load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.log("Geolocation blocked, defaulting to London");
          fetchWeather("London");
        }
      );
    } else {
      fetchWeather("London");
    }
  }, []);

  const getBackgroundClass = () => {
    if (!weather) return 'from-cyan-400 to-blue-600'; // Sky blue gradient default
    const main = weather.weather[0].main.toLowerCase();
    const isNight = weather.weather[0].icon.includes('n');

    if (isNight) return 'from-slate-900 to-blue-900';
    if (main.includes('clear')) return 'from-sky-400 to-blue-500';
    if (main.includes('cloud')) return 'from-blue-400 to-slate-400';
    if (main.includes('rain') || main.includes('drizzle')) return 'from-slate-700 to-blue-900';
    if (main.includes('snow')) return 'from-sky-100 to-slate-300';
    if (main.includes('thunderstorm')) return 'from-slate-900 to-purple-900';

    return 'from-cyan-400 to-blue-600';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundClass()} transition-all duration-1000 flex overflow-hidden`}>
      {/* Sidebar - Desktop */}
      <motion.aside
        className={`hidden md:flex flex-col w-64 h-screen bg-white/10 backdrop-blur-xl border-r border-white/20 p-6 fixed z-20`}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <Logo />

        <div className="mt-10 flex-grow overflow-y-auto">
          <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-4">Favorites</h3>
          {favorites.length === 0 && <p className="text-white/40 text-sm italic">No favorites yet</p>}
          {favorites.map(city => (
            <div key={city} onClick={() => handleCityClick(city)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 cursor-pointer text-white transition-colors mb-2">
              <Home className="w-4 h-4 text-white/70" />
              <span>{city}</span>
            </div>
          ))}

          <h3 className="text-white/60 text-xs font-semibold uppercase tracking-wider mt-8 mb-4">Recent History</h3>
          {/* Note: We rely on the Search component for history logic, but could lift state up. 
                 For this task, we'll keep the Search component autonomous for history writing, 
                 but reading it here requires sharing state. 
                 For simplicity in this step, I'll allow sidebar to just show simple navigation items or favorites. */
          }
          <div className="p-4 bg-white/5 rounded-xl border border-white/10 mt-4">
            <p className="text-xs text-white/80 leading-relaxed">
              "There's no such thing as bad weather, only unsuitable clothing."
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <ThemeToggle />
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 relative flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="p-4 md:p-8 flex items-center justify-between sticky top-0 z-30">
          <div className="md:hidden">
            <Logo />
          </div>
          <div className="flex-1 max-w-2xl mx-auto px-4">
            <Search onSearch={fetchWeather} onLocation={fetchWeatherByCoords} />
          </div>
        </header>

        <main className="p-4 md:p-8 w-full max-w-6xl mx-auto">
          <AnimatePresence mode='wait'>
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-[50vh]"
              >
                <Loader2 className="w-12 h-12 text-white animate-spin" />
                <p className="text-white mt-4">Forecasting...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-[50vh]"
              >
                <AlertTriangle className="w-16 h-16 text-white/80 mb-4" />
                <h2 className="text-2xl text-white font-bold">{error}</h2>
                <button onClick={() => fetchWeather("London")} className="mt-4 px-6 py-2 bg-white/20 rounded-full text-white">Retry London</button>
              </motion.div>
            ) : (
              weather && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                  {/* Left Column: Current Weather + Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <WeatherCard
                      weather={weather}
                      airQuality={airQuality}
                      isFavorite={favorites.includes(weather.name)}
                      toggleFavorite={() => toggleFavorite(weather.name)}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <AISuggestions suggestions={aiSuggestions} />
                      {/* Could add more charts/graphs here */}
                    </div>
                  </div>

                  {/* Right Column: Forecast */}
                  <div className="lg:col-span-1">
                    <Forecast forecast={forecast} />
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </main>
      </div>
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
