import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const VolunteerAlertModal = ({ isOpen, data, onDismiss }) => {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-bounce-in">
                {/* Urgent Banner */}
                <div className="bg-red-600 px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 animate-pulse">
                        <AlertTriangle size={22} className="text-white" />
                    </div>
                    <div>
                        <p className="text-white font-extrabold text-base leading-tight">🚨 URGENT</p>
                        <p className="text-red-100 text-xs font-medium">Volunteer Requested Nearby!</p>
                    </div>
                </div>

                {/* Details */}
                <div className="px-6 py-5 space-y-4">
                    <InfoRow label="Name" value={data.name} />
                    <InfoRow label="Phone" value={data.phone} isPhone />
                    <InfoRow label="Help Needed" value={data.description} />
                </div>

                {/* Dismiss */}
                <div className="px-6 pb-6">
                    <button
                        onClick={onDismiss}
                        className="w-full py-3 rounded-2xl bg-slate-100 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 active:scale-95 transition"
                    >
                        <X size={14} />
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ label, value, isPhone }) => (
    <div className="space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
        {isPhone ? (
            <a
                href={`tel:${value}`}
                className="text-indigo-600 font-bold text-sm hover:underline"
            >
                {value}
            </a>
        ) : (
            <p className="text-slate-800 font-semibold text-sm leading-snug">{value}</p>
        )}
    </div>
);

export default VolunteerAlertModal;
