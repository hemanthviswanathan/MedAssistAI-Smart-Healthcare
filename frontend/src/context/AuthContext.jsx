import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Restore user info from localStorage on page reload
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser && token) {
            try { setUser(JSON.parse(savedUser)); } catch { /* ignore */ }
        }
    }, [token]);

    const login = async (identifier, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: identifier, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user ?? {}));
            setToken(data.token);
            setUser(data.user ?? {});
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async ({ name, email, password }) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Registration failed');

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user ?? {}));
            setToken(data.token);
            setUser(data.user ?? {});
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
