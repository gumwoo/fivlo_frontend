import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import ko from './locales/ko.json';

const LANGUAGE_PERSISTENCE_KEY = 'app_language_code';

export const supportedLanguages = {
  en: { label: 'English' },
  ko: { label: '한국어' },
};

export async function detectLanguage() {
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_PERSISTENCE_KEY);
    if (stored) return stored;
  } catch (e) {}
  const deviceLocale = Array.isArray(Localization.locales) && Localization.locales.length > 0
    ? Localization.locales[0]?.languageCode
    : Localization.locale?.split('-')[0];
  if (deviceLocale && supportedLanguages[deviceLocale]) {
    return deviceLocale;
  }
  return 'ko';
}

export async function changeLanguage(languageCode) {
  await i18n.changeLanguage(languageCode);
  try {
    await AsyncStorage.setItem(LANGUAGE_PERSISTENCE_KEY, languageCode);
  } catch (e) {}
}

export async function initI18n() {
  const lng = await detectLanguage();
  await i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v3',
      lng,
      fallbackLng: 'en',
      resources: {
        en: { translation: en },
        ko: { translation: ko },
      },
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
  return i18n;
}

export default i18n;


