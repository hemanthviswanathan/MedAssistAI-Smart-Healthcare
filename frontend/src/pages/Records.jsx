import React from 'react';
import { FileText, Download, Share2, Calendar } from 'lucide-react';

const RecordItem = ({ title, date, doctor, type }) => (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                <FileText size={24} />
            </div>
            <div>
                <h3 className="font-medium text-slate-800">{title}</h3>
                <div className="flex items-center text-xs text-slate-400 space-x-2 mt-1">
                    <span className="flex items-center"><Calendar size={12} className="mr-1" /> {date}</span>
                    <span>•</span>
                    <span>{doctor}</span>
                </div>
            </div>
        </div>
        <div className="flex space-x-2">
            <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full transition-colors">
                <Download size={18} />
            </button>
        </div>
    </div>
);

const Records = () => {
    return (
        <div className="p-4 space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">Medical History</h2>
                <button className="text-sm text-primary font-medium hover:underline">Filter</button>
            </div>

            <div className="space-y-3">
                <RecordItem title="Blood Test Report" date="Oct 24, 2025" doctor="Dr. Sarah Smith" type="Lab" />
                <RecordItem title="MRI Scan - Knee" date="Sep 12, 2025" doctor="Dr. A. Kumar" type="Radiology" />
                <RecordItem title="General Checkup" date="Aug 05, 2025" doctor="Dr. P. Jones" type="Consultation" />
                <RecordItem title="Vaccination Record" date="Jan 15, 2025" doctor="City Hospital" type="Vaccine" />
            </div>

            <button className="w-full py-3 bg-white border border-dashed border-slate-300 text-slate-500 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2">
                <span>+ Upload New Record</span>
            </button>
        </div>
    );
};

export default Records;
