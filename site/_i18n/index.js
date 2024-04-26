import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const lang = 'zh-cn';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: lang,
    fallbackLng: 'en',
    ns: ['seafile-editor'],
    defaultNS: 'seafile-editor',

    debug: false, // console log if debug: true

    whitelist: ['en', 'zh-CN', 'fr', 'de', 'cs', 'es', 'es-AR', 'es-MX', 'ru'],

    backend: {
      loadPath: '/public/locales/{{ lng }}/{{ ns }}.json',
    },

    interpolation: {
      escapeValue: false, // not needed for react!!
    },

    react: {
      wait: true
    }
  });

export default i18n;
