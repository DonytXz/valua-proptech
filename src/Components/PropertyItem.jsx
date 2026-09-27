import React from 'react';
import { Link } from "react-router-dom";

export const PropertyItem = ({ address, urgency, name, condition, id }) => {
    const getUrgencyBadge = (val) => {
        switch (val?.toLowerCase()) {
            case 'immediately':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'soon':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getConditionBadge = (val) => {
        switch (val?.toLowerCase()) {
            case 'brand new':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'very good':
                return 'bg-teal-100 text-teal-800 border-teal-200';
            case 'need work':
                return 'bg-rose-100 text-rose-800 border-rose-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group hover:border-emerald-300">
            {/* Header top stripe */}
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-400 group-hover:from-emerald-400 group-hover:to-teal-300 transition-colors" />

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 truncate max-w-[120px]">
                            #{id ? id.substring(0, 8) : 'N/A'}
                        </span>
                        <div className="flex items-center space-x-1.5">
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getConditionBadge(condition)}`}>
                                {condition || 'Standard'}
                            </span>
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getUrgencyBadge(urgency)}`}>
                                {urgency || 'Flexible'}
                            </span>
                        </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                        {address || 'Unregistered Address'}
                    </h3>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <div className="flex items-center space-x-1.5">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="font-medium text-slate-800">{name || 'Anonymous Client'}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <Link
                        to={{
                            pathname: '/details',
                            state: { id: id }
                        }}
                        className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white transition-all duration-200 border border-emerald-200 hover:border-transparent group-hover:shadow-sm"
                    >
                        <span>View Full Appraisal</span>
                        <svg className="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};
