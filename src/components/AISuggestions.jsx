import { Shirt, Tent, Car, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const AISuggestions = ({ suggestions }) => {
    if (!suggestions) return null;

    const { clothing, activities, travel, mood } = suggestions;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full max-w-3xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            <div className="bg-white/20 dark:bg-black/30 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Shirt className="text-blue-200" />
                    <h3 className="text-xl font-semibold text-white">What to Wear</h3>
                </div>
                <ul className="space-y-2">
                    {clothing.map((item, idx) => (
                        <li key={idx} className="text-blue-50 dark:text-blue-100 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-white/20 dark:bg-black/30 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <Tent className="text-green-200" />
                    <h3 className="text-xl font-semibold text-white">Activities ({mood})</h3>
                </div>
                <ul className="space-y-2">
                    {activities.map((item, idx) => (
                        <li key={idx} className="text-blue-50 dark:text-blue-100 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-300"></span>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-white/20 dark:bg-black/30 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-lg md:col-span-2 flex items-center gap-4">
                <Car className="text-yellow-200 flex-shrink-0" size={24} />
                <div>
                    <h3 className="text-lg font-semibold text-white">Travel Conditions</h3>
                    <p className="text-blue-50 dark:text-blue-100">{travel}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default AISuggestions;
