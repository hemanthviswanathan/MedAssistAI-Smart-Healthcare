import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, AlertCircle, Pill, Users, ClipboardList, User } from 'lucide-react';
import clsx from 'clsx';

const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            clsx(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                isActive ? "text-primary" : "text-slate-400 hover:text-slate-600"
            )
        }
    >
        <Icon size={24} strokeWidth={2} />
        <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
);

const BottomNav = () => {
    return (
        <div className="h-16 bg-white border-t border-slate-100 flex items-center justify-around px-2 z-50 shrink-0">
            <NavItem to="/meds" icon={Pill} label="Meds" />
            <NavItem to="/appointments" icon={ClipboardList} label="Appointments" />
            <div className="relative -top-5">
                <NavLink to="/dashboard" className="flex items-center justify-center w-14 h-14 bg-red-600 rounded-full shadow-lg shadow-red-200 text-white hover:scale-105 transition-transform active:scale-95">
                    <Home size={28} />
                </NavLink>
            </div>
            <NavItem to="/profile" icon={User} label="Profile" />
            <NavItem to="/volunteers" icon={Users} label="Help" />
        </div>
    );
};

export default BottomNav;
