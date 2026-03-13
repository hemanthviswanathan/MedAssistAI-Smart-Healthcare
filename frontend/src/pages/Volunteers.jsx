import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, HandHeart } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import socket from '../socket';
import VolunteerModal from '../components/VolunteerModal';
import VolunteerAlertModal from '../components/VolunteerAlertModal';

// Fix broken default marker icons in Vite/webpack builds
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// 5 dummy volunteer positions scattered around Chennai
const VOLUNTEERS = [
    { id: 1, pos: [13.0827, 80.2707], name: 'Arjun S.' },
    { id: 2, pos: [13.0604, 80.2496], name: 'Priya R.' },
    { id: 3, pos: [13.1143, 80.2329], name: 'Karthik M.' },
    { id: 4, pos: [13.0732, 80.2609], name: 'Deepa V.' },
    { id: 5, pos: [13.0501, 80.2122], name: 'Rahul T.' },
];

const HistoryItem = ({ date, title, description, points }) => (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col space-y-2">
        <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
            <Calendar size={12} />
            <span>{date}</span>
        </div>
        <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
        <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                Points Gained: +{points} points
            </span>
            <ArrowRight size={14} className="text-slate-300" />
        </div>
    </div>
);

const Volunteers = () => {
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
        <div className="p-4 space-y-6 pb-20">
            {/* Request Volunteer Button */}
            <button
                onClick={() => setVolunteerModalOpen(true)}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
            >
                <HandHeart size={20} />
                Request Volunteer Support
            </button>

            {/* Total Credits Card */}
            <div className="bg-indigo-100 rounded-2xl p-6 flex flex-col items-center justify-center space-y-1 shadow-sm">
                <h2 className="text-indigo-900 font-bold text-lg">Total Credits: 85pts</h2>
            </div>

            {/* Live Volunteer Map */}
            <div className="space-y-3">
                <h3 className="text-center text-sm font-medium text-slate-500">Active Volunteers Nearby</h3>
                <div className="w-full rounded-3xl overflow-hidden border-4 border-slate-100 shadow-inner" style={{ height: 300, position: 'relative', zIndex: 0 }}>
                    <MapContainer
                        center={[13.0827, 80.2707]}
                        zoom={12}
                        style={{ height: '100%', width: '100%', zIndex: 0 }}
                        scrollWheelZoom={false}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {VOLUNTEERS.map((v) => (
                            <Marker key={v.id} position={v.pos}>
                                <Popup>
                                    <span className="font-semibold">{v.name}</span><br />
                                    <span className="text-xs text-slate-500">Active volunteer</span>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>

            {/* History Section */}
            <div className="space-y-4">
                <h3 className="text-center text-sm font-medium text-slate-500">History</h3>
                <div className="space-y-3">
                    <HistoryItem
                        date="25th August 2024"
                        title="Blood donation"
                        description="Blood donation Camp at Chennai Institute of Technology"
                        points="30"
                    />
                    <HistoryItem
                        date="15th August 2024"
                        title="Volunteered in School Dental Camp"
                        description="Assisted in organizing the dental checkup camp."
                        points="25"
                    />
                    <HistoryItem
                        date="10th July 2024"
                        title="Tree Plantation Drive"
                        description="Planted 50 saplings in the community park."
                        points="30"
                    />
                </div>
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

export default Volunteers;
