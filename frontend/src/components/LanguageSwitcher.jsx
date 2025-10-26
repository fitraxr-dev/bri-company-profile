import React from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

/**
 * LanguageSwitcher Component
 * Allows users to switch between Indonesian and English
 * Stores preference in localStorage for persistence
 */
export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: "id", name: "ID", fullName: t("language.id") },
    { code: "en", name: "EN", fullName: t("language.en") },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Globe Icon */}
      <Globe className="w-5 h-5 text-white/80" aria-hidden="true" />

      {/* Language Buttons */}
      <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`
              px-3 py-1.5 rounded-md font-semibold text-sm transition-all duration-200
              ${
                i18n.language === lang.code
                  ? "bg-white text-bri-primary shadow-md"
                  : "text-white/90 hover:bg-white/20"
              }
            `}
            aria-label={`Switch to ${lang.fullName}`}
            aria-pressed={i18n.language === lang.code}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}
