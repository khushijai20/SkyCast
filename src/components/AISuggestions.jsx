import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Shirt, Plane, Footprints, Coffee, Sun, Umbrella, Wind } from 'lucide-react';

const AISuggestions = ({ suggestions }) => {
    if (!suggestions) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 }
    };

    const getIcon = (title) => {
        const t = title.toLowerCase();
        if (t.includes('wear')) return Shirt;
        if (t.includes('travel')) return Plane;
        if (t.includes('out') || t.includes('activity')) return Footprints;
        return Coffee;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[2.5rem] p-8 h-full relative overflow-hidden"
        >
            {/* Visual Flair */}
            <div className="absolute top-0 right-0 p-12 bg-indigo-500/10 blur-[80px] rounded-full -mr-12 -mt-12"></div>

            <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <Sparkles size={20} className="text-white animate-pulse" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white tracking-tight leading-none mb-1">SkyCast AI Assistant</h3>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Powered by Smart Intelligence</p>
                </div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10"
            >
                {suggestions.map((item, index) => {
                    const Icon = getIcon(item.title);
                    return (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-white/5 border border-white/5 p-5 rounded-3xl group hover:bg-white/10 hover:border-white/10 transition-all duration-300"
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                                    <Icon size={20} />
                                </div>
                                <h4 className="text-xs font-bold text-white/90 uppercase tracking-widest leading-none">
                                    {item.title}
                                </h4>
                            </div>
                            <p className="text-sm text-white/60 font-medium leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    );
                })}
            </motion.div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-indigo-500/20 flex items-center justify-center">
                            <Sparkles size={10} className="text-indigo-400" />
                        </div>
                    ))}
                    <span className="pl-4 text-[10px] font-bold text-white/30 uppercase tracking-widest self-center">Updated instantly</span>
                </div>
                <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-[0.2em] transition-colors">
                    Tell Me More →
                </button>
            </div>
        </motion.div>
    );
};

export default AISuggestions;
