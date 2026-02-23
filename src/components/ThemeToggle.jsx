import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white transition-all shadow-lg"
            aria-label="Toggle Theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={isDarkMode ? "dark" : "light"}
                    initial={{ y: 10, opacity: 0, rotate: -45 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -10, opacity: 0, rotate: 45 }}
                    transition={{ duration: 0.2 }}
                >
                    {isDarkMode ? <Moon size={20} className="text-indigo-400 fill-indigo-400" /> : <Sun size={20} className="text-yellow-400 fill-yellow-400" />}
                </motion.div>
            </AnimatePresence>
        </motion.button>
    );
};

export default ThemeToggle;
