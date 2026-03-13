import React, { useState, useEffect } from 'react';
import { FileText, Pill, AlertTriangle, User, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import VolunteerModal from '../components/VolunteerModal';
import VolunteerAlertModal from '../components/VolunteerAlertModal';

const Dashboard = () => {
    const navigate = useNavigate();

    const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);
    const [alertData, setAlertData] = useState(null);

    // Listen for incoming volunteer alerts from other clients
    useEffect(() => {
        const handler = (payload) => {
            setAlertData(payload);
        };
        socket.on('volunteer_alert', handler);
        return () => {
            socket.off('volunteer_alert', handler);
        };
    }, []);

    return (
        <div className="p-4 space-y-6 pb-20 bg-slate-50 min-h-full">
            {/* Header Section */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Thulir</h1>
                    <p className="text-blue-600 font-medium text-sm">Unified Medical ID: FUI23</p>
                </div>
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                    <User size={24} />
                </div>
            </div>

            {/* Medications Section */}
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-slate-600">View your medicinal</p>
                </div>
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <span className="font-bold text-slate-800">Remainder - After Food</span>
                        </div>
                        <span className="font-bold text-slate-800">10.30am</span>
                    </div>
                    <div className="space-y-1 text-xs text-slate-500 font-medium">
                        <p>Azithromycin - 100mg</p>
                        <p>Paracetamol - 100mg</p>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10">
                        <Pill size={80} className="text-blue-500 transform translate-x-4 translate-y-4" />
                    </div>
                </div>
            </div>

            {/* Report Section */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600">Your Report has been received!</p>
                <div className="bg-slate-100 p-4 rounded-2xl flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <FileText size={20} className="text-slate-700" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-slate-800 text-sm">Urinalysis Result</p>
                        <p className="text-[10px] text-slate-400">Deepam Hospital, Tambaram,<br />Chennai, Tamil Nadu</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons: SOS + Volunteer */}
            <div className="flex items-center justify-center gap-6 pt-8">
                {/* SOS */}
                <button
                    onClick={() => navigate('/emergency')}
                    className="w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-300 bg-red-600 shadow-red-200 hover:scale-105 active:scale-95"
                >
                    <AlertTriangle size={40} className="text-white mb-2" />
                    <span className="text-white text-xs font-bold">SOS</span>
                </button>

                {/* Volunteer Support */}
                <button
                    onClick={() => setVolunteerModalOpen(true)}
                    className="w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-300 bg-indigo-600 shadow-indigo-200 hover:scale-105 active:scale-95"
                >
                    <Users size={34} className="text-white mb-2" />
                    <span className="text-white text-[10px] font-bold text-center leading-tight px-2">Volunteer Support</span>
                </button>
            </div>

            {/* Modals */}
            <VolunteerModal
                isOpen={volunteerModalOpen}
                onClose={() => setVolunteerModalOpen(false)}
            />
            <VolunteerAlertModal
                isOpen={!!alertData}
                data={alertData}
                onDismiss={() => setAlertData(null)}
            />
        </div>
    );
};

export default Dashboard;
