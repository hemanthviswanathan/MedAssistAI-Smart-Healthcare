import React from 'react';
import { Bell, User } from 'lucide-react';

const Header = ({ title = "Thulir" }) => {
    return (
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 sticky top-0 z-40 shrink-0">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h1>
            <div className="flex items-center space-x-3">
                <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
                </button>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
                    <User size={18} />
                </div>
            </div>
        </header>
    );
};

export default Header;
