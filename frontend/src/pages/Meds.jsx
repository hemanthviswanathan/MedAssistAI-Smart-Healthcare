import React, { useState } from 'react';
import { CheckCircle, Circle, Clock, Pill } from 'lucide-react';

const MedItem = ({ name, dosage, time, taken, onToggle }) => (
    <div
        onClick={onToggle}
        className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${taken
                ? 'bg-emerald-50 border-emerald-100 opacity-75'
                : 'bg-white border-slate-100 shadow-sm hover:shadow-md'
            }`}
    >
        <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${taken ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-50 text-orange-500'
                }`}>
                <Pill size={24} />
            </div>
            <div>
                <h3 className={`font-medium transition-colors ${taken ? 'text-emerald-800 line-through' : 'text-slate-800'}`}>
                    {name}
                </h3>
                <div className="flex items-center text-xs text-slate-400 space-x-3 mt-1">
                    <span className="flex items-center"><Clock size={12} className="mr-1" /> {time}</span>
                    <span>{dosage}</span>
                </div>
            </div>
        </div>
        <div className={`transition-colors ${taken ? 'text-emerald-500' : 'text-slate-300'}`}>
            {taken ? <CheckCircle size={24} /> : <Circle size={24} />}
        </div>
    </div>
);

const Meds = () => {
    const [meds, setMeds] = useState([
        { id: 1, name: 'Amoxicillin', dosage: '500mg', time: '08:00 AM', taken: true },
        { id: 2, name: 'Vitamin D', dosage: '1000IU', time: '09:00 AM', taken: false },
        { id: 3, name: 'Paracetamol', dosage: '650mg', time: '02:00 PM', taken: false },
        { id: 4, name: 'Amoxicillin', dosage: '500mg', time: '08:00 PM', taken: false },
    ]);

    const toggleMed = (id) => {
        setMeds(meds.map(med => med.id === id ? { ...med, taken: !med.taken } : med));
    };

    return (
        <div className="p-4 space-y-6 pb-20">
            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <h2 className="text-lg font-bold text-primary-dark mb-1">Daily Progress</h2>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-primary h-full transition-all duration-500"
                        style={{ width: `${(meds.filter(m => m.taken).length / meds.length) * 100}%` }}
                    ></div>
                </div>
                <p className="text-xs text-primary mt-2 text-right">
                    {meds.filter(m => m.taken).length} of {meds.length} taken
                </p>
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Today's Schedule</h3>
                <div className="space-y-3">
                    {meds.map(med => (
                        <MedItem key={med.id} {...med} onToggle={() => toggleMed(med.id)} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Meds;
