import de from '@/i18n/locales/de.json';
import en from '@/i18n/locales/en.json';
import ptbr from '@/i18n/locales/pt-br.json';

type Language = 'de' | 'en' | 'pt-br';

const translations = {
  de,
  en,
  'pt-br': ptbr,
};

export function useTranslation(language: Language | string | undefined = 'en') {
  const normalizedLang = ((language as Language) || 'en') as Language;
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[normalizedLang];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, language };
}

export const LANGUAGES: { code: Language; name: string }[] = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
  { code: 'pt-br', name: 'Português (Brasil)' },
];
