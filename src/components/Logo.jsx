import { Cloud, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

const Logo = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 group cursor-pointer"
        >
            <div className="relative">
                <motion.div
                    animate={{ 
                        rotate: 360,
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                        rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute -top-1 -right-1 text-yellow-400"
                >
                    <Sun size={20} fill="currentColor" />
                </motion.div>
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/30 group-hover:bg-white/30 transition-colors">
                    <Cloud className="text-white w-6 h-6" fill="currentColor" />
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-tight leading-none">SkyCast</span>
                <span className="text-[10px] text-white/60 font-medium uppercase tracking-[0.2em] leading-none mt-1">Smart Intelligence</span>
            </div>
        </motion.div>
    );
};

export default Logo;
