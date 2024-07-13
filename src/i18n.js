import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    .use(Backend)           // loads translations
    .use(LanguageDetector)  // detects user language
    .use(initReactI18next)  // passes i18n down to react-i18next
    .init({
        fallbackLng: 'en',
        debug: true,
        interpolation: {
            escapeValue: false // react already safes from xss
        },
        backend: {
            // path where resources get loaded from
            loadPath: '/locales/{{lng}}/{{lng}}.json',
        }
    });

export default i18n;
