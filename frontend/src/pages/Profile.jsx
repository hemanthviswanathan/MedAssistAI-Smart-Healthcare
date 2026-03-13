import React from 'react';
import { User, Calendar, Activity, FileText, ChevronRight, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="p-4 space-y-6 pb-20 bg-slate-50 min-h-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
                <button className="text-slate-400 hover:text-slate-600">
                    <Settings size={24} />
                </button>
            </div>

            {/* Profile Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 mb-4 border-4 border-white shadow-md">
                    <User size={48} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Kumar</h2>
                <p className="text-slate-500 text-sm font-medium">Unified Medical ID: FUI23</p>

                <div className="grid grid-cols-2 gap-8 w-full mt-6 text-center">
                    <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Age</p>
                        <p className="text-lg font-bold text-slate-800">53 Years</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Hospital Visits</p>
                        <p className="text-lg font-bold text-slate-800">2 <span className="text-xs text-slate-400 font-medium">/ 30 days</span></p>
                    </div>
                </div>
            </div>

            {/* Medical Conditions */}
            <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-800 px-1">Medical Conditions</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                        <Activity className="text-red-500 mb-2" size={24} />
                        <p className="font-bold text-slate-800">Diabetes</p>
                        <p className="text-xs text-red-600 font-medium mt-1">Type 2</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                        <Activity className="text-orange-500 mb-2" size={24} />
                        <p className="font-bold text-slate-800">Blood Pressure</p>
                        <p className="text-xs text-orange-600 font-medium mt-1">Hypertension</p>
                    </div>
                </div>
            </div>

            {/* Menu Options */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                            <FileText size={16} />
                        </div>
                        <span className="font-medium text-slate-700">Medical Records</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <Calendar size={16} />
                        </div>
                        <span className="font-medium text-slate-700">Past Appointments</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-400" />
                </button>
            </div>

            <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 p-4 text-red-500 font-medium hover:bg-red-50 rounded-xl transition-colors">
                <LogOut size={20} />
                <span>Log Out</span>
            </button>
        </div>
    );
};

export default Profile;
