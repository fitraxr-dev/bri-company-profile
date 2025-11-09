import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import translationEN from "./locales/en/translation.json";
import translationID from "./locales/id/translation.json";

// Translation resources
const resources = {
  en: {
    translation: translationEN,
  },
  id: {
    translation: translationID,
  },
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: "id", // Default language
    debug: false, // Set to true for debugging

    // Language detection options
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "i18nextLng",
    },

    interpolation: {
      escapeValue: false, // React already protects from XSS
    },

    react: {
      useSuspense: false, // Disable suspense for better compatibility
    },
  });

export default i18n;
