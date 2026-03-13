import React, { useState } from 'react';
import { X, User, Phone, FileText, Send } from 'lucide-react';
import socket from '../socket';

const VolunteerModal = ({ isOpen, onClose }) => {
    const [form, setForm] = useState({ name: '', phone: '', description: '' });
    const [toast, setToast] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.phone.trim() || !form.description.trim()) return;
        setLoading(true);

        socket.emit('volunteer_requested', {
            name: form.name.trim(),
            phone: form.phone.trim(),
            description: form.description.trim(),
        });

        setLoading(false);
        setToast(true);

        setTimeout(() => {
            setToast(false);
            setForm({ name: '', phone: '', description: '' });
            onClose();
        }, 1800);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-end justify-center"
                onClick={onClose}
            >
                {/* Panel */}
                <div
                    className="bg-white w-full max-w-sm rounded-t-3xl p-6 pb-10 space-y-5 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800">🤝 Request Volunteer Support</h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="Your Name"
                                className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-100 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>

                        {/* Phone */}
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                placeholder="Phone Number"
                                className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-100 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>

                        {/* Description */}
                        <div className="relative">
                            <FileText size={16} className="absolute left-3 top-4 text-slate-400" />
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                required
                                rows={3}
                                placeholder="Describe the help needed…"
                                className="w-full pl-9 pr-4 py-3 rounded-2xl bg-slate-100 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-1">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 rounded-2xl bg-indigo-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-95 transition disabled:opacity-60"
                            >
                                <Send size={14} />
                                {loading ? 'Sending…' : 'Send Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg flex items-center gap-2 animate-fade-in">
                    ✅ Volunteer Request Broadcasted
                </div>
            )}
        </>
    );
};

export default VolunteerModal;
