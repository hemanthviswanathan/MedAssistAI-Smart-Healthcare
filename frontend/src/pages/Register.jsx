import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register, loading, error } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [validationError, setValidationError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError('');

        if (formData.password !== formData.confirmPassword) {
            setValidationError('Passwords do not match.');
            return;
        }

        const ok = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
        });
        if (ok) navigate('/dashboard');
    };

    const displayError = validationError || error;

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
                    Hello! Register to get <br />
                    started
                </h1>
            </div>

            {/* Error Banner */}
            {displayError && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {displayError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                />

                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
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

                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 pr-12"
                    />
                </div>

                <div className="pt-8">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-medium text-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {loading ? <><Loader2 size={20} className="animate-spin" /> Registering...</> : 'Register'}
                    </button>
                </div>
            </form>

            <div className="text-center mt-6">
                <span className="text-slate-600">Already have an account? </span>
                <button
                    onClick={() => navigate('/login')}
                    className="text-teal-500 font-medium hover:text-teal-600"
                >
                    Login Now
                </button>
            </div>
        </div>
    );
};

export default Register;
