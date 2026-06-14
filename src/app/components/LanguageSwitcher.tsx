import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage, LANGUAGES, AppLanguage } from '../context/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark';
}

export function LanguageSwitcher({ variant = 'light' }: LanguageSwitcherProps) {
  const { language, setLanguage, t, currentLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isDark = variant === 'dark';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          isDark
            ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm'
        }`}
        title={t('language')}
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs font-bold tracking-wide">{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.nativeName}</span>
        <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('cardLanguage')}</p>
          </div>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code as AppLanguage); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                language === lang.code
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-xs font-bold w-6 text-center bg-gray-100 rounded px-1">{lang.flag}</span>
              <span>{lang.nativeName}</span>
              {lang.apiCode !== lang.code && (
                <span className="ml-auto text-xs text-gray-400">EN cards</span>
              )}
              {language === lang.code && (
                <svg className="ml-auto w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
