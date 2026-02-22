import { Cloud, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

const Logo = () => {
    return (
        <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute"
                >
                    <Cloud className="w-10 h-10 text-white fill-white/20 drop-shadow-lg" />
                </motion.div>
                <motion.div
                    initial={{ y: 2, x: 2, scale: 0 }}
                    animate={{ y: -8, x: 8, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="absolute top-0 right-0"
                >
                    <Sun className="w-5 h-5 text-yellow-300 fill-yellow-400 animate-spin-slow" />
                </motion.div>
            </div>
            <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-2xl font-bold text-white tracking-tight"
            >
                SkyCast
            </motion.h1>
        </div>
    );
};

export default Logo;
