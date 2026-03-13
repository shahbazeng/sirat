import React from 'react';

export default function MissionImpact({ stats }) {
    return (
        <section className="relative py-24 bg-[#022C22] overflow-hidden border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                
                {/* Left Side: Content */}
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-6 leading-tight">
                        The Dawah Mission <br />
                        <span className="text-sirat-emerald">& Global Impact</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Sirat.ai is more than a platform; it is a digital lighthouse. 
                        By leveraging AI, we ensure that every seeker of truth finds 
                        verified, authentic guidance from the Quran and Sunnah, 
                        no matter where they are in the world.
                    </p>
                    <button className="border border-sirat-gold text-sirat-gold px-8 py-3 rounded-full font-bold hover:bg-sirat-gold hover:text-white transition-all duration-300">
                        View More Videos
                    </button>
                </div>

                {/* Right Side: Interactive Map Concept */}
                <div className="relative">
                    {/* The World Map Placeholder (Replace with an actual SVG) */}
                    <div className="relative opacity-30 grayscale invert">
                        <img src="/images/world-map.svg" alt="Global Activity" className="w-full" />
                    </div>

                    {/* Glowing Activity Pings (Matching your Design) */}
                    <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-sirat-gold rounded-full shadow-[0_0_15px_#D97706] animate-ping" />
                    <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-sirat-gold rounded-full shadow-[0_0_15px_#D97706] animate-pulse" />
                    <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-sirat-gold rounded-full shadow-[0_0_15px_#D97706] animate-ping" />
                </div>
            </div>

            {/* Bottom Global Activity Strip */}
            <div className="mt-20 bg-black/40 py-4 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center text-[10px] uppercase tracking-[0.2em] text-gray-400">
                    <div className="flex items-center gap-2">
                        <span className="text-sirat-emerald">●</span> Global Activity: 
                        <span className="text-white ml-1">11m ago | YA-Noon</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sirat-gold">★</span> Global Activity: 
                        <span className="text-white ml-1">TOP 5 Seekers</span>
                    </div>
                    <div className="text-sirat-emerald">
                        $4,201 Qurans Distributed
                    </div>
                </div>
            </div>
        </section>
    );
}