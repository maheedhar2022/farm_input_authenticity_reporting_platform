import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Leaf, Activity, Droplets, ThermometerSun, AlertCircle, FileText, Upload, Calendar, Send, ChevronRight, Scale, X, Camera } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function FakeProductReporting() {
  const { API_URL } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    batchCode: '',
    description: '',
    location: '',
    priority: 'Medium'
  });
  
  const [receiptImg, setReceiptImg] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState('');
  
  const [productImg, setProductImg] = useState(null);
  const [productPreview, setProductPreview] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, setter, previewSetter) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setter(file);
      previewSetter(URL.createObjectURL(file));
    }
  };

  const clearFile = (setter, previewSetter) => {
    setter(null);
    previewSetter('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (receiptImg) data.append('receiptImage', receiptImg);
      if (productImg) data.append('productImage', productImg);

      await axios.post(`${API_URL}/api/reports`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Report submitted successfully! The agricultural department will investigate this case.');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-500 pb-10">
      <button onClick={() => navigate(-1)} className="inline-flex items-center text-rose-600 hover:text-rose-800 font-bold transition-colors mb-2 cursor-pointer">
        <ChevronRight className="w-5 h-5 mr-1 rotate-180" /> Back
      </button>

      <div className="glass-card p-6 md:p-10 relative overflow-hidden border-t-4 border-t-rose-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row gap-5 items-start md:items-center mb-8 border-b border-gray-100 pb-6">
            <div className="bg-gradient-to-br from-rose-500 to-red-600 p-4 rounded-2xl shadow-lg shadow-rose-500/30 flex-shrink-0">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                Report Counterfeit Input
              </h2>
              <p className="text-gray-500 mt-1 max-w-2xl leading-relaxed">
                Found a fake fertilizer or seed packet? Report it immediately to the Department of Agriculture. 
                Your identity is protected and you help save other farmers.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 p-4 rounded-xl mb-8 flex items-start text-sm">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Text Data */}
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4">
                  <FileText className="w-5 h-5 mr-2 text-rose-500" /> Event Details
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-gray-700 font-semibold text-sm mb-2">Product Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="productName"
                      required
                      className="input-styled bg-white/50 border-rose-100 focus:ring-rose-500 focus:border-rose-500"
                      placeholder="e.g. NPK 20-20-20"
                      value={formData.productName}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-semibold text-sm mb-2">Brand</label>
                    <input 
                      type="text" 
                      name="brand"
                      className="input-styled bg-white/50 border-rose-100 focus:ring-rose-500 focus:border-rose-500"
                      placeholder="e.g. IFFCO"
                      value={formData.brand}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold text-sm mb-2">Batch Code</label>
                    <input 
                      type="text" 
                      name="batchCode"
                      className="input-styled bg-white/50 border-rose-100 focus:ring-rose-500 focus:border-rose-500 uppercase font-mono text-sm"
                      placeholder="If visible"
                      value={formData.batchCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2">Location of Purchase / Spotting <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="location"
                    required
                    className="input-styled bg-white/50 border-rose-100 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="Shop Name, Village, District"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2">Description of Issue <span className="text-red-500">*</span></label>
                  <textarea 
                    name="description"
                    required
                    rows="4"
                    className="input-styled bg-white/50 border-rose-100 focus:ring-rose-500 focus:border-rose-500 resize-none"
                    placeholder="Why do you think it's fake? (e.g., spelling mistakes on packaging, wrong color/smell of product, no QR code)"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold text-sm mb-2">Severity Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Low', 'Medium', 'Critical'].map((level) => (
                      <label 
                        key={level} 
                        className={`cursor-pointer border rounded-xl p-3 text-center transition tracking-wide text-sm font-bold ${
                          formData.priority === level 
                            ? (level === 'Critical' ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-200' 
                               : level === 'Medium' ? 'border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-200'
                               : 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200')
                            : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="priority" 
                          value={level} 
                          className="hidden" 
                          checked={formData.priority === level}
                          onChange={handleInputChange}
                        />
                        {level}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Evidence Images */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center mb-4">
                  <Camera className="w-5 h-5 mr-2 text-rose-500" /> Upload Evidence
                </h3>

                {/* Product Image */}
                <div className="bg-rose-50/30 p-4 rounded-2xl border border-rose-100">
                   <p className="block text-gray-700 font-semibold text-sm flex items-center mb-1">
                     Product Package
                     <span className="ml-2 text-xs font-normal text-gray-500">(Front/Back)</span>
                   </p>
                   
                   {!productPreview ? (
                     <label className="group flex flex-col items-center justify-center h-32 border-2 border-dashed border-rose-300 rounded-xl bg-white hover:bg-rose-50 cursor-pointer transition">
                       <Upload className="w-6 h-6 text-rose-400 group-hover:text-rose-600 mb-2" />
                       <span className="text-sm font-medium text-rose-600">Add Photo</span>
                       <input 
                         type="file" 
                         accept="image/*" 
                         onChange={(e) => handleFileChange(e, setProductImg, setProductPreview)}
                         className="hidden" 
                       />
                     </label>
                   ) : (
                     <div className="relative h-32 rounded-xl overflow-hidden border border-gray-200 group">
                       <img src={productPreview} alt="Product" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button 
                           type="button"
                           onClick={() => clearFile(setProductImg, setProductPreview)}
                           className="bg-white/20 backdrop-blur p-2 rounded-full hover:bg-red-500 text-white transition"
                         >
                           <X className="w-5 h-5" />
                         </button>
                       </div>
                     </div>
                   )}
                </div>

                {/* Receipt Image */}
                <div className="bg-rose-50/30 p-4 rounded-2xl border border-rose-100">
                   <p className="block text-gray-700 font-semibold text-sm flex items-center mb-1">
                     Purchase Receipt
                     <span className="ml-2 text-xs font-normal text-gray-500">(Optional)</span>
                   </p>
                   
                   {!receiptPreview ? (
                     <label className="group flex flex-col items-center justify-center h-32 border-2 border-dashed border-rose-300 rounded-xl bg-white hover:bg-rose-50 cursor-pointer transition">
                       <Upload className="w-6 h-6 text-rose-400 group-hover:text-rose-600 mb-2" />
                       <span className="text-sm font-medium text-rose-600">Add Photo</span>
                       <input 
                         type="file" 
                         accept="image/*" 
                         onChange={(e) => handleFileChange(e, setReceiptImg, setReceiptPreview)}
                         className="hidden" 
                       />
                     </label>
                   ) : (
                     <div className="relative h-32 rounded-xl overflow-hidden border border-gray-200 group">
                       <img src={receiptPreview} alt="Receipt" className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button 
                           type="button"
                           onClick={() => clearFile(setReceiptImg, setReceiptPreview)}
                           className="bg-white/20 backdrop-blur p-2 rounded-full hover:bg-red-500 text-white transition"
                         >
                           <X className="w-5 h-5" />
                         </button>
                       </div>
                     </div>
                   )}
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-start mt-4">
                  <Scale className="w-5 h-5 text-amber-600 flex-shrink-0 mr-3 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">
                    By submitting this report, you confirm the information is true to the best of your knowledge. False reporting is heavily penalized by authorities.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto bg-gradient-to-r from-rose-600 to-red-600 text-white px-8 py-3.5 rounded-xl hover:from-rose-700 hover:to-red-700 transition-all font-bold shadow-lg shadow-rose-500/30 flex items-center justify-center disabled:opacity-70 transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" /> Formally Submit Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FakeProductReporting;
