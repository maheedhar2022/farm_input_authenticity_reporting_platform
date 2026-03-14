import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Leaf, UserPlus, KeyRound, CheckCircle2 } from 'lucide-react';

function OtpVerification() {
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [tempData, setTempData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, API_URL } = useAuth();

  useEffect(() => {
    const data = localStorage.getItem('tempRegistration');
    if (data) {
      setTempData(JSON.parse(data));
    } else {
      navigate('/signup');
    }
  }, [navigate]);

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === '123456') {
      setIsOtpVerified(true);
      setError('');
    } else {
      setError('Invalid OTP. Please use 123456 for testing.');
    }
  };

  const handleAccountCreation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        password,
        aadhaarNumber: tempData.aadhaarNumber,
        phoneNumber: tempData.phoneNumber
      });
      const result = res.data.data || res.data;
      login(result, result.token);
      localStorage.removeItem('tempRegistration');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8 sm:p-10 w-full relative overflow-hidden">
      <div className="absolute top-10 -right-10 text-green-100 opacity-50 transform rotate-12 pointer-events-none">
        <Leaf className="w-32 h-32" />
      </div>

      <div className="relative z-10">
        {!isOtpVerified ? (
          <>
            <div className="text-center mb-8">
              <div className="mx-auto bg-gradient-to-br from-emerald-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 mb-4 animate-float">
                <KeyRound className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-green-800 tracking-tight">
                Enter OTP
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                Sent securely to +91 {tempData?.phoneNumber}
              </p>
            </div>

            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 p-4 rounded-xl mb-6 shadow-sm flex items-start text-sm">
                <div className="mr-2 mt-0.5">⚠️</div>
                {error}
              </div>
            )}
            
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-3 text-center">6-Digit Code (Hint: 123456)</label>
                <input 
                  type="text" 
                  className="input-styled text-center text-3xl tracking-[1em] font-mono py-4"
                  maxLength="6"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  required 
                />
              </div>
              <button type="submit" className="btn-primary text-lg">
                Verify OTP
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="mx-auto bg-gradient-to-br from-blue-500 to-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 animate-float">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-cyan-800 tracking-tight">
                Setup Profile
              </h2>
              <div className="flex items-center justify-center mt-3 gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                <div className="h-1 w-8 bg-emerald-500 rounded"></div>
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">2</span>
              </div>
              <p className="text-gray-500 mt-2 text-sm font-medium">Final step to secure your account</p>
            </div>

            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 p-4 rounded-xl mb-6 shadow-sm flex items-start text-sm">
                <div className="mr-2 mt-0.5">⚠️</div>
                {error}
              </div>
            )}
            
            <form onSubmit={handleAccountCreation} className="space-y-5">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 ml-1">Full Legal Name</label>
                <input 
                  type="text" 
                  className="input-styled"
                  placeholder="As per Aadhaar"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required 
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 ml-1">Secure Password</label>
                <input 
                  type="password" 
                  className="input-styled"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  minLength="6"
                  required 
                />
                <p className="text-xs text-gray-400 mt-1.5 ml-1">Minimum 6 characters required</p>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-6 flex justify-center items-center h-[52px] disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : 'Complete Registration'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default OtpVerification;
