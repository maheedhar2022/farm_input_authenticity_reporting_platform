import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType, Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import { Camera, Search, XCircle, QrCode, ArrowLeft, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProductScan() {
  const { API_URL } = useAuth();
  const navigate = useNavigate();
  const [batchCode, setBatchCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [scannerActive, setScannerActive] = useState(false);
  const scannerRef = useRef(null);
  const scannerContainerId = 'qr-reader';

  // Cleanup scanner when component unmounts or scanner becomes inactive
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError('');
    setLoading(true);

    try {
      const html5QrCode = new Html5Qrcode("file-qr-reader");
      const decodedText = await html5QrCode.scanFile(file, true);
      let extractedBatchCode = decodedText;
      try {
        const parsed = JSON.parse(decodedText);
        if (parsed.batchCode) extractedBatchCode = parsed.batchCode;
      } catch {}
      handleVerifyCode(extractedBatchCode);
    } catch (err) {
      // If QR scan fails, try AI Vision analysis
      handleAiVisionAnalysis(file);
    }
  };

  const handleAiVisionAnalysis = async (file) => {
    setError('');
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('productImage', file);
      
      const res = await axios.post(`${API_URL}/api/ai/analyze-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      navigate('/product-result', {
        state: {
          result: {
            ...res.data.data,
            isAiAnalyzed: true
          },
          batchCode: 'AI VISION SCAN'
        }
      });
    } catch (err) {
      console.error('AI Analysis error:', err);
      setError("Failed to analyze image. Please ensure the image is clear and contains a product label.");
    } finally {
      setLoading(false);
    }
  };

  const startScanner = () => {
    setError('');
    setScannerActive(true);

    // Delay to let the DOM element render
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        scannerContainerId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          rememberLastUsedCamera: true,
        },
        false
      );

      scanner.render(
        // Success callback
        (decodedText) => {
          let extractedBatchCode = decodedText;
          try {
            const parsed = JSON.parse(decodedText);
            if (parsed.batchCode) {
              extractedBatchCode = parsed.batchCode;
            }
          } catch {
            // Not JSON, use raw text as batch code
          }

          // Stop scanner
          scanner.clear().catch(() => {});
          scannerRef.current = null;
          setScannerActive(false);

          // Auto-verify the scanned code
          handleVerifyCode(extractedBatchCode);
        },
        () => {} // error callback ignored
      );

      scannerRef.current = scanner;
    }, 100);
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(() => {});
      scannerRef.current = null;
    }
    setScannerActive(false);
  };

  const handleVerifyCode = async (code) => {
    if (!code) {
      setError('Please enter a batch code to verify.');
      return;
    }
    setError('');
    setLoading(true);
    setBatchCode(code);

    try {
      const res = await axios.post(`${API_URL}/api/products/verify`, { batchCode: code });
      const data = res.data.data || res.data;

      navigate('/product-result', {
        state: {
          result: data,
          batchCode: code,
        },
      });
    } catch (err) {
      if (err.response?.status === 404) {
        navigate('/product-result', {
          state: {
            result: {
              status: 'Not Found',
              message: 'Product not found in our database. It might be counterfeit.',
              product: null,
            },
            batchCode: code,
          },
        });
      } else {
        setError(err.response?.data?.message || 'Verification failed. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (e) => {
    e?.preventDefault();
    handleVerifyCode(batchCode);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div id="file-qr-reader" style={{ display: 'none' }}></div>
      <button onClick={() => navigate(-1)} className="inline-flex items-center text-emerald-600 hover:text-emerald-800 font-bold transition-colors mb-2">
        <ArrowLeft className="w-5 h-5 mr-1" /> Back
      </button>
      
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        {/* Decorative background blurs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-2xl shadow-lg shadow-green-500/30">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">
                Verify Authenticity
              </h2>
              <p className="text-gray-500 text-sm mt-1">Scan QR code or enter batch number</p>
            </div>
          </div>

          {/* QR Scanner */}
          {scannerActive ? (
            <div className="mb-8 p-1 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-xl">
              <div id={scannerContainerId} className="rounded-xl overflow-hidden bg-white max-h-[400px]"></div>
              <button
                onClick={stopScanner}
                className="mt-4 w-full bg-red-500/90 text-white p-3 rounded-xl hover:bg-red-600 transition font-bold shadow-md hover:-translate-y-0.5"
              >
                Stop Scanner
              </button>
            </div>
          ) : (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={startScanner}
                className="group relative h-48 rounded-2xl flex flex-col justify-center items-center cursor-pointer transition-all duration-300 bg-emerald-50/50 border-2 border-dashed border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-100/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="bg-white p-4 rounded-full shadow-md mb-4 group-hover:scale-110 group-hover:shadow-emerald-200 transition-all duration-300">
                    <Camera className="w-8 h-8 text-emerald-500" />
                  </div>
                  <p className="text-emerald-800 font-bold text-lg">Use Camera</p>
                  <p className="text-emerald-600/70 text-sm mt-1 font-medium">Scan directly</p>
                </div>
              </div>
              
              <label className="group relative h-48 rounded-2xl flex flex-col justify-center items-center cursor-pointer transition-all duration-300 bg-blue-50/50 border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="bg-white p-4 rounded-full shadow-md mb-4 group-hover:scale-110 group-hover:shadow-blue-200 transition-all duration-300">
                    <Upload className="w-8 h-8 text-blue-500" />
                  </div>
                  <p className="text-blue-800 font-bold text-lg">Upload QR Image</p>
                  <p className="text-blue-600/70 text-sm mt-1 font-medium px-4">Got a photo? Upload to verify</p>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </div>
              </label>
            </div>
          )}

          <div className="relative flex items-center py-2 mb-6">
             <div className="flex-grow border-t border-gray-200"></div>
             <span className="flex-shrink-0 mx-4 text-gray-400 font-medium text-sm tracking-widest uppercase">Or Enter Manually</span>
             <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <div className="flex group focus-within:ring-2 focus-within:ring-emerald-500 rounded-xl transition-all shadow-sm">
                <input 
                  type="text" 
                  className="w-full p-4 border border-gray-200 border-r-0 rounded-l-xl focus:outline-none uppercase font-mono tracking-wider text-gray-700 bg-white/70 backdrop-blur-sm"
                  placeholder="e.g. IFFCO-NPK-2025-001"
                  value={batchCode}
                  onChange={e => setBatchCode(e.target.value)}
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-emerald-600 text-white px-8 rounded-r-xl hover:bg-emerald-700 transition flex items-center justify-center disabled:opacity-50 font-bold"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" /> Verify
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-6 bg-red-50/80 backdrop-blur-sm p-4 rounded-xl flex items-start border border-red-200 animate-in fade-in slide-in-from-top-2">
              <XCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductScan;
