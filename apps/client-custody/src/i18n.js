import { initReactI18next } from "react-i18next";

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
// import Backend from 'i18next-http-backend';
import Backend from "i18next-chained-backend";
import XHRBackEnd from "i18next-http-backend";
import LocalStorageBackend from "i18next-localstorage-backend";

import appConfig from "./appConfig";

// !Dev note: If region is not set to SA then English will be selected as the default language
const defaultLanguageCode = appConfig.appRegion === "SA" ? "ar-SA" : "en-GB";

const isDevelopmentEnv = ["development"].includes(process.env.NODE_ENV);

const backEnds = isDevelopmentEnv ? [XHRBackEnd] : [LocalStorageBackend, XHRBackEnd];

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: defaultLanguageCode,
    debug: isDevelopmentEnv,
    ns: ["translation"],
    defaultNS: "translation",
    load: "currentOnly",
    detection: {
      order: ["localStorage", "sessionStorage"],
    },
    backend: {
      backends: backEnds,
      backendOptions: [
        {},
        {
          loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
      ],
    },
  });

export default i18n;
