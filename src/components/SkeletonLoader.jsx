import { motion } from 'framer-motion';

const SkeletonLoader = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto p-4 md:p-8">
            <div className="lg:col-span-2 space-y-6">
                {/* Main Card Skeleton */}
                <div className="h-64 md:h-80 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 animate-pulse flex flex-col p-8 justify-between">
                    <div className="flex justify-between items-start">
                        <div className="space-y-4">
                            <div className="h-10 w-48 bg-white/10 rounded-lg"></div>
                            <div className="h-4 w-32 bg-white/5 rounded-lg"></div>
                        </div>
                        <div className="h-12 w-12 bg-white/10 rounded-full"></div>
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="h-24 w-40 bg-white/10 rounded-2xl"></div>
                        <div className="h-32 w-32 bg-white/10 rounded-full"></div>
                    </div>
                </div>

                {/* Highlights Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 animate-pulse"></div>
                    ))}
                </div>
            </div>

            {/* Sidebar Skeleton */}
            <div className="lg:col-span-1 space-y-4">
                <div className="h-10 w-full bg-white/10 rounded-xl mb-6"></div>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-20 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 animate-pulse"></div>
                ))}
            </div>
        </div>
    );
};

export default SkeletonLoader;
