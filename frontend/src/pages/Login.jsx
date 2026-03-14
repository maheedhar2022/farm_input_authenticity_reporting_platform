import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Leaf, LogIn, Phone, Lock } from 'lucide-react';

function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, API_URL } = useAuth();
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { phoneNumber, password });
      const result = res.data.data || res.data;
      login(result, result.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 sm:p-10 w-full relative overflow-hidden">
      {/* Decorative leaf icon */}
      <div className="absolute -top-6 -right-6 text-green-100 opacity-50 transform rotate-45 pointer-events-none">
        <Leaf className="w-32 h-32" />
      </div>

      <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto bg-gradient-to-br from-emerald-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 mb-4 animate-float">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-green-800 tracking-tight">
            {t('login.welcome')}
          </h2>
          <p className="text-gray-500 mt-2 font-medium">{t('login.subtitle')}</p>
        </div>

        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 p-4 rounded-xl mb-6 shadow-sm flex items-start text-sm">
            <div className="mr-2 mt-0.5">⚠️</div>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 ml-1">{t('login.phone')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                className="input-styled pl-10"
                placeholder="e.g. 9876543210"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                required 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 ml-1">{t('login.password')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                className="input-styled pl-10"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary mt-6 flex justify-center items-center gap-2 text-lg"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" /> {t('login.signIn')}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-600 font-medium">
            {t('login.newAccount')}{' '}
            <Link to="/signup" className="text-emerald-600 hover:text-emerald-800 font-bold hover:underline transition-colors">
              {t('login.createAccount')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
