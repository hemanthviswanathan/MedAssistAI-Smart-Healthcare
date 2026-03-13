import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login, loading, error } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ identifier: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ok = await login(formData.identifier, formData.password);
        if (ok) navigate('/dashboard');
    };

    return (
        <div className="flex flex-col h-full bg-white px-6 pt-8 pb-6">
            <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 mb-8 hover:bg-slate-50"
            >
                <ChevronLeft className="w-6 h-6 text-slate-900" />
            </button>

            <div className="mb-10">
                <h1 className="text-3xl font-bold text-slate-900 leading-tight block">
                    Welcome back! Glad <br />
                    to see you, Again!
                </h1>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                <div>
                    <input
                        type="text"
                        name="identifier"
                        value={formData.identifier}
                        onChange={handleChange}
                        placeholder="Email Address"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    />
                </div>

                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div className="flex justify-end">
                    <button type="button" className="text-sm font-medium text-slate-900">
                        Forgot Password?
                    </button>
                </div>

                <div className="pt-8">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-medium text-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {loading ? <><Loader2 size={20} className="animate-spin" /> Logging in...</> : 'Login'}
                    </button>
                </div>
            </form>

            <div className="text-center mt-6">
                <span className="text-slate-600">Don't have an account? </span>
                <button
                    onClick={() => navigate('/register')}
                    className="text-teal-500 font-medium hover:text-teal-600"
                >
                    Register Now
                </button>
            </div>
        </div>
    );
};

export default Login;
