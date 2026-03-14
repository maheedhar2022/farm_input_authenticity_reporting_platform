import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scan, AlertTriangle, Image as ImageIcon, Activity, LogOut, Bell, BarChart3, ChevronRight, Sprout, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function FarmerDashboard() {
  const { user, logout, API_URL } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [cropStats, setCropStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const notifRes = await axios.get(`${API_URL}/api/notifications?limit=3`);
        const notifData = notifRes.data.data || notifRes.data;
        setNotifications(notifData.notifications || []);
        setUnreadCount(notifData.unreadCount || 0);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }

      try {
        const statsRes = await axios.get(`${API_URL}/api/crops/stats`);
        const statsData = statsRes.data.data || statsRes.data;
        setCropStats(statsData);
      } catch (err) {
        console.error('Failed to fetch crop stats', err);
      }
    };
    fetchData();
  }, [API_URL]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Profile Card */}
      <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute right-20 -bottom-10 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-green-200 rounded-full flex items-center justify-center border-4 border-white shadow-sm flex-shrink-0">
            <span className="text-2xl font-bold text-emerald-700">{user?.name?.charAt(0) || 'F'}</span>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">
              {t('dashboard.welcome', { name: user?.name || 'Farmer' })}
            </h2>
            <div className="flex items-center text-emerald-700 font-medium text-sm mt-1 gap-1">
              <MapPinIcon className="w-4 h-4" />
              {user?.district ? `${user.village || ''} ${user.mandal || ''} ${user.district}`.trim() : t('dashboard.completeProfile')}
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold shadow-sm relative z-10">
          <LogOut className="w-4 h-4 mr-2" /> {t('nav.logout')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Actions) */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-gray-800 ml-1">{t('dashboard.quickActions')}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Scan Card */}
            <Link to="/scan" className="glass-card p-6 group hover:border-emerald-300 transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="bg-gradient-to-br from-emerald-500 to-green-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4 text-white">
                <Scan className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 flex items-center justify-between">
                {t('nav.scan')} <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors transform group-hover:translate-x-1" />
              </h4>
              <p className="text-gray-500 text-sm mt-1">{t('dashboard.scanDesc')}</p>
            </Link>

            {/* Crop Health Card */}
            <Link to="/crop-analysis" className="glass-card p-6 group hover:border-blue-300 transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 text-white">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 flex items-center justify-between">
                {t('nav.cropAnalysis')} <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors transform group-hover:translate-x-1" />
              </h4>
              <p className="text-gray-500 text-sm mt-1">{t('dashboard.cropDesc')}</p>
            </Link>

            {/* Soil Health Card */}
            <Link to="/soil-health" className="glass-card p-6 group hover:border-amber-300 transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30 mb-4 text-white">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 flex items-center justify-between">
                {t('nav.soilHealth')} <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-500 transition-colors transform group-hover:translate-x-1" />
              </h4>
              <p className="text-gray-500 text-sm mt-1">{t('dashboard.soilDesc')}</p>
            </Link>

            {/* Report Fake Card */}
            <Link to="/report-fake" className="glass-card p-6 group hover:border-red-300 transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-red-100 to-red-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              <div className="bg-gradient-to-br from-red-500 to-rose-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30 mb-4 text-white">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 flex items-center justify-between">
                {t('nav.reportFake')} <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors transform group-hover:translate-x-1" />
              </h4>
              <p className="text-gray-500 text-sm mt-1">{t('dashboard.reportDesc')}</p>
            </Link>
          </div>
        </div>

        {/* Right Column (Widgets) */}
        <div className="space-y-6">
          
          {/* Notifications Widget */}
          <div className="glass-card p-5 relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-blue-600" /> {t('dashboard.alerts')}
              </h3>
              {unreadCount > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  {unreadCount} {t('dashboard.new')}
                </span>
              )}
            </div>
            
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notif, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-sm transition cursor-pointer">
                     <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${!notif.isRead ? 'bg-blue-600' : 'bg-transparent'}`}></div>
                     <div>
                       <p className={`text-sm ${!notif.isRead ? 'font-bold text-gray-800' : 'font-medium text-gray-600'}`}>{notif.title}</p>
                       <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.message}</p>
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                <ShieldCheck className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">{t('dashboard.caughtUp')}</p>
              </div>
            )}
          </div>

          {/* Mini Stats Widget */}
          {cropStats && cropStats.totalEntries > 0 && (
            <div className="glass-card p-5 bg-gradient-to-br from-emerald-600 to-green-700 text-white border-none shadow-emerald-500/20">
              <h3 className="text-emerald-50 font-medium mb-4 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" /> {t('dashboard.recentStats')}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-3 border border-white/20 backdrop-blur-sm">
                  <p className="text-3xl font-bold">{cropStats.totalEntries}</p>
                  <p className="text-xs text-emerald-100 font-medium tracking-wide uppercase mt-1">{t('dashboard.seasonsLogged')}</p>
                </div>
                
                {cropStats.stats?.slice(0, 1).map((s, i) => (
                  <div key={i} className="bg-white/10 rounded-xl p-3 border border-white/20 backdrop-blur-sm">
                    <p className="text-3xl font-bold">{s.totalYield}<span className="text-lg">q</span></p>
                    <p className="text-xs text-emerald-100 font-medium tracking-wide uppercase mt-1">{t('dashboard.totalCrop', { cropType: s._id })}</p>
                  </div>
                ))}
              </div>
              
              <Link to="/soil-health" className="mt-4 block text-center text-sm font-semibold text-emerald-100 hover:text-white transition group flex items-center justify-center">
                {t('dashboard.viewHistory')} <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}

          {/* Generic Auth Promotion (if needed) */}
          <div className="glass-card p-5 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
             <div className="flex items-center gap-3 mb-2">
                <Sprout className="w-6 h-6 text-indigo-600" />
                <h3 className="font-bold text-indigo-900">{t('dashboard.didYouKnow')}</h3>
             </div>
             <p className="text-sm text-indigo-800 leading-relaxed">
               {t('dashboard.promoText')}
             </p>
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper icon
function MapPinIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

export default FarmerDashboard;
