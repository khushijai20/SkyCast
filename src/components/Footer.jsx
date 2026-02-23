import React from 'react';
import { Github } from 'lucide-react';
import Logo from './Logo';

const Footer = ({ developerName = "KHUSHI" }) => {
    return (
        <footer className="w-full max-w-7xl mx-auto px-10 py-16 mt-20 border-t border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-6">
                    <Logo />
                    <p className="text-sm text-white/40 font-medium leading-relaxed max-w-xs">
                        State-of-the-art weather intelligence platform providing real-time data insights for a smarter lifestyle.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Resources</h4>
                    <a href="#" className="text-sm text-white/50 hover:text-indigo-400 transition-colors">Documentation</a>
                    <a href="#" className="text-sm text-white/50 hover:text-indigo-400 transition-colors">API Reference</a>
                    <a href="#" className="text-sm text-white/50 hover:text-indigo-400 transition-colors">Open Source</a>
                </div>

                <div className="space-y-6 md:text-right flex flex-col items-center md:items-end">
                    <div className="flex gap-4">
                        <a href="https://github.com" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 transition-all border border-white/10">
                            <Github size={20} />
                        </a>
                    </div>
                    <p className="text-xs text-white/20 font-medium">
                        Developed with Passion by <span className="text-white/40">{developerName}</span>
                    </p>
                </div>
            </div>
            <div className="mt-16 pt-8 border-t border-white/[0.02] text-center">
                <p className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">© 2026 SkyCast Intelligence Systems</p>
            </div>
        </footer>
    );
};

export default Footer;
