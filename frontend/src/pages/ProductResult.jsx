import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ShieldX, ShieldAlert, ArrowLeft, Scan, AlertOctagon, Info, MapPin, Bot } from 'lucide-react';

function ProductResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, batchCode } = location.state || {};
  const isAiAnalyzed = result?.isAiAnalyzed;

  if (!result) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center space-y-4 animate-in fade-in">
        <ShieldAlert className="w-20 h-20 text-gray-300 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-700">No Product Data</h2>
        <p className="text-gray-500">Please scan a product first to view its details.</p>
        <Link to="/scan" className="btn-primary inline-flex w-auto mt-4">
          <Scan className="w-5 h-5 mr-2" /> Go to Scanner
        </Link>
      </div>
    );
  }

  const product = result.product;
  const status = result.status;
  const isGenuine = status === 'Genuine';
  const isCounterfeit = status === 'Counterfeit';
  const isSuspicious = status === 'Suspicious';
  const isNotFound = status === 'Not Found';

  const getStatusConfig = () => {
    if (isGenuine) return {
      bg: 'from-emerald-500 to-green-600',
      icon: <ShieldCheck className="w-20 h-20 text-white drop-shadow-md animate-pulse-soft" />,
      title: isAiAnalyzed ? 'AI Verified: Genuine' : 'Genuine Product',
      subtitle: isAiAnalyzed ? 'Vision analysis suggests this product is original.' : 'This product is verified and safe to use.',
      cardBg: 'bg-emerald-50/50 border-emerald-200',
      textColor: 'text-emerald-800',
      badge: 'bg-emerald-100 text-emerald-800',
    };
    if (isCounterfeit) return {
      bg: 'from-rose-500 to-red-700',
      icon: <ShieldX className="w-20 h-20 text-white drop-shadow-md" />,
      title: isAiAnalyzed ? 'AI Warning: Counterfeit' : 'Counterfeit Alert',
      subtitle: isAiAnalyzed ? 'Vision analysis detected visual anomalies. Likely fake!' : 'DANGER: Do not use this product!',
      cardBg: 'bg-red-50/50 border-red-200',
      textColor: 'text-red-800',
      badge: 'bg-red-100 text-red-800',
    };
    if (isSuspicious) return {
      bg: 'from-amber-400 to-orange-600',
      icon: <ShieldAlert className="w-20 h-20 text-white drop-shadow-md" />,
      title: isAiAnalyzed ? 'AI Note: Suspicious' : 'Suspicious Product',
      subtitle: isAiAnalyzed ? 'Uncertain visual signs detected. Manual check recommended.' : 'Requires further investigation. Proceed with caution.',
      cardBg: 'bg-amber-50/50 border-amber-200',
      textColor: 'text-amber-800',
      badge: 'bg-amber-100 text-amber-800',
    };
    return {
      bg: 'from-slate-600 to-gray-800',
      icon: <AlertOctagon className="w-20 h-20 text-white drop-shadow-md" />,
      title: 'Product Not Found',
      subtitle: 'This batch code is not registered. Highly likely fake.',
      cardBg: 'bg-slate-50 border-slate-200',
      textColor: 'text-slate-800',
      badge: 'bg-slate-200 text-slate-800',
    };
  };

  const config = getStatusConfig();

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-500 pb-10">
      <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-500 hover:text-gray-800 font-bold transition-colors mb-2 cursor-pointer">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      {/* Hero Banner Card */}
      <div className={`relative overflow-hidden rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl bg-gradient-to-br ${config.bg}`}>
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 bg-white/20 p-4 rounded-full backdrop-blur-md shadow-inner">
            {config.icon}
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight drop-shadow-sm">{config.title}</h2>
          <p className="text-white/90 text-lg md:text-xl max-w-lg mx-auto font-medium">{config.subtitle}</p>
          
          <div className="mt-8 inline-flex items-center bg-black/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-inner">
            <Scan className="w-5 h-5 text-white/70 mr-3" />
            <div className="text-left font-mono">
              <span className="text-xs text-white/60 block uppercase tracking-widest">Batch Code</span>
              <span className="font-bold text-lg tracking-wider">{batchCode}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Grid */}
      {product && (
        <div className={`glass-card p-6 md:p-8 space-y-8 ${config.cardBg} border-t-4`}>
          <div className="flex items-center justify-between border-b pb-4 border-black/10">
             <h3 className={`text-2xl font-bold ${config.textColor} flex items-center`}>
               <Info className="w-6 h-6 mr-2 opacity-80" /> Product Intelligence
             </h3>
             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${config.badge}`}>
               {product.category || 'General'}
             </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="bg-white/60 p-4 rounded-xl shadow-sm border border-white/40">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Product Name</p>
              <p className="text-xl font-bold text-gray-800">{product.productName}</p>
            </div>
            <div className="bg-white/60 p-4 rounded-xl shadow-sm border border-white/40">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Brand & Manufacturer</p>
              <p className="text-lg font-bold text-gray-800">{product.brand}</p>
              <p className="text-gray-600 text-sm mt-0.5">{product.manufacturer}</p>
            </div>
            
            {product.price && (
              <div className="bg-white/60 p-4 rounded-xl shadow-sm border border-white/40">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">MRP Price</p>
                <p className="text-xl font-bold text-emerald-700">₹{product.price}</p>
              </div>
            )}
            
            <div className="bg-white/60 p-4 rounded-xl shadow-sm border border-white/40">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Scans</p>
              <p className="text-xl font-bold text-blue-700">{product.verificationCount || 1}</p>
              <p className="text-xs text-gray-500 mt-1">
                {product.verificationCount > 5 ? 'High scan count may indicate cloning' : 'Normal scan rate'}
              </p>
            </div>

            <div className={`p-4 rounded-xl shadow-sm border ${result.isExpired ? 'bg-red-50/80 border-red-200' : 'bg-white/60 border-white/40'} md:col-span-2 flex justify-between items-center`}>
               <div>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Lifecycle</p>
                  <div className="flex gap-6 mt-1">
                    <div>
                      <span className="text-sm text-gray-500 block">Mfg. Date</span>
                      <span className="font-bold text-gray-800">{new Date(product.mfgDate).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 block">Expiry Date</span>
                      <span className={`font-bold ${result.isExpired ? 'text-red-700' : 'text-gray-800'}`}>
                        {new Date(product.expiryDate).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
               </div>
               {result.isExpired && (
                 <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg font-bold text-sm tracking-wider uppercase border border-red-200 shadow-sm">
                   Expired
                 </div>
               )}
            </div>
          </div>

          {product.qrCodeImage && (
            <div className="pt-6 border-t border-black/10 flex flex-col items-center">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">Authentic QR Reference</p>
              <div className="bg-white p-2 rounded-2xl shadow-md border border-gray-100 inline-block">
                <img
                  src={`http://localhost:5000${product.qrCodeImage}`}
                  alt={`QR ref`}
                  className="w-32 h-32 rounded-xl"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Vision Results */}
      {isAiAnalyzed && (
        <div className={`glass-card p-6 md:p-8 space-y-6 ${config.cardBg} border-t-4`}>
          <div className="flex items-center gap-3 border-b pb-4 border-black/10">
            <div className={`p-2 rounded-lg ${config.badge}`}>
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${config.textColor}`}>AI Vision Analysis</h3>
              <p className="text-gray-500 text-sm">Visual forensics based on image analysis</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/60 p-5 rounded-2xl shadow-sm border border-white/40">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-3">AI Observations</p>
              <ul className="space-y-2">
                {result.observations?.map((obs, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    {obs}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="bg-white/60 p-5 rounded-2xl shadow-sm border border-white/40">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Confidence Score</p>
                <div className="flex items-center gap-4">
                  <span className={`text-3xl font-black ${config.textColor}`}>{result.confidenceScore}%</span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${config.bg} transition-all duration-1000`}
                      style={{ width: `${result.confidenceScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className={`p-5 rounded-2xl shadow-sm border ${config.badge} bg-opacity-30`}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-70">AI Recommendation</p>
                <p className="font-bold text-sm leading-relaxed">{result.recommendation}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-800 leading-relaxed italic">
              AI Vision is a diagnostic aid and may not catch all types of counterfeit. Always look for official QR codes as the primary source of truth.
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons Container */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-100 gap-4 flex flex-col sm:flex-row justify-center mt-8">
        <button
          onClick={() => navigate('/scan')}
          className="flex-1 bg-gray-100 text-gray-700 p-4 rounded-xl hover:bg-gray-200 transition font-bold flex items-center justify-center transform hover:-translate-y-0.5 shadow-sm"
        >
          <Scan className="w-5 h-5 mr-2" /> Scan Another
        </button>
        
        {(isCounterfeit || isSuspicious || isNotFound || result?.isExpired) && (
          <Link
            to="/report-fake"
            className="flex-[2] bg-gradient-to-r from-red-600 to-rose-700 text-white p-4 rounded-xl hover:from-red-700 hover:to-rose-800 transition font-bold flex items-center justify-center shadow-md transform hover:-translate-y-0.5"
          >
            <AlertOctagon className="w-5 h-5 mr-2" /> Report to Authorities
          </Link>
        )}
        
        {isGenuine && !result?.isExpired && (
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-[2] bg-gradient-to-r from-emerald-500 to-green-600 text-white p-4 rounded-xl hover:from-emerald-600 hover:to-green-700 transition font-bold flex items-center justify-center shadow-md transform hover:-translate-y-0.5"
          >
            <ShieldCheck className="w-5 h-5 mr-2" /> Return to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductResult;
