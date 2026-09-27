import React from 'react';
import { Link } from 'react-router-dom';

const Privacity = () => {
    return (
        <div className="min-h-[calc(100vh-10rem)] bg-slate-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 space-y-8">
                    <div className="border-b border-slate-200 pb-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-2">
                            Legal &amp; Compliance
                        </span>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Privacy Policy
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Last updated: September 2026 &bull; Valua Property Valuation Platform
                        </p>
                    </div>

                    <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-700">
                        <p>
                            This privacy policy (&ldquo;Policy&rdquo;) outlines how <strong>Valua</strong> (&ldquo;Valua&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects, processes, and safeguards the information you provide when using our digital property appraisal and valuation platform.
                        </p>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900 mb-2">1. Geospatial &amp; Personal Data Collected</h2>
                            <p className="mb-2">When utilizing our open-source valuation engine, we may process:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Property physical addresses and geographic coordinates (latitude and longitude).</li>
                                <li>Contact details provided during appraisal submission (Name, Email address, Phone number).</li>
                                <li>Property conditions, owner timelines, and custom appraisal comments.</li>
                                <li>Technical usage telemetry and network logs to ensure service reliability.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900 mb-2">2. Purpose of Processing</h2>
                            <p className="mb-2">Your information is strictly utilized to:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Calculate accurate automated cadastral and real estate valuation estimates.</li>
                                <li>Deliver appraisal dossiers directly to the requesting party.</li>
                                <li>Maintain our transparent property valuation registry.</li>
                                <li>Improve open-source mapping spatial accuracy and query performance.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900 mb-2">3. Open-Source Map &amp; Third-Party Services</h2>
                            <p>
                                Valua utilizes <strong>Leaflet</strong> and the <strong>OpenStreetMap</strong> foundation for mapping and geocoding services. Map tile requests do not transmit your personally identifiable information (PII) to commercial ad trackers or third-party advertising networks. Database records are persisted on secure cloud databases with authenticated rule sets.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900 mb-2">4. Data Protection &amp; Retention</h2>
                            <p>
                                We employ industry-standard encryption in transit (HTTPS/TLS) and secure database storage mechanisms. You reserve the right to review, update, or request the deletion of your appraisal request record at any time.
                            </p>
                        </div>

                        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                            <p className="text-xs text-slate-500">Questions? Contact us at legal@valua.app</p>
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

export default Privacity;
