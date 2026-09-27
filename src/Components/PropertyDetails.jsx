import React, { useEffect, useRef, useState } from 'react';
import { firebase } from '../firebase';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom modern SVG pin for Leaflet
const createEmeraldMarker = () => L.divIcon({
    className: 'valua-pin',
    html: `
        <div style="width: 42px; height: 50px; transform: translate(-21px, -50px); cursor: pointer; filter: drop-shadow(0 6px 8px rgba(4, 120, 87, 0.4));">
            <svg viewBox="0 0 48 58" width="42" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="pinGradDetails" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#10B981"/>
                        <stop offset="100%" stop-color="#047857"/>
                    </linearGradient>
                </defs>
                <path d="M24 2C13.5 2 5 10.5 5 21C5 33.2 21.6 49.3 22.3 50C23.2 50.9 24.8 50.9 25.7 50C26.4 49.3 43 33.2 43 21C43 10.5 34.5 2 24 2Z" fill="url(#pinGradDetails)"/>
                <circle cx="24" cy="21" r="14" fill="#FFFFFF"/>
                <path d="M24 13L17 19.2V27.5C17 28 17.4 28.5 18 28.5H21V23.5H27V28.5H30C30.6 28.5 31 28 31 27.5V19.2L24 13Z" fill="#047857"/>
            </svg>
        </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -48]
});

export const PropertyDetails = ({ id }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const docId = typeof id === 'object' && id !== null ? (id.id || id) : id;

    useEffect(() => {
        const fetchProperty = async () => {
            if (!docId) {
                setError("No property ID provided.");
                setLoading(false);
                return;
            }

            try {
                const db = firebase.firestore();
                const doc = await db.collection('Properties').doc(String(docId)).get();
                if (doc.exists) {
                    setProperty({ id: doc.id, ...doc.data() });
                } else {
                    setError("Property document not found in database.");
                }
            } catch (err) {
                console.error("Firestore retrieval error:", err);
                setError(err.message || "Failed to load property data.");
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [docId]);

    // Initialize or update Leaflet map once property data is ready
    useEffect(() => {
        if (!property || !mapContainerRef.current) return;

        const pLat = parseFloat(property.lat) || 32.514946;
        const pLng = parseFloat(property.lng) || -117.038246;

        if (!mapInstanceRef.current) {
            const map = L.map(mapContainerRef.current, {
                center: [pLat, pLng],
                zoom: 16,
                zoomControl: false,
            });

            L.control.zoom({ position: 'topright' }).addTo(map);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            const marker = L.marker([pLat, pLng], { icon: createEmeraldMarker() }).addTo(map);
            marker.bindPopup(`
                <div style="font-family: inherit; padding: 4px;">
                    <div style="font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase;">Valuation Target</div>
                    <div style="font-size: 13px; font-weight: 600; color: #0F172A; margin-top: 2px;">${property.address || 'Property Location'}</div>
                </div>
            `).openPopup();

            mapInstanceRef.current = map;
            markerRef.current = marker;

            setTimeout(() => {
                map.invalidateSize();
            }, 250);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [property]);

    const getUrgencyBadge = (urgency) => {
        switch (urgency?.toLowerCase()) {
            case 'immediately':
                return 'bg-amber-100 text-amber-800 border-amber-300';
            case 'soon':
                return 'bg-emerald-100 text-emerald-800 border-emerald-300';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-300';
        }
    };

    const getConditionBadge = (condition) => {
        switch (condition?.toLowerCase()) {
            case 'brand new':
                return 'bg-emerald-100 text-emerald-800 border-emerald-300';
            case 'very good':
                return 'bg-teal-100 text-teal-800 border-teal-300';
            case 'need work':
                return 'bg-rose-100 text-rose-800 border-rose-300';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-300';
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <p className="text-slate-600 font-medium text-sm">Retrieving appraisal record...</p>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="max-w-2xl mx-auto my-12 p-8 bg-white border border-rose-200 rounded-2xl shadow-sm text-center">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Record Not Found</h2>
                <p className="text-slate-500 text-sm mb-6">{error || "The requested property record could not be loaded."}</p>
                <Link
                    to="/properties"
                    className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                >
                    &larr; Back to Property Registry
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Top Navigation Breadcrumb */}
            <div className="flex items-center justify-between">
                <Link
                    to="/properties"
                    className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to All Properties
                </Link>

                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ID: {property.id}
                </span>
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Card: Property Overview */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">
                    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">
                                Appraisal File
                            </span>
                        </div>
                        <h1 className="text-xl font-bold leading-snug">
                            {property.address || "Unspecified Address"}
                        </h1>
                        <p className="text-slate-400 text-xs mt-2 font-mono">
                            Coords: {property.lat ? Number(property.lat).toFixed(5) : 'N/A'}, {property.lng ? Number(property.lng).toFixed(5) : 'N/A'}
                        </p>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center py-2">
                            <span className="text-xs font-bold uppercase text-slate-500">Contact Name</span>
                            <span className="text-sm font-semibold text-slate-900">{property.name || 'N/A'}</span>
                        </div>

                        <div className="flex justify-between items-center py-2">
                            <span className="text-xs font-bold uppercase text-slate-500">Email</span>
                            <span className="text-sm font-medium text-emerald-700">{property.email || 'N/A'}</span>
                        </div>

                        <div className="flex justify-between items-center py-2">
                            <span className="text-xs font-bold uppercase text-slate-500">Phone</span>
                            <span className="text-sm font-semibold text-slate-900">{property.phone || 'N/A'}</span>
                        </div>

                        <div className="flex justify-between items-center py-2">
                            <span className="text-xs font-bold uppercase text-slate-500">Condition</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getConditionBadge(property.condition)}`}>
                                {property.condition || 'Standard'}
                            </span>
                        </div>

                        <div className="flex justify-between items-center py-2">
                            <span className="text-xs font-bold uppercase text-slate-500">Timeline</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getUrgencyBadge(property.urgency)}`}>
                                {property.urgency || 'Flexible'}
                            </span>
                        </div>

                        <div className="pt-3">
                            <span className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Comments &amp; Highlights</span>
                            <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed italic">
                                "{property.coments || 'No additional notes provided.'}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Card: Interactive Leaflet Map */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-sm p-4 space-y-3">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            <h2 className="text-sm font-bold text-slate-900">Geospatial Cadastre Location</h2>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">OpenStreetMap</span>
                    </div>

                    <div 
                        ref={mapContainerRef} 
                        className="w-full h-96 lg:h-[450px] rounded-xl overflow-hidden border border-slate-200 shadow-inner"
                    />
                </div>
            </div>
        </div>
    );
};