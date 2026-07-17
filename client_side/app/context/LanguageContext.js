'use client';

import { useState, createContext, useEffect } from 'react';
import { translations } from '../locales';

export const LanguageContext = createContext();

const LANGUAGE_KEY = 'language';
const DEFAULT_LANGUAGE = 'en';

const getFromPath = (obj, path) => path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_KEY);
      if (stored === 'en' || stored === 'fr') {
        setLanguageState(stored);
      }
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang) => {
    if (lang !== 'en' && lang !== 'fr') return;
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  };

  const interpolate = (str, vars) =>
    vars ? str.replace(/\{(\w+)\}/g, (match, name) => (vars[name] !== undefined ? vars[name] : match)) : str;

  const t = (key, vars) => {
    const value = getFromPath(translations[language], key);
    if (value !== undefined) return typeof value === 'string' ? interpolate(value, vars) : value;

    // Fall back to English so a missing key never renders blank
    const fallback = getFromPath(translations[DEFAULT_LANGUAGE], key);
    if (fallback !== undefined) return typeof fallback === 'string' ? interpolate(fallback, vars) : fallback;
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, loaded }}>
      {children}
    </LanguageContext.Provider>
  );
};
