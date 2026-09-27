import React, { useEffect, useRef, useState, useCallback } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PopertyService } from '@/Services';
import { Link } from "react-router-dom";

const MySwal = withReactContent(Swal);

// Custom modern SVG pin for Leaflet
const createEmeraldMarker = () => L.divIcon({
    className: 'valua-pin',
    html: `
        <div style="width: 42px; height: 50px; transform: translate(-21px, -50px); cursor: pointer; filter: drop-shadow(0 6px 8px rgba(4, 120, 87, 0.4));">
            <svg viewBox="0 0 48 58" width="42" height="50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="pinGradModal" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#10B981"/>
                        <stop offset="100%" stop-color="#047857"/>
                    </linearGradient>
                </defs>
                <path d="M24 2C13.5 2 5 10.5 5 21C5 33.2 21.6 49.3 22.3 50C23.2 50.9 24.8 50.9 25.7 50C26.4 49.3 43 33.2 43 21C43 10.5 34.5 2 24 2Z" fill="url(#pinGradModal)"/>
                <circle cx="24" cy="21" r="14" fill="#FFFFFF"/>
                <path d="M24 13L17 19.2V27.5C17 28 17.4 28.5 18 28.5H21V23.5H27V28.5H30C30.6 28.5 31 28 31 27.5V19.2L24 13Z" fill="#047857"/>
            </svg>
        </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -48]
});

export const Map = () => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    const [addressLine, setAddressLine] = useState('');
    const [lat, setLat] = useState(32.514946);
    const [long, setLong] = useState(-117.038246);
    const [searched, setSearched] = useState(false);
    
    // Autocomplete search state
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // Initialize Leaflet Map
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        // Create Leaflet map centered at initial coords
        const map = L.map(mapContainerRef.current, {
            center: [lat, long],
            zoom: 13,
            zoomControl: false,
        });

        // Add zoom control to top-right
        L.control.zoom({ position: 'topright' }).addTo(map);

        // OpenStreetMap Free Tile Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add click listener to select any point on map
        map.on('click', async (e) => {
            const { lat: clickLat, lng: clickLng } = e.latlng;
            setLat(clickLat);
            setLong(clickLng);
            setSearched(true);

            // Reverse geocode via free Nominatim API
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${clickLat}&lon=${clickLng}&zoom=18&addressdetails=1`,
                    { headers: { 'Accept-Language': 'es,en' } }
                );
                if (response.ok) {
                    const data = await response.json();
                    const resolvedAddress = data.display_name || `${clickLat.toFixed(5)}, ${clickLng.toFixed(5)}`;
                    setAddressLine(resolvedAddress);
                    setQuery(resolvedAddress);
                    updateMarker(clickLat, clickLng, resolvedAddress, map);
                } else {
                    const fallback = `Location: ${clickLat.toFixed(5)}, ${clickLng.toFixed(5)}`;
                    setAddressLine(fallback);
                    updateMarker(clickLat, clickLng, fallback, map);
                }
            } catch (err) {
                const fallback = `Location: ${clickLat.toFixed(5)}, ${clickLng.toFixed(5)}`;
                setAddressLine(fallback);
                updateMarker(clickLat, clickLng, fallback, map);
            }
        });

        mapInstanceRef.current = map;

        // Fix map size rendering
        setTimeout(() => {
            map.invalidateSize();
        }, 200);

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // Helper to update marker position and popup
    const updateMarker = (markerLat, markerLng, popupContent, mapObj) => {
        const map = mapObj || mapInstanceRef.current;
        if (!map) return;

        if (markerRef.current) {
            markerRef.current.setLatLng([markerLat, markerLng]);
        } else {
            markerRef.current = L.marker([markerLat, markerLng], { icon: createEmeraldMarker() }).addTo(map);
        }

        markerRef.current.bindPopup(`
            <div style="font-family: inherit; padding: 4px 2px;">
                <div style="font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 0.5px;">Selected Property</div>
                <div style="font-size: 13px; font-weight: 600; color: #0F172A; margin-top: 2px;">${popupContent}</div>
                <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Lat: ${markerLat.toFixed(5)}, Lng: ${markerLng.toFixed(5)}</div>
            </div>
        `).openPopup();
    };

    // Debounced Nominatim Search
    useEffect(() => {
        if (!query || query.length < 3 || !showDropdown) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`,
                    { headers: { 'Accept-Language': 'es,en' } }
                );
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data || []);
                }
            } catch (error) {
                console.error("OpenStreetMap geocoding search error:", error);
            } finally {
                setIsSearching(false);
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [query, showDropdown]);

    const handleSelectSuggestion = (item) => {
        const itemLat = parseFloat(item.lat);
        const itemLon = parseFloat(item.lon);
        const displayName = item.display_name;

        setQuery(displayName);
        setAddressLine(displayName);
        setLat(itemLat);
        setLong(itemLon);
        setSearched(true);
        setShowDropdown(false);

        if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([itemLat, itemLon], 16, { duration: 1.2 });
            updateMarker(itemLat, itemLon, displayName);
        }
    };

    const notInputAddress = () => {
        Swal.fire({
            title: "Address Required",
            text: "Please search for your address or click directly on the map to place your property pin.",
            icon: "info",
            confirmButtonColor: '#059669',
            confirmButtonText: 'Understood',
        });
    };

    const handleBtnValue = () => {
        let firstStep = [];
        let secondStep = [];

        Swal.fire({
            title: '<span style="color:#0F172A; font-size: 20px; font-weight:700;">Who is requesting this appraisal?</span>',
            html: `
                <div style="text-align: left; margin-top: 10px;">
                    <label style="display:block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 4px;">Full Name *</label>
                    <input type="text" id="name" class="swal2-input" placeholder="e.g. Maria Gonzalez" style="width: 100%; margin: 0 0 12px 0; height: 42px; font-size: 14px; border-radius: 8px;">
                    
                    <label style="display:block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 4px;">Email Address *</label>
                    <input type="email" id="email" class="swal2-input" placeholder="name@example.com" style="width: 100%; margin: 0 0 12px 0; height: 42px; font-size: 14px; border-radius: 8px;">
                    
                    <label style="display:block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 4px;">Phone Number *</label>
                    <input type="tel" id="phone" class="swal2-input" placeholder="(664) 123-4567" style="width: 100%; margin: 0; height: 42px; font-size: 14px; border-radius: 8px;">
                </div>
            `,
            confirmButtonText: 'Next Step &rarr;',
            confirmButtonColor: '#059669',
            focusConfirm: false,
            preConfirm: () => {
                const name = Swal.getPopup().querySelector('#name').value.trim();
                const email = Swal.getPopup().querySelector('#email').value.trim();
                const phone = Swal.getPopup().querySelector('#phone').value.trim();
                if (!name || !email || !phone) {
                    Swal.showValidationMessage('Please complete all contact fields to proceed.');
                }
                return { name, email, phone };
            }
        }).then((result) => {
            if (!result.isConfirmed) return;
            firstStep = [result.value.name, result.value.email, result.value.phone];

            Swal.fire({
                title: '<span style="color:#0F172A; font-size: 20px; font-weight:700;">Property & Timing Details</span>',
                html: `
                    <div style="text-align: left; margin-top: 10px;">
                        <label style="display:block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 4px;">Property Condition</label>
                        <select id="condition" class="swal2-input" style="width: 100%; margin: 0 0 12px 0; height: 42px; font-size: 14px; border-radius: 8px;">
                            <option value="Brand new">Brand new / Remodeled</option>
                            <option value="Very good" selected>Very good condition</option>
                            <option value="Good">Good / Average wear</option>
                            <option value="Need work">Requires significant repairs</option>
                        </select>

                        <label style="display:block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 4px;">Selling Timeframe</label>
                        <select id="urgency" class="swal2-input" style="width: 100%; margin: 0 0 12px 0; height: 42px; font-size: 14px; border-radius: 8px;">
                            <option value="Immediately">Immediately (Under 30 days)</option>
                            <option value="Soon" selected>Soon (1 - 3 months)</option>
                            <option value="I can wait">In 6+ months</option>
                            <option value="Only curious">Just estimating value / Market research</option>
                        </select>

                        <label style="display:block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 4px;">Additional Highlights or Notes</label>
                        <textarea id="coments" class="swal2-textarea" placeholder="Bedrooms, square footage, amenities, recent renovations, or specific questions..." style="width: 100%; margin: 0; height: 80px; font-size: 14px; border-radius: 8px;"></textarea>
                    </div>
                `,
                confirmButtonText: 'Generate Valuation Report',
                confirmButtonColor: '#059669',
                focusConfirm: false,
                preConfirm: () => {
                    const condition = Swal.getPopup().querySelector('#condition').value;
                    const urgency = Swal.getPopup().querySelector('#urgency').value;
                    const coments = Swal.getPopup().querySelector('#coments').value.trim() || 'No additional comments provided';
                    return { condition, urgency, coments };
                }
            }).then((secondResult) => {
                if (!secondResult.isConfirmed) return;
                secondStep = [secondResult.value.condition, secondResult.value.urgency, secondResult.value.coments];

                const [name, email, phone] = firstStep;
                const [condition, urgency, coments] = secondStep;

                try {
                    PopertyService.addProperty(addressLine, name, email, phone, condition, urgency, coments, lat, long);
                    Swal.fire({
                        title: "Valuation Request Submitted!",
                        text: "Our automated appraisal algorithm and local valuation team are calculating your report.",
                        icon: "success",
                        confirmButtonColor: '#059669',
                        confirmButtonText: 'View Property List',
                        showCancelButton: true,
                        cancelButtonText: 'Done',
                    }).then((navResult) => {
                        if (navResult.isConfirmed) {
                            window.location.href = '#/properties';
                        }
                    });
                } catch (err) {
                    console.error("Valuation submit error:", err);
                    Swal.fire({
                        title: "Submission Error",
                        text: "Could not save valuation request. Please try again.",
                        icon: "error",
                        confirmButtonColor: '#059669'
                    });
                }
            });
        });
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-50">
            {/* Left Control & Search Panel */}
            <aside className="w-full lg:w-96 xl:w-[440px] flex-shrink-0 bg-white border-r border-gray-200 shadow-lg flex flex-col z-20">
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    {/* Header badge */}
                    <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            Free Appraisal Engine
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                            OpenStreetMap
                        </span>
                    </div>

                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            Instant Property Valuation
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                            Search your address or click anywhere on the open-source map to pin your property and calculate fair market value.
                        </p>
                    </div>

                    {/* OpenStreetMap Address Search Input */}
                    <div className="relative">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Property Address
                        </label>
                        <div className="relative flex items-center">
                            <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setShowDropdown(true);
                                    if (!e.target.value) {
                                        setSearched(false);
                                        setAddressLine('');
                                    }
                                }}
                                onFocus={() => setShowDropdown(true)}
                                placeholder="Street, neighbourhood, or city..."
                                className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-slate-400 text-slate-900"
                            />
                            {isSearching && (
                                <span className="absolute right-3.5 text-emerald-600 animate-spin">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                </span>
                            )}
                            {query && !isSearching && (
                                <button
                                    onClick={() => {
                                        setQuery('');
                                        setSuggestions([]);
                                        setAddressLine('');
                                        setSearched(false);
                                    }}
                                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Dropdown Suggestions */}
                        {showDropdown && suggestions.length > 0 && (
                            <ul className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50 divide-y divide-slate-100">
                                {suggestions.map((item) => (
                                    <li
                                        key={item.place_id}
                                        onClick={() => handleSelectSuggestion(item)}
                                        className="px-4 py-3 hover:bg-emerald-50 cursor-pointer text-xs text-slate-700 flex items-start space-x-2 transition-colors"
                                    >
                                        <span className="text-emerald-600 mt-0.5 flex-shrink-0">
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        <span className="leading-snug">{item.display_name}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Selected Location Card */}
                    <div className={`p-4 rounded-xl border transition-all ${
                        searched 
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}>
                        <div className="flex items-center space-x-2 mb-1.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${searched ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                            <span className="text-xs font-bold uppercase tracking-wider">
                                {searched ? 'Location Selected' : 'No Pin Placed'}
                            </span>
                        </div>
                        <p className="text-xs leading-relaxed font-medium break-words">
                            {searched 
                                ? addressLine 
                                : 'Click on the map or type your address above to establish coordinates.'}
                        </p>
                        {searched && (
                            <div className="mt-2 text-[11px] font-mono text-emerald-700">
                                Coordinates: {lat.toFixed(5)}, {long.toFixed(5)}
                            </div>
                        )}
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={!searched ? notInputAddress : handleBtnValue}
                        className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-all transform ${
                            searched
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 hover:-translate-y-0.5 active:translate-y-0'
                                : 'bg-slate-200 hover:bg-slate-300 text-slate-500 cursor-pointer'
                        }`}
                    >
                        <span>Calculate Valuation</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                        </svg>
                    </button>

                    {/* Quick navigation */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <Link to="/properties" className="text-emerald-600 font-semibold hover:underline flex items-center">
                            <span>Browse Valuations</span>
                            <span className="ml-1">&rarr;</span>
                        </Link>
                        <div className="flex space-x-3">
                            <Link to="/privacity" className="hover:underline">Privacy</Link>
                            <span>&bull;</span>
                            <Link to="/terms" className="hover:underline">Terms</Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Interactive Leaflet Map Container */}
            <main className="flex-1 relative h-full w-full bg-slate-100">
                <div 
                    ref={mapContainerRef} 
                    className="absolute inset-0 w-full h-full z-10"
                    style={{ minHeight: '400px' }}
                />

                {/* Map Floating Tip Badge */}
                <div className="absolute top-4 left-4 z-20 pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg shadow-sm border border-gray-200/80 text-xs font-semibold text-slate-700 flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Click map to place valuation pin</span>
                    </div>
                </div>
            </main>
        </div>
    );
};
