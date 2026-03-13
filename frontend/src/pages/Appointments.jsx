import React from 'react';
import { Search, MapPin, User } from 'lucide-react';

const HospitalCard = ({ name, location }) => (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-3">
        <div>
            <h3 className="font-bold text-slate-900 text-sm">{name}</h3>
            <p className="text-[10px] text-slate-500 font-medium">{location}</p>
        </div>
        <button className="w-full py-3 bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-100 transition-colors">
            Book an appointment
        </button>
    </div>
);

const Appointments = () => {
    return (
        <div className="p-4 space-y-6 pb-20 bg-slate-50 min-h-full">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                    <User size={24} />
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-11 pr-4 py-4 border-none rounded-full bg-white shadow-sm text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-200"
                    placeholder="Book an appointment"
                />
            </div>

            {/* Hospital List */}
            <div className="space-y-4">
                <HospitalCard
                    name="Deepam Hospital"
                    location="Tambaram, Chennai, Tamil Nadu, India"
                />
                <HospitalCard
                    name="Ramachandra Hospital"
                    location="Ramachandra Nagar, Chennai, Tamil Nadu, India"
                />
                <HospitalCard
                    name="Rajiv Gandhi Govt. Hospital"
                    location="Chennai Central, Chennai, Tamil Nadu, India"
                />
            </div>
        </div>
    );
};

export default Appointments;
