import React, { useState, useEffect } from 'react';
import { PropertyItem } from './PropertyItem';
import { PopertyService } from '../Services';
import { Link } from 'react-router-dom';

export const PropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterUrgency, setFilterUrgency] = useState('ALL');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const arrayData = await PopertyService.getProperties();
                setProperties(arrayData);
            } catch (error) {
                console.error("Error fetching properties:", error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, []);

    const filteredProperties = properties.filter((item) => {
        const matchesSearch =
            (item.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
            filterUrgency === 'ALL' || (item.urgency || '').toLowerCase() === filterUrgency.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                    <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            Cadastre Database
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                            {properties.length} Appraisals Logged
                        </span>
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                        Recent Valuations
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Browse submitted property appraisal requests and cadastral records across the region.
                    </p>
                </div>

                <Link
                    to="/"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all transform hover:-translate-y-0.5"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    New Valuation Map
                </Link>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <span className="absolute left-3.5 top-3 text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Search by address or requester name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-800 placeholder-slate-400"
                    />
                </div>

                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Urgency:</label>
                    <select
                        value={filterUrgency}
                        onChange={(e) => setFilterUrgency(e.target.value)}
                        className="py-2 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
                    >
                        <option value="ALL">All Timelines</option>
                        <option value="immediately">Immediately</option>
                        <option value="soon">Soon</option>
                        <option value="i can wait">I Can Wait</option>
                        <option value="only curious">Only Curious</option>
                    </select>
                </div>
            </div>

            {/* List / Grid Content */}
            {loading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 text-sm font-medium">Fetching valuation records from database...</p>
                </div>
            ) : filteredProperties.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-md mx-auto space-y-4">
                    <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">No properties matched</h3>
                    <p className="text-xs text-slate-500">
                        {searchTerm ? `No records found matching "${searchTerm}". Try resetting filters.` : 'No valuation requests have been logged yet.'}
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700"
                    >
                        Create First Valuation
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProperties.map(item => (
                        <PropertyItem
                            key={item.id}
                            id={item.id}
                            address={item.address}
                            urgency={item.urgency}
                            name={item.name}
                            condition={item.condition}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
