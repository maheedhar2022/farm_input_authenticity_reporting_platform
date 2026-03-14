import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Leaf, UserCircle, Phone, ArrowRight, Lock } from 'lucide-react';

function Signup() {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { API_URL } = useAuth();
  const { t } = useTranslation();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (aadhaarNumber.length !== 12) {
      setError('Aadhaar must be exactly 12 digits');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit Indian phone number starting with 6-9');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/send-otp`, {
        aadhaarNumber,
        phoneNumber
      });
      console.log('OTP details:', res.data);
      
      localStorage.setItem('tempRegistration', JSON.stringify({ aadhaarNumber, phoneNumber }));
      navigate('/verify-otp');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request OTP. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 sm:p-10 w-full relative overflow-hidden">
      <div className="absolute -bottom-10 -left-10 text-green-100 opacity-50 transform -rotate-45 pointer-events-none">
        <Leaf className="w-40 h-40" />
      </div>

      <div className="relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto bg-gradient-to-br from-emerald-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 mb-4 animate-float">
            <UserCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-green-800 tracking-tight">
            {t('signup.title')}
          </h2>
          <div className="flex items-center justify-center mt-3 gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">1</span>
            <div className="h-1 w-8 bg-gray-200 rounded"></div>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-500">2</span>
          </div>
          <p className="text-gray-500 mt-2 text-sm font-medium">{t('signup.subtitle')}</p>
        </div>
        
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 p-4 rounded-xl mb-6 shadow-sm flex items-start text-sm">
            <div className="mr-2 mt-0.5">⚠️</div>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 ml-1">{t('signup.aadhaar')}</label>
            <div className="relative">
              <input 
                type="text" 
                maxLength="12"
                className="input-styled tracking-widest font-mono text-center"
                placeholder="XXXX XXXX XXXX"
                value={aadhaarNumber}
                onChange={e => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                required 
              />
            </div>
            <p className="text-xs text-gray-400 mt-1.5 ml-1 flex items-center">
               <Lock className="w-3 h-3 mr-1" /> {t('signup.secure')}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2 ml-1">{t('login.phone')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 font-medium border-r pr-2 border-gray-300">+91</span>
              </div>
              <input 
                type="text" 
                maxLength="10"
                className="input-styled pl-14 tracking-wider"
                placeholder="Mobile Number"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary mt-6 flex justify-center items-center gap-2 text-lg group"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {t('signup.sendOtp')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-600 font-medium">
            {t('signup.hasAccount')}{' '}
            <Link to="/login" className="text-emerald-600 hover:text-emerald-800 font-bold hover:underline transition-colors">
              {t('signup.loginInstead')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
