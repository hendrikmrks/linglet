'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@/lib/user-context';

type Language = 'de' | 'en' | 'pt-br';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [language, setLanguageState] = useState<Language>('en');

  // Load guest language from localStorage, browser language, or use user's language
  useEffect(() => {
    if (user?.language) {
      setLanguageState((user.language as Language) || 'en');
    } else if (!user) {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('guestLanguage') : null;
      if (stored && ['de', 'en', 'pt-br'].includes(stored)) {
        setLanguageState(stored as Language);
      } else if (typeof window !== 'undefined') {
        // Detect browser language, fallback to 'en'
        const supported: Language[] = ['de', 'en', 'pt-br'];
        const browserLangs = navigator.languages ?? [navigator.language];
        let detected: Language = 'en';
        for (const bl of browserLangs) {
          const lower = bl.toLowerCase();
          // Exact match (e.g. "pt-br")
          if (supported.includes(lower as Language)) {
            detected = lower as Language;
            break;
          }
          // Match primary subtag (e.g. "pt" -> "pt-br", "de-AT" -> "de")
          const primary = lower.split('-')[0];
          if (primary === 'pt') { detected = 'pt-br'; break; }
          if (supported.includes(primary as Language)) { detected = primary as Language; break; }
        }
        setLanguageState(detected);
      }
    }
  }, [user?.language, user]);

  const setLanguage = async (lang: Language) => {
    if (user) {
      // Logged-in: persist to server
      try {
        const response = await fetch('/api/user/language', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ language: lang }),
        });

        if (response.ok) {
          setLanguageState(lang);
        }
      } catch (error) {
        console.error('Failed to update language:', error);
      }
    } else {
      // Guest: persist to localStorage
      localStorage.setItem('guestLanguage', lang);
      setLanguageState(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
