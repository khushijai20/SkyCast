import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, MapPin, Mic, X, History, Clock, Command, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchCities } from '../api/weather';

const Search = ({ onSearch, onLocation }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('search_history')) || []);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('search_history', JSON.stringify(history));
    }, [history]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 2) {
            setShowDropdown(true);
            setIsSearching(true);
            try {
                const results = await searchCities(value);
                setSuggestions(results);
            } catch (error) {
                console.error("Error fetching suggestions", error);
            } finally {
                setIsSearching(false);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSearch = (city) => {
        if (!city) return;
        onSearch(city);
        setQuery('');
        setSuggestions([]);
        setShowDropdown(false);
        addToHistory(city);
    };

    const addToHistory = (city) => {
        setHistory(prev => {
            const newHistory = [city, ...prev.filter(item => item !== city)].slice(0, 5);
            return newHistory;
        });
    };

    const clearHistory = (e) => {
        e.stopPropagation();
        setHistory([]);
    }

    const handleVoiceSearch = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice search not supported in this browser.");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            handleSearch(transcript);
        };

        recognition.start();
    };

    return (
        <div className="relative w-full z-50" ref={dropdownRef}>
            <div className="relative flex items-center bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 transition-all duration-300 focus-within:ring-2 focus-within:ring-white/30 focus-within:bg-white/15">
                <div className="pl-4 pr-2 text-white/40">
                    {isSearching ? <Loader2 size={18} className="animate-spin" /> : <SearchIcon size={18} />}
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => setShowDropdown(true)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                    placeholder="Search for a city..."
                    className="w-full bg-transparent border-none outline-none text-white placeholder-white/40 px-2 py-4 font-medium text-sm"
                />

                <div className="flex items-center gap-1 pr-2">
                    <AnimatePresence>
                        {query && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={() => setQuery('')}
                                className="p-2 text-white/40 hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <div className="h-6 w-[1px] bg-white/10 mx-1"></div>

                    <button
                        onClick={handleVoiceSearch}
                        className={`p-2 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
                        title="Voice Search"
                    >
                        <Mic size={18} />
                    </button>
                    <button
                        onClick={onLocation}
                        className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                        title="My Location"
                    >
                        <MapPin size={18} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showDropdown && (query.length > 2 || history.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 right-0 mt-3 bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50"
                    >
                        {suggestions.length > 0 && (
                            <div className="p-3">
                                <div className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                    <Command size={10} /> Locations
                                </div>
                                {suggestions.map((city, index) => (
                                    <motion.div
                                        key={`${city.lat}-${city.lon}-${index}`}
                                        whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                                        onClick={() => handleSearch(city.name)}
                                        className="px-4 py-3 rounded-xl cursor-pointer flex items-center justify-between group transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white group-hover:bg-indigo-500/20 transition-all">
                                                <MapPin size={14} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-white/90">{city.name}</span>
                                                <span className="text-[10px] text-white/40 font-medium">{city.country}</span>
                                            </div>
                                        </div>
                                        <div className="text-white/0 group-hover:text-white/40 transition-all">
                                            <X size={14} className="rotate-45" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {history.length > 0 && query.length <= 2 && (
                            <div className="p-3 border-t border-white/5 bg-white/[0.02]">
                                <div className="flex justify-between items-center px-3 py-2">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                        <History size={10} /> Recent Searches
                                    </div>
                                    <button onClick={clearHistory} className="text-[10px] font-bold text-red-400/60 hover:text-red-400 px-2 py-1 rounded">Clear</button>
                                </div>
                                {history.map((city, index) => (
                                    <motion.div
                                        key={city + index}
                                        whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                                        onClick={() => handleSearch(city)}
                                        className="px-4 py-3 rounded-xl cursor-pointer flex items-center justify-between group transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-all">
                                                <Clock size={14} />
                                            </div>
                                            <span className="text-sm font-medium text-white/70 group-hover:text-white">{city}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {!isSearching && suggestions.length === 0 && query.length > 2 && (
                            <div className="p-8 text-center">
                                <div className="text-white/20 mb-2 flex justify-center">
                                    <X size={32} />
                                </div>
                                <p className="text-sm text-white/40 font-medium">No locations found for "{query}"</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Search;
