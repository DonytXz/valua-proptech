import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/Assets/logo.svg';

export const Footer = () => {
    return (
        <footer className="bg-slate-900 text-gray-300 py-10 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-2 mb-3">
                            <img src={Logo} alt="Valua Logo" className="h-8 w-auto brightness-0 invert" />
                        </div>
                        <p className="text-gray-400 text-sm max-w-sm mb-4 leading-relaxed">
                            Smart, reliable property valuation and appraisal intelligence powered by open-source geospatial mapping.
                        </p>
                        <div className="inline-flex items-center space-x-2 text-xs font-semibold px-2.5 py-1 bg-emerald-950 text-emerald-300 rounded border border-emerald-800/60">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>Powered by Leaflet &amp; OpenStreetMap</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Platform</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="hover:text-emerald-400 transition-colors">Valuation Map</Link>
                            </li>
                            <li>
                                <Link to="/properties" className="hover:text-emerald-400 transition-colors">Property Registry</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/privacity" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Valua Inc. All rights reserved.</p>
                    <p className="mt-2 sm:mt-0">Open Geospatial Data &bull; Free Open-Source Architecture</p>
                </div>
            </div>
        </footer>
    );
};
