import de from '@/i18n/locales/de.json';
import en from '@/i18n/locales/en.json';
import ptbr from '@/i18n/locales/pt-br.json';

type Language = 'de' | 'en' | 'pt-br';

type TranslationParams = Record<string, string | number>;

const translations = {
  de,
  en,
  'pt-br': ptbr,
};

function interpolate(value: string, params?: TranslationParams) {
  if (!params) {
    return value;
  }

  return value.replace(/\{\{(\w+)\}\}/g, (match, token: string) => {
    if (!(token in params)) {
      return match;
    }

    return String(params[token]);
  });
}

export function useTranslation(language: Language | string | undefined = 'en') {
  const normalizedLang = ((language as Language) || 'en') as Language;
  const t = (key: string, params?: TranslationParams) => {
    const keys = key.split('.');
    let value: any = translations[normalizedLang];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? interpolate(value, params) : key;
  };

  return { t, language };
}

export const LANGUAGES: { code: Language }[] = [
  { code: 'de' },
  { code: 'en' },
  { code: 'pt-br' },
];
