import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Activity, Droplets, ThermometerSun, Leaf, Map, History, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function SoilHealthDashboard() {
  const { API_URL, user } = useAuth();
  const navigate = useNavigate();
  const [cropHistory, setCropHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/crops/my-history`);
        setCropHistory(res.data.data.crops || []);
      } catch (err) {
        console.error('Failed to fetch crop history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [API_URL]);

  const soilType = user?.soilType || 'Black';
  
  // Generating dynamic metrics based on soil type
  const getSoilMetrics = () => {
    switch (soilType) {
      case 'Black':
        return { ph: '7.2 - 8.5', moisture: 'High', organicMatter: 'Medium', nitrogen: 'Low' };
      case 'Red':
        return { ph: '5.5 - 6.8', moisture: 'Low', organicMatter: 'Low', nitrogen: 'Medium' };
      case 'Alluvial':
        return { ph: '6.5 - 7.5', moisture: 'Medium', organicMatter: 'High', nitrogen: 'High' };
      case 'Loamy':
        return { ph: '6.0 - 7.0', moisture: 'Medium', organicMatter: 'High', nitrogen: 'High' };
      case 'Sandy':
        return { ph: '5.0 - 6.5', moisture: 'Very Low', organicMatter: 'Low', nitrogen: 'Low' };
      case 'Laterite':
        return { ph: '4.5 - 6.0', moisture: 'Medium', organicMatter: 'Low', nitrogen: 'Medium' };
      default:
        return { ph: '6.5 - 7.5', moisture: 'Medium', organicMatter: 'Medium', nitrogen: 'Medium' };
    }
  };

  const getAIRecommendations = () => {
    switch (soilType) {
        case 'Black':
            return [
                "Deep plowing recommended before monsoon to manage moisture.",
                "Suitable for Cotton, Soybean, and Pigeon Pea due to high moisture retention.",
                "Apply Zinc and Sulphur as they are typically deficient in black soils."
            ];
        case 'Red':
            return [
                "Needs frequent irrigation and organic matter additions.",
                "Suitable for Groundnut, Millets, and Castor.",
                "Add lime to neutralize acidity if pH drops below 6.0."
            ];
        default:
            return [
                "Maintain regular soil testing every 2-3 years.",
                "Implement crop rotation to maintain soil fertility."
            ];
    }
  };

  const metrics = getSoilMetrics();
  const recs = getAIRecommendations();

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500 pb-10">
      <button onClick={() => navigate(-1)} className="inline-flex items-center text-amber-600 hover:text-amber-800 font-bold transition-colors mb-2 cursor-pointer">
        <ChevronRight className="w-5 h-5 mr-1 rotate-180" /> Back
      </button>
      
      {/* Header */}
      <div className="glass-card p-6 md:p-8 flex items-center gap-5 border-t-4 border-t-amber-500 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
        
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-2xl shadow-lg shadow-amber-500/30 relative z-10">
          <Activity className="w-8 h-8 text-white" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Soil Health Dashboard</h2>
          <p className="text-gray-500 mt-1 flex items-center font-medium">
             <Map className="w-4 h-4 mr-1 text-amber-500" /> Profiling parameters for your <span className="font-bold text-gray-700 mx-1">{soilType}</span> soil
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: Metrics & AI */}
        <div className="col-span-1 space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
              <ThermometerSun className="w-8 h-8 text-amber-500 mb-2 opacity-80" />
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">pH Level</p>
              <p className="text-xl font-black text-gray-800">{metrics.ph}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
              <Droplets className="w-8 h-8 text-blue-500 mb-2 opacity-80" />
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Moisture</p>
              <p className={`text-xl font-black ${metrics.moisture === 'High' ? 'text-blue-600' : 'text-gray-800'}`}>{metrics.moisture}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
              <Leaf className="w-8 h-8 text-emerald-500 mb-2 opacity-80" />
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Organics</p>
              <p className="text-xl font-black text-emerald-700">{metrics.organicMatter}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
              <Activity className="w-8 h-8 text-indigo-500 mb-2 opacity-80" />
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Nitrogen</p>
              <p className="text-xl font-black text-indigo-700">{metrics.nitrogen}</p>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="glass-card p-6 bg-gradient-to-br from-amber-50 to-orange-50/50 border-amber-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Sparkles className="w-8 h-8 text-amber-300 animate-pulse-soft" />
            </div>
            <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
               <Sparkles className="w-5 h-5 mr-2 text-amber-600" /> AI Insights
            </h3>
            <ul className="space-y-4 relative z-10">
              {recs.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <div className="mt-1 bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-amber-900 text-sm leading-relaxed font-medium">{rec}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Crop History */}
        <div className="col-span-1 md:col-span-2">
          <div className="glass-card p-6 md:p-8 h-full">
            <h3 className="text-2xl font-bold text-gray-800 mb-1 flex items-center">
              <History className="w-6 h-6 mr-3 text-slate-500" /> Historical Crop Data
            </h3>
            <p className="text-gray-500 text-sm mb-6 pb-4 border-b">Logged seasons and yield tracking over time</p>

            {loading ? (
              <div className="h-64 flex justify-center items-center">
                <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
              </div>
            ) : cropHistory.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-40 text-center text-gray-400">
                  <TrendingUp className="w-12 h-12 mb-3 opacity-30" />
                  <p>No historical data recorded yet.</p>
               </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-100 uppercase tracking-wider text-xs font-black text-slate-400">
                      <th className="pb-3 px-2">Crop Type</th>
                      <th className="pb-3 px-2 text-center">Year/Season</th>
                      <th className="pb-3 px-2 text-center">Duration</th>
                      <th className="pb-3 px-2 text-center">Status</th>
                      <th className="pb-3 px-2 text-right">Yield (q)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cropHistory.map((crop) => (
                      <tr key={crop._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-4 px-2 font-bold text-slate-800 flex items-center group-hover:text-amber-700 transition-colors">
                          <Leaf className="w-4 h-4 mr-2 text-emerald-500" />
                          {crop.cropType}
                        </td>
                        <td className="py-4 px-2 text-slate-600 text-center">
                          <span className="font-bold">{crop.year}</span> <span className="text-sm opacity-70 border-l border-slate-300 ml-1 pl-1">{crop.season}</span>
                        </td>
                        <td className="py-4 px-2 text-slate-600 text-center font-medium">
                          {crop.cultivationDuration}
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className={`px-3 py-1 bg-slate-100 text-xs font-bold uppercase tracking-wider rounded-lg border shadow-sm ${
                            crop.status === 'Harvested' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {crop.status}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right font-black text-lg text-slate-700">
                          {crop.yieldAmount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SoilHealthDashboard;
