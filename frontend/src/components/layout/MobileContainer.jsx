import React from 'react';

const MobileContainer = ({ children }) => {
    return (
        <div className="min-h-screen w-full bg-slate-100 flex justify-center items-start sm:py-8">
            <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[800px] sm:h-[85vh] sm:rounded-3xl shadow-2xl overflow-hidden relative flex flex-col border-slate-200 sm:border">
                {children}
            </div>
        </div>
    );
};

export default MobileContainer;
