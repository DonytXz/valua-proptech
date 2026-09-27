import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
    return (
        <div className="min-h-[calc(100vh-10rem)] bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 space-y-8">
                    <div className="border-b border-slate-200 pb-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
                            Terms &amp; Policies
                        </span>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Terms of Service
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Effective Date: September 2026 &bull; Valua Property Valuation Platform
                        </p>
                    </div>

                    <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700">
                        <p>
                            Welcome to <strong>Valua</strong> (&ldquo;Service&rdquo;, &ldquo;Platform&rdquo;). By accessing, viewing, or submitting appraisal requests through this portal, you agree to be bound by the following terms and conditions.
                        </p>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900 mb-2">1. Nature of Valuation Estimates</h2>
                            <p>
                                Valua provides informational, automated real estate and cadastral valuation estimates utilizing spatial clustering, historical transaction indices, and geospatial cadastral data. While our models utilize high-grade open mapping indicators, digital estimates do not constitute a certified bank appraisal or formal legal title guarantee.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900 mb-2">2. User Representations &amp; Submissions</h2>
                            <p>
                                By submitting property coordinates, physical addresses, and condition statements, you confirm that you are authorized to request valuation details for the subject parcel and that the contact information provided is accurate and authentic.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900 mb-2">3. Open-Source Geospatial Licensing</h2>
                            <p>
                                Mapping capabilities are powered by Leaflet and OpenStreetMap contributors. Cartographic map tiles and geocoding services are subject to the Open Database License (ODbL). Users agree not to systematically scrape or abuse upstream geospatial endpoints.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900 mb-2">4. Limitation of Liability</h2>
                            <p>
                                Valua and its contributors shall not be held liable for any commercial, investment, or real estate transactions concluded solely on the basis of preliminary algorithmic appraisal indicators without independent professional on-site inspection.
                            </p>
                        </div>

                        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                            <p className="text-xs text-slate-500">Contact: legal@valua.app</p>
                            <Link to="/" className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
                                &larr; Return to Valuation Map
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
