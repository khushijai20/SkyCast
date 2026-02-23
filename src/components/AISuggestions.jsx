import { Shirt, Tent, Car, Sparkles, Zap, BrainCircuit } from 'lucide-react';
import { motion } from 'framer-motion';

const SuggestionSection = ({ icon: Icon, title, items, colorClass }) => (
    <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg bg-white/5 ${colorClass}`}>
                <Icon size={16} />
            </div>
            <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider">{title}</h4>
        </div>
        <div className="flex flex-wrap gap-2">
            {Array.isArray(items) ? items.map((item, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-white/70 font-medium">
                    {item}
                </span>
            )) : (
                <p className="text-sm text-white/60 leading-relaxed font-medium">{items}</p>
            )}
        </div>
    </div>
);

const AISuggestions = ({ suggestions }) => {
    if (!suggestions) return null;

    const { clothing, activities, travel, mood } = suggestions;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card rounded-[2rem] p-8 relative overflow-hidden h-full group"
        >
            {/* Gradient Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-[80px] group-hover:bg-indigo-500/30 transition-all duration-700"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <BrainCircuit className="text-white" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Weather Intelligence</h3>
                            <div className="flex items-center gap-2">
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">AI Engine Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <SuggestionSection
                        icon={Shirt}
                        title="Optimal Clothing"
                        items={clothing}
                        colorClass="text-blue-400"
                    />

                    <SuggestionSection
                        icon={Tent}
                        title={`Recommended Activities • ${mood}`}
                        items={activities}
                        colorClass="text-emerald-400"
                    />

                    <div className="pt-6 border-t border-white/10">
                        <SuggestionSection
                            icon={Car}
                            title="Travel Advisory"
                            items={travel}
                            colorClass="text-amber-400"
                        />
                    </div>
                </div>

                <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
                    <Zap size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-white/40 leading-relaxed italic">
                        "Our Smart AI analyzes humidity, wind-chill, and UV factors to provide tailored lifestyle recommendations based on local weather conditions."
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default AISuggestions;
