import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full bg-white px-6">
            <div className="flex-1 flex items-center justify-center">
                <h1 className="text-6xl font-sans font-bold tracking-tight text-slate-900">
                    Thulir
                </h1>
            </div>

            <div className="mb-12 space-y-4">
                <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-medium text-lg hover:bg-slate-800 transition-colors"
                >
                    Login
                </button>
                <button
                    onClick={() => navigate('/register')}
                    className="w-full bg-white text-slate-900 border border-slate-200 py-4 rounded-xl font-medium text-lg hover:bg-slate-50 transition-colors"
                >
                    Register
                </button>
            </div>
        </div>
    );
};

export default Welcome;
