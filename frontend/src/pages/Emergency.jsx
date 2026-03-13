import React, { useState } from 'react';
import {
    AlertTriangle, Phone, MapPin, Loader2, CheckCircle2,
    Star, Clock, Wifi, WifiOff, Navigation, MessageCircle, User2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEmergency } from '../context/EmergencyContext';
import { useAuth } from '../context/AuthContext';

// ─── Tamil ambulance driver pool ──────────────────────────────────────────────
const DRIVERS = [
    { name: 'முருகன் செல்வராஜ்', nameEn: 'Murugan Selvaraj', phone: '+91 98401 11223', vehicle: 'TN 01 AB 1234' },
    { name: 'கார்த்திக் ராமன்', nameEn: 'Karthik Raman', phone: '+91 94441 22334', vehicle: 'TN 09 CD 5678' },
    { name: 'வேலுசாமி நடராஜன்', nameEn: 'Velusamy Natarajan', phone: '+91 99401 33445', vehicle: 'TN 22 EF 9012' },
    { name: 'சுரேஷ் பாண்டியன்', nameEn: 'Suresh Pandiyan', phone: '+91 98841 44556', vehicle: 'TN 04 GH 3456' },
    { name: 'அருண் குமார்', nameEn: 'Arun Kumar', phone: '+91 97401 55667', vehicle: 'TN 11 IJ 7890' },
    { name: 'பாலாஜி தங்கவேல்', nameEn: 'Balaji Thangavel', phone: '+91 96001 66778', vehicle: 'TN 18 KL 2345' },
    { name: 'சக்திவேல் மணி', nameEn: 'Sakthivel Mani', phone: '+91 95441 77889', vehicle: 'TN 33 MN 6789' },
    { name: 'திருமலை ராஜா', nameEn: 'Thirumalai Raja', phone: '+91 94001 88990', vehicle: 'TN 02 OP 0123' },
];

// Pick a driver deterministically from the hospital rank
const getDriver = (rank = 1) => DRIVERS[(rank - 1) % DRIVERS.length];

// ─── Severity selector ────────────────────────────────────────────────────────
const SEVERITY_OPTIONS = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-700 border-green-200' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-700 border-red-200' },
];

// ─── Assigned hospital card ───────────────────────────────────────────────────
const HospitalCard = ({ hospital }) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospital.name)}`;
    const driver = getDriver(hospital.rank);
    const initials = driver.nameEn.split(' ').map(w => w[0]).join('');

    return (
        <div className="w-full bg-white rounded-2xl border border-emerald-100 shadow-md overflow-hidden">
            {/* Green header */}
            <div className="bg-emerald-500 px-4 py-3 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-white" />
                <span className="text-white font-semibold text-sm">Assigned Hospital — Rank #{hospital.rank}</span>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
                <p className="font-bold text-slate-800 text-base">{hospital.name}</p>

                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-blue-500" />
                        {hospital.distance_km} km away
                    </span>
                    <span className="flex items-center gap-1">
                        <Star size={13} className="text-amber-400 fill-amber-400" />
                        {hospital.rating}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={13} className="text-slate-400" />
                        ~{hospital.wait_time_min} min wait
                    </span>
                    <span className={`flex items-center gap-1 ${hospital.emergency_support ? 'text-emerald-600' : 'text-red-400'}`}>
                        {hospital.emergency_support
                            ? <><Wifi size={13} /> Emergency ER</>
                            : <><WifiOff size={13} /> No ER</>}
                    </span>
                </div>

                {/* Suitability score bar */}
                <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                        <span>Suitability Score</span>
                        <span>{(hospital.suitability_score * 100).toFixed(1)}% fit</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                            style={{ width: `${Math.max(5, (1 - hospital.suitability_score) * 100)}%` }}
                        />
                    </div>
                </div>

                {/* ── Ambulance Driver Card ── */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">🚑 Assigned Ambulance Driver</p>
                    <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {initials}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 text-sm truncate">{driver.nameEn}</p>
                            <p className="text-xs text-slate-500 truncate">{driver.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">🚗 {driver.vehicle}</p>
                        </div>
                        {/* Action buttons */}
                        <div className="flex gap-2 flex-shrink-0">
                            {/* Call */}
                            <a
                                href={`tel:${driver.phone.replace(/\s/g, '')}`}
                                className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white transition-colors"
                                title={`Call ${driver.nameEn}`}
                            >
                                <Phone size={16} />
                            </a>
                            {/* WhatsApp */}
                            <a
                                href={`https://wa.me/${driver.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white transition-colors"
                                title="WhatsApp"
                            >
                                <MessageCircle size={16} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Google Maps button */}
                <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white text-sm font-medium py-2.5 rounded-xl"
                >
                    <Navigation size={15} />
                    Get Directions in Google Maps
                </a>
            </div>
        </div>
    );
};

// ─── All ranked hospitals (collapsed list) ────────────────────────────────────
const RankedList = ({ hospitals }) => {
    const [open, setOpen] = useState(false);
    if (hospitals.length <= 1) return null;

    return (
        <div className="w-full">
            <button
                onClick={() => setOpen(o => !o)}
                className="text-xs text-slate-400 underline underline-offset-2 mb-2"
            >
                {open ? 'Hide' : 'Show'} all {hospitals.length} nearby hospitals
            </button>
            {open && (
                <div className="space-y-2">
                    {hospitals.slice(1).map(h => (
                        <div key={h.id ?? h.rank} className="bg-white border border-slate-100 rounded-xl px-4 py-3 flex justify-between items-center text-sm">
                            <div>
                                <span className="font-medium text-slate-700 text-xs">#{h.rank} {h.name}</span>
                                <p className="text-[10px] text-slate-400">{h.distance_km} km • ⭐ {h.rating} • ~{h.wait_time_min} min</p>
                            </div>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(h.name)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700"
                            >
                                <Navigation size={14} />
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Main Emergency page ──────────────────────────────────────────────────────
const Emergency = () => {
    const { status, assignedHospital, rankedHospitals, errorMsg, triggerSOS, reset } = useEmergency();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [severity, setSeverity] = useState('high');

    const isBusy = status === 'locating' || status === 'sending';

    // Guard: redirect to login if not authenticated
    if (!token) {
        return (
            <div className="p-6 flex flex-col items-center justify-center h-full gap-4">
                <AlertTriangle size={48} className="text-amber-500" />
                <p className="font-semibold text-slate-800 text-center">You must be logged in to use Emergency mode</p>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    const handleSOS = () => {
        if (isBusy) return;
        // RETRY: reset first, then immediately trigger again
        if (status === 'error') {
            reset();
            setTimeout(() => triggerSOS(severity), 50);
            return;
        }
        if (status === 'success') {
            reset();
            return;
        }
        triggerSOS(severity);
    };

    // Status label for the button
    const buttonLabel = {
        idle: 'SOS',
        locating: 'LOCATING...',
        sending: 'SENDING...',
        success: 'RESET',
        error: 'RETRY',
    }[status] ?? 'SOS';

    return (
        <div className="p-4 flex flex-col items-center space-y-6 pb-24">
            {/* Title */}
            <div className="text-center space-y-1 w-full">
                <h2 className="text-2xl font-bold text-slate-800">Emergency Mode</h2>
                <p className="text-slate-500 text-sm">
                    {status === 'idle'
                        ? 'Select severity and press SOS to call for help'
                        : status === 'locating'
                            ? 'Getting your location...'
                            : status === 'sending'
                                ? 'Contacting emergency services...'
                                : status === 'success'
                                    ? 'Help is on the way!'
                                    : 'Something went wrong. Try again.'}
                </p>
            </div>

            {/* Severity Selector */}
            {(status === 'idle') && (
                <div className="flex gap-2 flex-wrap justify-center w-full">
                    {SEVERITY_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setSeverity(opt.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${severity === opt.value
                                ? opt.color + ' ring-2 ring-offset-1 ring-current'
                                : 'bg-slate-50 border-slate-200 text-slate-500'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}

            {/* SOS Button */}
            <button
                onClick={handleSOS}
                disabled={isBusy}
                className={`w-48 h-48 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-500 select-none
                    ${status === 'success'
                        ? 'bg-emerald-500 shadow-emerald-400/50 scale-105'
                        : status === 'error'
                            ? 'bg-amber-500 shadow-amber-400/50'
                            : isBusy
                                ? 'bg-red-600 shadow-red-500/50 scale-110 animate-pulse'
                                : 'bg-white border-4 border-red-100 shadow-slate-200 hover:scale-105 active:scale-95'
                    } disabled:cursor-not-allowed`}
            >
                {isBusy ? (
                    <Loader2 size={48} className="text-white animate-spin" />
                ) : status === 'success' ? (
                    <CheckCircle2 size={48} className="text-white" />
                ) : (
                    <AlertTriangle size={48} className={status === 'error' ? 'text-white' : 'text-red-500'} />
                )}
                <span className={`mt-2 font-bold text-sm ${(isBusy || status === 'success' || status === 'error') ? 'text-white' : 'text-slate-700'}`}>
                    {buttonLabel}
                </span>
            </button>

            {/* Error Banner */}
            {status === 'error' && (
                <div className="w-full px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center">
                    {errorMsg || 'Could not reach the server. Please try again.'}
                </div>
            )}

            {/* Assigned hospital card + ranked list */}
            {status === 'success' && assignedHospital && (
                <>
                    <HospitalCard hospital={assignedHospital} />
                    <RankedList hospitals={rankedHospitals} />
                </>
            )}

            {/* Status cards */}
            <div className="w-full space-y-3">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-green-100 text-green-600'}`}>
                        <Phone size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-800">Ambulance Contacted</p>
                        <p className="text-xs text-slate-400">
                            {status === 'success' ? 'Dispatched ✓' : isBusy ? 'Connecting...' : 'Ready'}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                        <MapPin size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-800">Location Shared</p>
                        <p className="text-xs text-slate-400">
                            {status === 'success'
                                ? 'GPS location sent ✓'
                                : status === 'locating'
                                    ? 'Acquiring GPS...'
                                    : 'Waiting'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Emergency;
