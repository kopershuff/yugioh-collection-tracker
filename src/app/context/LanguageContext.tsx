import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppLanguage, UI_TRANSLATIONS } from './translations';

export type { AppLanguage };

export interface LanguageOption {
  code: AppLanguage;
  label: string;
  flag: string;
  apiCode: string;
  nativeName: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'fr', label: 'Français', flag: 'FR', apiCode: 'fr', nativeName: 'Français' },
  { code: 'en', label: 'English', flag: 'EN', apiCode: 'en', nativeName: 'English' },
  { code: 'de', label: 'Deutsch', flag: 'DE', apiCode: 'de', nativeName: 'Deutsch' },
  { code: 'it', label: 'Italiano', flag: 'IT', apiCode: 'it', nativeName: 'Italiano' },
  { code: 'pt', label: 'Português', flag: 'PT', apiCode: 'pt', nativeName: 'Português' },
  { code: 'es', label: 'Español', flag: 'ES', apiCode: 'en', nativeName: 'Español' },
  { code: 'ja', label: 'Japanese', flag: 'JP', apiCode: 'en', nativeName: '日本語' },
];

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string) => string;
  currentLang: LanguageOption;
  apiCode: string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('yugioh-language');
    return (saved as AppLanguage) || 'fr';
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('yugioh-language', lang);
  };

  const t = (key: string): string => {
    return UI_TRANSLATIONS[language]?.[key] ?? UI_TRANSLATIONS['fr'][key] ?? key;
  };

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];
  const apiCode = currentLang.apiCode;

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLang, apiCode }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
