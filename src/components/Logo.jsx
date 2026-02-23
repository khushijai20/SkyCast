import { Cloud, Sun, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Logo = ({ size = "md" }) => {
    const isSmall = size === "sm";

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 cursor-pointer group"
        >
            <div className={`relative ${isSmall ? 'w-8 h-8' : 'w-10 h-10'}`}>
                <motion.div
                    animate={{
                        rotate: [0, 360],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity"
                ></motion.div>
                <div className="absolute inset-0 bg-slate-900 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors shadow-2xl">
                    <Cloud size={isSmall ? 16 : 20} className="text-white relative z-10" />
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute -top-1 -right-1"
                    >
                        <Sparkles size={isSmall ? 10 : 12} className="text-yellow-400" />
                    </motion.div>
                </div>
            </div>

            <div className="flex flex-col">
                <span className={`font-black tracking-tighter text-white ${isSmall ? 'text-lg leading-none' : 'text-xl leading-none'}`}>
                    SKY<span className="text-indigo-500 italic">CAST</span>
                </span>
                {!isSmall && (
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] leading-none mt-1">
                        Smart Intelligence
                    </span>
                )}
            </div>
        </motion.div>
    );
};

export default Logo;
