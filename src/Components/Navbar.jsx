import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '@/Assets/logo.svg';

export const Navbar = () => {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center space-x-2 focus:outline-none">
                        <img src={Logo} alt="Valua Logo" className="h-9 w-auto" />
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
                        <Link
                            to="/"
                            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                isActive('/')
                                    ? 'text-emerald-700 bg-emerald-50'
                                    : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                            }`}
                        >
                            Valuation Map
                        </Link>
                        <Link
                            to="/properties"
                            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                isActive('/properties')
                                    ? 'text-emerald-700 bg-emerald-50'
                                    : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                            }`}
                        >
                            Recent Valuations
                        </Link>
                        <Link
                            to="/privacity"
                            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                isActive('/privacity')
                                    ? 'text-emerald-700 bg-emerald-50'
                                    : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                            }`}
                        >
                            Privacy
                        </Link>
                        <Link
                            to="/terms"
                            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                isActive('/terms')
                                    ? 'text-emerald-700 bg-emerald-50'
                                    : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                            }`}
                        >
                            Terms
                        </Link>
                    </nav>

                    {/* Action Button */}
                    <div className="hidden md:flex items-center">
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                            </svg>
                            New Appraisal
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-gray-100 focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown */}
            {mobileOpen && (
                <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-white border-b border-gray-200">
                    <Link
                        to="/"
                        onClick={() => setMobileOpen(false)}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                            isActive('/') ? 'text-emerald-700 bg-emerald-50' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Valuation Map
                    </Link>
                    <Link
                        to="/properties"
                        onClick={() => setMobileOpen(false)}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                            isActive('/properties') ? 'text-emerald-700 bg-emerald-50' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Recent Valuations
                    </Link>
                    <Link
                        to="/privacity"
                        onClick={() => setMobileOpen(false)}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                            isActive('/privacity') ? 'text-emerald-700 bg-emerald-50' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        to="/terms"
                        onClick={() => setMobileOpen(false)}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                            isActive('/terms') ? 'text-emerald-700 bg-emerald-50' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Terms of Service
                    </Link>
                </div>
            )}
        </header>
    );
};
