# Multilingual Implementation Guide

## Overview

This project implements a comprehensive multilingual feature using **i18next** and **react-i18next** with support for Indonesian (ID) and English (EN).

## Features Implemented

✅ **Automatic Language Detection** - Detects browser language preference  
✅ **Manual Language Switching** - Toggle between ID/EN via navbar switcher  
✅ **Persistent Language Preference** - Stored in localStorage  
✅ **Text Interpolation** - Preserves HTML elements like `<span>` within translations  
✅ **Smooth Language Changes** - No page reload required  
✅ **Responsive Design** - Language switcher adapts to mobile/desktop views

---

## Project Structure

```
frontend/
├── src/
│   ├── i18n.js                          # i18next configuration
│   ├── main.jsx                         # App entry point (imports i18n)
│   ├── locales/
│   │   ├── en/
│   │   │   └── translation.json        # English translations
│   │   └── id/
│   │       └── translation.json        # Indonesian translations
│   └── components/
│       ├── LanguageSwitcher.jsx        # Language toggle component
│       ├── Hero.jsx                    # Example with Trans interpolation
│       ├── Navbar.jsx                  # Contains language switcher
│       ├── AboutSection.jsx            # Translated component
│       ├── ServicesSection.jsx         # Translated component
│       ├── InfoSahamBRI.jsx            # Translated component
│       └── FooterBRI.jsx               # Translated component with Trans
```

---

## Installation & Setup

### 1. Install Dependencies (Already Done)

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

### 2. Configuration Files

**`src/i18n.js`** - Core i18next configuration

- Imports translation files
- Configures language detection (localStorage → navigator → htmlTag)
- Sets fallback language to Indonesian
- Enables React interpolation

**`src/main.jsx`** - Initialize i18n

```jsx
import "./i18n"; // Import before rendering App
```

---

## Translation Files

### Location: `src/locales/{lang}/translation.json`

#### Structure:

```json
{
  "navbar": { "about": "...", "services": "..." },
  "hero": { "title": "...", "description": "..." },
  "about": { ... },
  "services": { ... },
  "stock": { ... },
  "footer": { ... },
  "language": { "en": "English", "id": "Indonesian" }
}
```

---

## Usage Examples

### Basic Translation with `useTranslation`

```jsx
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("navbar.about")}</h1>
      <p>{t("hero.description")}</p>
    </div>
  );
}
```

### Interpolation with `Trans` Component

For text with **styled elements** (like `<span>` or `<strong>`):

**Translation JSON:**

```json
{
  "hero": {
    "title": "Bersama BRI <1>mo</1>, Wujudkan Masa Depan Finansial Anda."
  }
}
```

**React Component:**

```jsx
import { Trans } from "react-i18next";

<h1>
  <Trans i18nKey="hero.title">
    Bersama BRI <span className="font-bold text-bri-orange">mo</span>, Wujudkan
    Masa Depan Finansial Anda.
  </Trans>
</h1>;
```

**English Translation:**

```json
{
  "hero": {
    "title": "Together with BRI <1>mo</1>, Realize Your Financial Future."
  }
}
```

✨ **The `<span>` element is preserved with `<1>mo</1>` tag in translations!**

---

## Language Switcher Component

### Features:

- **Globe icon** for visual identification
- **ID/EN buttons** with active state highlighting
- **Mobile responsive** - Shows in mobile menu
- **Desktop placement** - Top-right of navbar

### Usage:

```jsx
import LanguageSwitcher from "./components/LanguageSwitcher";

<LanguageSwitcher />;
```

The component automatically:

1. Reads current language from `i18n.language`
2. Changes language on button click
3. Stores preference in `localStorage`
4. Updates all `t()` and `<Trans>` components instantly

---

## Language Detection Priority

1. **localStorage** - Previously saved preference
2. **navigator** - Browser language setting
3. **htmlTag** - HTML `lang` attribute
4. **Fallback** - Indonesian (ID)

---

## Adding New Languages

### 1. Create translation file:

```
src/locales/es/translation.json  # Spanish example
```

### 2. Update `i18n.js`:

```js
import translationES from "./locales/es/translation.json";

const resources = {
  en: { translation: translationEN },
  id: { translation: translationID },
  es: { translation: translationES }, // Add new language
};
```

### 3. Update `LanguageSwitcher.jsx`:

```jsx
const languages = [
  { code: "id", name: "ID", fullName: "Indonesian" },
  { code: "en", name: "EN", fullName: "English" },
  { code: "es", name: "ES", fullName: "Spanish" }, // Add new language
];
```

---

## Best Practices

### ✅ DO:

- Use **semantic keys** (`navbar.about` not `text1`)
- Use `<Trans>` for **HTML-containing text**
- Use `t()` for **plain text**
- Keep **consistent structure** across language files
- Test **all components** after adding translations

### ❌ DON'T:

- Hardcode text in components
- Use complex HTML in translation strings
- Forget to import `useTranslation` hook
- Mix `t()` and `<Trans>` incorrectly

---

## Testing Checklist

- [ ] Switch language from navbar (desktop)
- [ ] Switch language from mobile menu
- [ ] Refresh page - language persists
- [ ] Clear localStorage - defaults to ID
- [ ] Change browser language - auto-detects
- [ ] Check all components render correctly
- [ ] Verify styled text preserves formatting (Hero title)
- [ ] Test button labels and aria-labels
- [ ] Verify footer social media links work
- [ ] Check stock info translations

---

## Troubleshooting

### Language not changing?

- Check if `i18n.js` is imported in `main.jsx`
- Verify translation keys exist in both `en` and `id` files
- Clear browser cache and localStorage

### Styled text not rendering?

- Use `<Trans>` component, not `t()`
- Check translation uses `<1>text</1>` tags correctly
- Ensure default content matches translation structure

### Components not updating?

- Verify component imports `useTranslation` hook
- Check `t()` function is called correctly
- Ensure translation keys match JSON structure

---

## Performance Considerations

- **Translation files are bundled** during build
- **No runtime fetching** - all translations loaded on init
- **Minimal re-renders** - i18next optimizes React updates
- **localStorage caching** - Instant language restoration

---

## Accessibility

All language-related elements include proper ARIA attributes:

```jsx
<button aria-label="Switch to English" aria-pressed={isActive}>
  EN
</button>
```

---

## Examples in This Project

### 1. Hero Section (`Hero.jsx`)

- **Trans interpolation** for title with styled "mo"
- Plain `t()` for description and buttons

### 2. Navbar (`Navbar.jsx`)

- Dynamic link labels using `t()`
- Language switcher in desktop/mobile views

### 3. Services Section (`ServicesSection.jsx`)

- Array of services with translated titles/descriptions
- Dynamic rendering with `map()`

### 4. Footer (`FooterBRI.jsx`)

- Trans interpolation for brand description
- Translated social links and legal info

### 5. Stock Info (`InfoSahamBRI.jsx`)

- Real-time data with translated labels
- Error messages in current language

---

## Additional Resources

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Guide](https://react.i18next.com/)
- [Trans Component API](https://react.i18next.com/latest/trans-component)

---

## Summary

This implementation provides a **complete multilingual solution** with:

- ✅ Automatic detection
- ✅ Manual switching
- ✅ Persistent storage
- ✅ HTML interpolation
- ✅ Zero configuration for end users

All components are now fully translated and ready for production! 🎉
