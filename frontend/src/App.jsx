import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Leaf } from 'lucide-react';

// Import Pages
import LanguageSwitcher from './components/LanguageSwitcher';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OtpVerification from './pages/OtpVerification';
import FarmerDashboard from './pages/FarmerDashboard';
import ProductScan from './pages/ProductScan';
import ProductResult from './pages/ProductResult';
import FakeProductReporting from './pages/FakeProductReporting';
import CropAnalysis from './pages/CropAnalysis';
import SoilHealthDashboard from './pages/SoilHealthDashboard';
import KrishiBot from './components/KrishiBot';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Custom layout wrapper for authenticated pages
const AppLayout = ({ children }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-100/50 to-transparent -z-10"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-soft"></div>
      <div className="absolute top-20 -left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-soft" style={{ animationDelay: '1s' }}></div>

      <header className="sticky top-0 z-50 glass-panel border-b border-white/40 mx-4 mt-4 lg:mx-8 mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-2 rounded-xl shadow-lg group-hover:shadow-green-500/30 transition-shadow">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-green-800">
                {t('app.title')}
              </h1>
            </Link>
            
            <div className="flex items-center gap-4">
               <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-20">
        {children}
      </main>
      
      <KrishiBot />
    </div>
  );
};

// Layout for auth pages (no nav)
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4">
      {/* Top right language switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      
      {/* Abstract background for auth pages */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-green-300/30 to-emerald-400/30 blur-3xl filter"></div>
        <div className="absolute bottom-[0%] right-[0%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-cyan-300/20 to-blue-400/20 blur-3xl filter"></div>
      </div>
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
          <Route path="/signup" element={<AuthLayout><Signup /></AuthLayout>} />
          <Route path="/verify-otp" element={<AuthLayout><OtpVerification /></AuthLayout>} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout><FarmerDashboard /></AppLayout></ProtectedRoute>} />
          <Route path="/scan" element={<ProtectedRoute><AppLayout><ProductScan /></AppLayout></ProtectedRoute>} />
          <Route path="/product-result" element={<ProtectedRoute><AppLayout><ProductResult /></AppLayout></ProtectedRoute>} />
          <Route path="/report-fake" element={<ProtectedRoute><AppLayout><FakeProductReporting /></AppLayout></ProtectedRoute>} />
          <Route path="/crop-analysis" element={<ProtectedRoute><AppLayout><CropAnalysis /></AppLayout></ProtectedRoute>} />
          <Route path="/soil-health" element={<ProtectedRoute><AppLayout><SoilHealthDashboard /></AppLayout></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
