import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "@/locales/en/en.json";
import pl from "@/locales/pl/pl.json";

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "pl"],
    fallbackLng: "en",
    resources: {
      en: {
        translation: en,
      },
      pl: {
        translation: pl,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });
