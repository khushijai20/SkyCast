import { motion } from 'framer-motion';

const SkeletonItem = ({ className }) => (
    <div className={`bg-white/5 rounded-3xl animate-pulse relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
    </div>
);

const SkeletonLoader = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-8">
                {/* Main Card Skeleton */}
                <div className="glass-panel rounded-[3rem] p-10 h-[400px] flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-4">
                            <SkeletonItem className="w-12 h-12 rounded-2xl" />
                            <div className="space-y-2">
                                <SkeletonItem className="w-48 h-8" />
                                <SkeletonItem className="w-32 h-4" />
                            </div>
                        </div>
                        <SkeletonItem className="w-12 h-12 rounded-2xl" />
                    </div>
                    <div className="flex items-center gap-12">
                        <SkeletonItem className="w-48 h-48 rounded-full" />
                        <div className="space-y-4">
                            <SkeletonItem className="w-40 h-24" />
                            <SkeletonItem className="w-32 h-4" />
                        </div>
                    </div>
                </div>

                {/* Grid Highlights Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <SkeletonItem key={i} className="h-40 rounded-[2rem]" />
                    ))}
                </div>
            </div>

            {/* Right Side Forecast Skeleton */}
            <div className="lg:col-span-1">
                <div className="glass-panel rounded-[2.5rem] p-7 h-full space-y-6">
                    <SkeletonItem className="w-full h-8" />
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <SkeletonItem key={i} className="w-full h-16 rounded-2xl" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SkeletonLoader;
