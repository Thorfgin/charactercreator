import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import translations_nl from '../public/locales/nl/nl.json';
import translations_en from '../public/locales/en/en.json';

// the translations
const resources = {
    nl: { translation: translations_nl },
    en: { translation: translations_en }
};


i18n
    .use(Backend)           // loads translations
    .use(LanguageDetector)  // detects user language
    .use(initReactI18next)  // passes i18n down to react-i18next
    .init({
        resources,
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false // react already safes from xss
        },
        backend: {
            // path where resources get loaded from
            loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
        saveMissing: true,
        missingKeyHandler: function (lng, ns, key, fallbackValue) {
            console.error(`Missing translation key: ${key} for language: ${lng} with fallbackValue: ${fallbackValue}`);
        }
    });

// expose the translation directly for non-component functions
export const T = (key) => i18n.t(key);

// Function to get the current selected language
export const getCurrentLanguage = () => { return i18n.language; }

export default i18n;

