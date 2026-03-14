import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="relative group z-50">
      <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/30 text-emerald-800 transition-all shadow-sm">
        <Globe className="w-4 h-4" />
        <span className="text-sm font-bold uppercase">{i18n.language.split('-')[0]}</span>
      </button>

      {/* Dropdown menu */}
      <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
        <div className="py-2">
          <button
            onClick={() => changeLanguage('en')}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 transition-colors ${i18n.language.startsWith('en') ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-gray-700'}`}
          >
            English
          </button>
          <button
            onClick={() => changeLanguage('hi')}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 transition-colors flex flex-col ${i18n.language.startsWith('hi') ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-gray-700'}`}
          >
            <span>Hindi</span>
            <span className="text-xs text-gray-400 font-normal">हिन्दी</span>
          </button>
          <button
            onClick={() => changeLanguage('te')}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 transition-colors flex flex-col ${i18n.language.startsWith('te') ? 'text-emerald-600 font-bold bg-emerald-50/50' : 'text-gray-700'}`}
          >
            <span>Telugu</span>
            <span className="text-xs text-gray-400 font-normal">తెలుగు</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
