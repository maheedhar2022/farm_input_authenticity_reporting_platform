import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { MessageSquare, Send, X, Bot, Loader2, Sparkles, Mic, Volume2, VolumeX, MicOff, Rocket, Zap, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import ParticleCanvas from './ParticleCanvas';

const KrishiBot = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [antigravity, setAntigravity] = useState(true);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'bot', text: t('chatbot.initialGreeting') }
  ]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const { API_URL } = useAuth();
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const canvasRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Particle burst helper
  const triggerBurst = useCallback((count = 20) => {
    canvasRef.current?.burst(null, null, count);
  }, []);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      const langMap = { 'en': 'en-US', 'hi': 'hi-IN', 'te': 'te-IN' };
      recognition.lang = langMap[i18n.language.split('-')[0]] || 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      
      recognitionRef.current = recognition;
    }
  }, [i18n.language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        alert(t('chatbot.unsupported'));
        return;
      }
      recognitionRef.current.start();
    }
  };

  const speak = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const langMap = { 'en': 'en-GB', 'hi': 'hi-IN', 'te': 'te-IN' };
    utterance.lang = langMap[i18n.language.split('-')[0]] || 'en-GB';
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = { role: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);
    triggerBurst(15);

    try {
      const langNames = { 'en': 'English', 'hi': 'Hindi', 'te': 'Telugu' };
      const currentLang = langNames[i18n.language.split('-')[0]] || 'English';

      const res = await axios.post(`${API_URL}/api/ai/krishibot`, { 
        messages: [...chatHistory, userMessage], 
        language: currentLang 
      });
      
      const botMessage = { role: 'bot', text: res.data.data.reply };
      setChatHistory(prev => [...prev, botMessage]);
      triggerBurst(25);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = err.response?.data?.message || t('chatbot.error');
      setChatHistory(prev => [...prev, { role: 'bot', text: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([{ role: 'bot', text: t('chatbot.initialGreeting') }]);
    canvasRef.current?.clear();
    triggerBurst(40);
  };

  return (
    <>
      <ParticleCanvas ref={canvasRef} antigravity={antigravity} />
      
      <div className="fixed bottom-6 right-6 z-[100]">
        {/* Chat Toggle Button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-br from-indigo-600 via-emerald-500 to-green-600 text-white p-4 rounded-2xl shadow-xl hover:shadow-indigo-500/40 transition-all hover:scale-110 active:scale-95 group relative border border-white/20"
          >
            <div className="absolute -top-2 -right-2 bg-rose-500 w-4 h-4 rounded-full border-2 border-white animate-pulse"></div>
            <Rocket className="w-6 h-6 animate-bounce-soft" />
          </button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <div className="glass-panel w-80 sm:w-96 h-[550px] flex flex-col shadow-2xl border border-white/40 animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden relative">
            {/* Cosmic Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-900 via-emerald-800 to-green-900 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
              
              <div className="flex items-center gap-2 relative z-10">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/10">
                  <Bot className="w-5 h-5 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                    {t('chatbot.header')} 
                    <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className={`text-[10px] font-bold uppercase transition-colors ${antigravity ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {antigravity ? 'Anti-G Active' : 'Gravity On'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 relative z-10">
                <button 
                  onClick={() => setAntigravity(!antigravity)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-all title='Toggle Gravity'"
                >
                  <Sparkles className={`w-4 h-4 ${antigravity ? 'text-emerald-400 animate-spin-slow' : 'text-gray-400'}`} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/5 scrollbar-thin scrollbar-thumb-emerald-500/50">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm relative group/msg backdrop-blur-sm ${
                      msg.role === 'user'
                        ? 'bg-indigo-600/90 text-white rounded-tr-none border border-white/10'
                        : 'bg-white/80 text-gray-800 border border-emerald-100 rounded-tl-none shadow-emerald-900/5'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    
                    {msg.role === 'bot' && (
                      <button 
                        onClick={() => speak(msg.text)}
                        className="absolute -right-8 top-0 p-1.5 text-gray-400 hover:text-emerald-600 opacity-0 group-hover/msg:opacity-100 transition-opacity"
                      >
                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/60 border border-emerald-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Action Bar */}
            <div className="px-4 py-2 bg-white/40 border-t border-white/20 flex gap-2 overflow-x-auto scrollbar-none no-scrollbar">
              <button onClick={clearChat} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-emerald-100 text-[11px] font-bold text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-all">
                <Trash2 className="w-3 h-3" /> Reset
              </button>
              <button 
                onClick={() => { triggerBurst(50); }} 
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-emerald-100 text-[11px] font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
              >
                <Zap className="w-3 h-3" /> Burst
              </button>
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white/80 border-t border-white/20 backdrop-blur-md">
              <div className="relative flex items-center gap-2">
                <button 
                  type="button"
                  onClick={toggleListening}
                  className={`p-2.5 rounded-xl transition-all ${isListening ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                >
                  {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>
                
                <input
                  type="text"
                  placeholder={t('chatbot.inputPlaceholder')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-gray-50/50 border border-emerald-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all pr-12 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!message.trim() || loading}
                  className="absolute right-1 p-2 text-indigo-600 hover:text-indigo-700 disabled:opacity-30 disabled:pointer-events-none transition-all hover:scale-110 active:scale-90"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[9px] text-gray-400 text-center mt-3 flex items-center justify-center gap-1 lowercase tracking-widest font-black opacity-60">
                <Sparkles className="w-2 h-2" /> KrishiBot v4.2 Antigravity Edition
              </p>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default KrishiBot;
