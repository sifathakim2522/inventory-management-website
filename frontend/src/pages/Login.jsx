import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from "axios"; 

const Login = () => {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            if (response.data.success) {
                login(response.data.user, response.data.token);
                const role = response.data.user?.role;
                role === 'admin' ? navigate('/admin/dashboard') : navigate('/user/dashboard');
            } else {
                alert(response.data.error || 'Login failed');
            }
        } catch (error) {
            setError(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 min-h-screen font-sans">
            
            <div className="mb-8 text-center animate-fade-in-down">
                <div className="inline-block p-3 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
                    {/* Optional: You can put a logo icon here */}
                    <span className="text-3xl">📦</span>
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
                <p className="text-indigo-200 mt-2 text-sm">Sign in to manage your inventory</p>
            </div>

            {/* CARD: Glassmorphism effect (White with transparency) */}
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 relative overflow-hidden">
                {/* Decorative purple blob at top right */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 rounded-full bg-purple-100 opacity-50 blur-2xl"></div>

                {error && (
                    <div className="bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-lg mb-6 text-sm flex items-center">
                        <span className="mr-2">⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-gray-900 transition-all"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@company.com"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5 ml-1">
                            <label className="block text-sm font-semibold text-gray-700">Password</label>
                            <a href="#" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Forgot?</a>
                        </div>
                        <input
                            type="password"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-gray-900 transition-all"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* BUTTON: Indigo/Purple Gradient */}
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all duration-200 shadow-lg shadow-indigo-200 disabled:opacity-70 mt-2"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In to Dashboard"}
                    </button>
                </form>
            </div>
            
            <p className="mt-8 text-xs text-indigo-200/60">Powered by IMS Pro v1.0</p>
        </div>
    );
};

export default Login;

