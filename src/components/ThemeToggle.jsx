import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative w-14 h-8 rounded-full bg-white/5 border border-white/10 p-1 flex items-center cursor-pointer transition-colors hover:bg-white/10"
        >
            <motion.div
                animate={{ x: isDarkMode ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg flex items-center justify-center relative z-10"
            >
                {isDarkMode ? (
                    <Moon size={12} className="text-white" />
                ) : (
                    <Sun size={12} className="text-white" />
                )}
            </motion.div>

            <div className="absolute inset-0 flex justify-around items-center px-1">
                <Sun size={12} className={`transition-opacity duration-300 ${isDarkMode ? 'opacity-30' : 'opacity-0'}`} />
                <Moon size={12} className={`transition-opacity duration-300 ${isDarkMode ? 'opacity-0' : 'opacity-30'}`} />
            </div>
        </button>
    );
};

export default ThemeToggle;
