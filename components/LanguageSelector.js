import { useState, useEffect } from 'react';
import { languages, getDefaultLanguage, setLanguage } from '../lib/i18n';

export default function LanguageSelector({ currentLanguage, onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    onLanguageChange(langCode);
    setIsOpen(false);
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex items-center justify-center w-full rounded-xl bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded="true"
          aria-haspopup="true"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          {languages[currentLanguage]}
          <svg
            className={`-mr-1 ml-2 h-5 w-5 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white/95 backdrop-blur-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-40 max-h-64 overflow-y-auto">
            <div className="py-1">
              {Object.entries(languages).map(([code, name]) => (
                <button
                  key={code}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 flex items-center ${
                    currentLanguage === code
                      ? 'bg-indigo-100 text-indigo-900 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handleLanguageChange(code)}
                >
                  {currentLanguage === code && (
                    <svg className="w-4 h-4 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 