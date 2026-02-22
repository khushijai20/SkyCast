import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, MapPin, Mic, X, History, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchCities } from '../api/weather';

const Search = ({ onSearch, onLocation }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('search_history')) || []);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isListening, setIsListening] = useState(false);
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
            try {
                const results = await searchCities(value);
                setSuggestions(results);
            } catch (error) {
                console.error("Error fetching suggestions", error);
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
        recognition.continuous = false; // Stop after one sentence

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
        <div className="relative w-full max-w-md z-50" ref={dropdownRef}>
            <div className="relative flex items-center bg-white/20 backdrop-blur-md rounded-full shadow-lg border border-white/30 transition-all focus-within:ring-2 focus-within:ring-white/50">
                <SearchIcon className="w-5 h-5 text-white ml-4" />
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => setShowDropdown(true)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
                    placeholder="Search city..."
                    className="w-full bg-transparent border-none outline-none text-white placeholder-white/70 px-4 py-3"
                />
                {query && (
                    <button onClick={() => setQuery('')} className="p-2 text-white/70 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                )}
                <div className="flex items-center pr-2 border-l border-white/20 pl-2 gap-1">
                    <button
                        onClick={handleVoiceSearch}
                        className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 animate-pulse text-white' : 'text-white hover:bg-white/10'}`}
                        title="Voice Search"
                    >
                        <Mic className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onLocation}
                        className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                        title="Use Current Location"
                    >
                        <MapPin className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showDropdown && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl text-white"
                    >
                        {suggestions.length > 0 && (
                            <div className="p-2">
                                <div className="text-xs font-semibold text-white/60 px-3 py-1">Suggestions</div>
                                {suggestions.map((city, index) => (
                                    <div
                                        key={`${city.lat}-${city.lon}-${index}`}
                                        onClick={() => handleSearch(city.name)}
                                        className="px-3 py-2 hover:bg-white/10 rounded-lg cursor-pointer flex items-center gap-2"
                                    >
                                        <MapPin className="w-4 h-4 text-white/70" />
                                        <span>{city.name}, {city.country}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {history.length > 0 && query.length < 3 && (
                            <div className="p-2 border-t border-white/10">
                                <div className="flex justify-between items-center px-3 py-1">
                                    <div className="text-xs font-semibold text-white/60 flex items-center gap-1">
                                        <History className="w-3 h-3" /> Recent History
                                    </div>
                                    <button onClick={clearHistory} className="text-xs text-red-300 hover:text-red-200">Clear</button>
                                </div>
                                {history.map((city, index) => (
                                    <div
                                        key={city + index}
                                        onClick={() => handleSearch(city)}
                                        className="px-3 py-2 hover:bg-white/10 rounded-lg cursor-pointer flex items-center gap-2"
                                    >
                                        <Clock className="w-4 h-4 text-white/50" />
                                        <span>{city}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Search;
