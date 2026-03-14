import React, { useState } from 'react';
import { Camera, Upload, X, Loader2, Leaf, Activity, ChevronRight, CheckCircle2, AlertTriangle, Bug } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CropAnalysis() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileLocal = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type.startsWith('image/')) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null); // Reset prev results
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview('');
    setResult(null);
  };

  const handleAnalyzeMock = () => {
    if (!file) return;
    
    setAnalyzing(true);
    // Simulate real AI network delay
    setTimeout(() => {
      // Create random output tailored to look realistic
      const outcomes = [
        {
          health: 'Healthy',
          score: 96,
          message: 'No visible signs of disease. The crop appears vigorous with good chlorophyll content.',
          action: 'Continue current nutrition plan. Maintain soil moisture.',
          type: 'success'
        },
        {
          health: 'Early Blight',
          score: 82,
          message: 'Detected brown spots with concentric rings typical of Alternaria solani.',
          action: 'Apply copper-based fungicide. Improve air circulation around leaves.',
          type: 'warning'
        },
        {
          health: 'Nitrogen Deficiency',
          score: 88,
          message: 'Lower leaves show yellowing (chlorosis) while upper leaves remain green.',
          action: 'Apply urea or nitrogen-rich fertilizer (NPK 20-20-20) within 3-5 days.',
          type: 'warning'
        },
        {
          health: 'Pest Infestation (Aphids)',
          score: 91,
          message: 'Clustered insects detected on leaf undersides causing leaf curling.',
          action: 'Spray Neem oil extract (10000 ppm) or Imidacloprid if severity is high.',
          type: 'danger'
        }
      ];
      setResult(outcomes[Math.floor(Math.random() * outcomes.length)]);
      setAnalyzing(false);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-500 pb-10">
      <button onClick={() => navigate(-1)} className="inline-flex items-center text-emerald-600 hover:text-emerald-800 font-bold transition-colors mb-2 cursor-pointer">
        <ChevronRight className="w-5 h-5 mr-1 rotate-180" /> Back
      </button>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        
        {/* Left Side: Upload & Camera */}
        <div className="w-full md:w-1/2 glass-card p-6 md:p-8 flex flex-col h-full min-h-[500px] relative overflow-hidden">
          {/* Decor */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none"></div>

          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-2xl shadow-lg shadow-blue-500/30">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Crop Health AI</h2>
              <p className="text-gray-500 text-sm">Upload leaves or whole plants</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col relative z-10">
            {!preview ? (
              <div className="flex-1 flex flex-col justify-center">
                <label className="group relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-200 rounded-2xl bg-blue-50/50 hover:bg-blue-50 hover:border-blue-400 cursor-pointer transition-all duration-300 h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="bg-white p-4 rounded-full shadow-md mb-4 group-hover:-translate-y-2 transition-transform duration-300">
                    <Upload className="w-8 h-8 text-blue-500" />
                  </div>
                  <span className="font-bold text-blue-800 text-lg">Select Image</span>
                  <span className="text-blue-600/70 text-sm mt-1 font-medium text-center">Take a photo or choose from gallery<br/>(JPEG, PNG up to 5MB)</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileLocal}
                    className="hidden" 
                  />
                </label>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-white mb-4 group h-64 bg-black/5">
                  <img src={preview} alt="Crop Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={handleClear}
                      className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-red-500/80 transition-colors shadow-lg"
                      title="Remove image"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  {/* Scanning scanline animation */}
                  {analyzing && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="w-full h-1 bg-blue-500 shadow-[0_0_15px_3px_rgba(59,130,246,0.6)] animate-[scan_2s_ease-in-out_infinite]" />
                    </div>
                  )}
                </div>

                <div className="bg-white/60 p-3 rounded-xl border border-gray-100 flex items-center justify-between mb-4">
                  <div className="truncate pr-4 flex items-center text-sm font-medium text-gray-700">
                    <ImageIcon className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap bg-white px-2 py-1 rounded-md shadow-sm">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>

                {!result && (
                  <button 
                    onClick={handleAnalyzeMock}
                    disabled={analyzing}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center text-lg disabled:opacity-70 disabled:transform-none"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Analyzing via Neural Net...
                      </>
                    ) : (
                      <>
                        <Activity className="w-5 h-5 mr-2" /> Start AI Analysis
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Results */}
        <div className="w-full md:w-1/2 flex flex-col h-full min-h-[500px]">
          {result ? (
            <div className="glass-card p-6 md:p-8 h-full flex flex-col animate-in fade-in slide-in-from-right-8 duration-500 border-t-4 border-t-indigo-500 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/connected.png')] opacity-5 pointer-events-none"></div>
               
               <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center border-b pb-4 border-gray-100">
                 <Leaf className="w-5 h-5 mr-2 text-indigo-600" /> Diagnostic Results
               </h3>

               <div className="flex-1 space-y-6">
                 {/* Status Hero */}
                 <div className={`p-6 rounded-2xl flex items-center border-2 shadow-sm ${
                   result.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                   result.type === 'danger' ? 'bg-rose-50 border-rose-200 text-rose-800' :
                   'bg-amber-50 border-amber-200 text-amber-800'
                 }`}>
                   <div className={`p-4 rounded-xl mr-5 text-white shadow-md ${
                     result.type === 'success' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' :
                     result.type === 'danger' ? 'bg-gradient-to-br from-rose-400 to-rose-600' :
                     'bg-gradient-to-br from-amber-400 to-orange-500'
                   }`}>
                     {result.type === 'success' ? <CheckCircle2 className="w-8 h-8" /> : 
                      result.type === 'danger' ? <Bug className="w-8 h-8 flex-shrink-0" /> : 
                      <AlertTriangle className="w-8 h-8 flex-shrink-0" />}
                   </div>
                   <div>
                     <p className="text-sm font-bold uppercase tracking-widest opacity-70 mb-1">Diagnosis</p>
                     <h4 className="text-2xl font-extrabold">{result.health}</h4>
                   </div>
                 </div>

                 {/* Confidence Meter */}
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">AI Confidence</span>
                       <span className="text-2xl font-black text-indigo-600">{result.score}%</span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner flex">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${result.score}%` }}
                      ></div>
                    </div>
                 </div>

                 {/* Details */}
                 <div className="space-y-4">
                   <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                     <h5 className="font-bold text-gray-800 mb-1 flex items-center">
                       <Activity className="w-4 h-4 mr-2 text-gray-400" /> Observation
                     </h5>
                     <p className="text-gray-600 text-sm leading-relaxed">{result.message}</p>
                   </div>
                   
                   <div className={`p-4 rounded-xl border ${result.type === 'success' ? 'bg-emerald-50/50 border-emerald-100' : 'bg-blue-50/50 border-blue-100'}`}>
                     <h5 className={`font-bold mb-1 flex items-center ${result.type === 'success' ? 'text-emerald-800' : 'text-blue-800'}`}>
                       <ChevronRight className="w-4 h-4 mr-1" /> Recommended Action
                     </h5>
                     <p className={`text-sm leading-relaxed font-medium ${result.type === 'success' ? 'text-emerald-700' : 'text-blue-700'}`}>
                       {result.action}
                     </p>
                   </div>
                 </div>
               </div>

               <button 
                 onClick={handleClear}
                 className="mt-6 w-full btn-secondary py-3 flex items-center justify-center font-bold relative z-10"
               >
                 <Upload className="w-5 h-5 mr-2" /> Analyze Another Plant
               </button>
            </div>
          ) : (
            <div className="glass-card h-full flex flex-col items-center justify-center p-8 text-center border-dashed border-2 border-gray-200 bg-white/30 mb-auto min-h-[500px]">
              <div className="bg-indigo-50 p-6 rounded-full mb-6">
                <Activity className="w-16 h-16 text-indigo-200" />
              </div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">Awaiting Image</h3>
              <p className="text-gray-400 max-w-xs text-sm">
                Upload a clear picture of a plant leaf to get an instant AI-powered health analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add keyframes for scanner line using a style tag
export default function Wrapper() {
  return (
    <>
      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          50% { transform: translateY(256px); } /* Assuming ~256px container height */
        }
      `}</style>
      <CropAnalysis />
    </>
  );
}
