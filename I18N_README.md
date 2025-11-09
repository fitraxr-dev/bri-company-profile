# 🌐 BRI Redesign - Multilingual Implementation

A complete internationalization (i18n) setup for the BRI bank website redesign using **React**, **Vite**, **Tailwind CSS**, and **i18next**.

## 🎯 Features

- ✅ **Bilingual Support** - Indonesian (ID) and English (EN)
- ✅ **Automatic Language Detection** - Based on browser preferences
- ✅ **Manual Language Switching** - Toggle between languages via navbar
- ✅ **Persistent Language Preference** - Stored in localStorage
- ✅ **HTML Interpolation** - Preserves styled elements (e.g., `<span>`) in translations
- ✅ **No Page Reload** - Instant language changes
- ✅ **Responsive Design** - Works on mobile and desktop
- ✅ **Accessible** - Proper ARIA labels for all interactive elements

---

## 📦 Installation

The required packages are already installed:

```json
{
  "dependencies": {
    "i18next": "^25.6.0",
    "i18next-browser-languagedetector": "^8.2.0",
    "react-i18next": "^16.2.0"
  }
}
```

If starting fresh, run:

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

---

## 🚀 Quick Start

### 1. Language Detection & Storage

The app automatically:

1. Checks **localStorage** for saved language preference
2. Falls back to **browser language** if no preference exists
3. Defaults to **Indonesian (ID)** if language not supported

### 2. Change Language

Click the **ID / EN** button in the navbar:

- **Desktop**: Top-right corner
- **Mobile**: Inside hamburger menu

---

## 📁 File Structure

```
frontend/
├── src/
│   ├── i18n.js                          # i18next config (core setup)
│   ├── main.jsx                         # App entry (imports i18n)
│   ├── locales/
│   │   ├── en/
│   │   │   └── translation.json        # 🇬🇧 English translations
│   │   └── id/
│   │       └── translation.json        # 🇮🇩 Indonesian translations
│   └── components/
│       ├── LanguageSwitcher.jsx        # Language toggle UI
│       ├── Hero.jsx                    # ✨ Uses Trans for interpolation
│       ├── Navbar.jsx                  # Contains LanguageSwitcher
│       ├── AboutSection.jsx            # Standard translations
│       ├── ServicesSection.jsx         # Dynamic array translations
│       ├── InfoSahamBRI.jsx            # Real-time data with i18n
│       └── FooterBRI.jsx               # ✨ Uses Trans + standard
```

---

## 🔧 Usage Examples

### Example 1: Simple Text Translation

```jsx
import { useTranslation } from "react-i18next";

function AboutSection() {
  const { t } = useTranslation();

  return (
    <div>
      <h2>{t("about.title")}</h2>
      <p>{t("about.description")}</p>
    </div>
  );
}
```

**Translation files:**

```json
// id/translation.json
{
  "about": {
    "title": "Tentang BRI",
    "description": "Lebih dari 125 tahun melayani Indonesia."
  }
}

// en/translation.json
{
  "about": {
    "title": "About BRI",
    "description": "More than 125 years serving Indonesia."
  }
}
```

---

### Example 2: Text with Styled Elements (Trans)

For text containing **HTML elements** like `<span>`, `<strong>`, etc.:

```jsx
import { Trans } from "react-i18next";

<h1 className="text-5xl font-bold">
  <Trans i18nKey="hero.title">
    Bersama BRI <span className="text-orange-500">mo</span>, Wujudkan Masa Depan
    Finansial Anda.
  </Trans>
</h1>;
```

**Translation files:**

```json
// id/translation.json
{
  "hero": {
    "title": "Bersama BRI <1>mo</1>, Wujudkan Masa Depan Finansial Anda."
  }
}

// en/translation.json
{
  "hero": {
    "title": "Together with BRI <1>mo</1>, Realize Your Financial Future."
  }
}
```

**Key Point:** `<1>mo</1>` represents the first child element (the `<span>`). CSS classes are preserved automatically! 🎨

---

### Example 3: Dynamic Arrays

```jsx
import { useTranslation } from "react-i18next";

function ServicesSection() {
  const { t } = useTranslation();

  const services = [
    {
      title: t("services.savings.title"),
      description: t("services.savings.description"),
    },
    {
      title: t("services.credit.title"),
      description: t("services.credit.description"),
    },
  ];

  return (
    <div>
      {services.map((service, idx) => (
        <div key={idx}>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🎨 Language Switcher Component

Located at `src/components/LanguageSwitcher.jsx`:

```jsx
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-5 h-5" />

      <div className="flex gap-1 bg-white/10 rounded-lg p-1">
        {["id", "en"].map((lng) => (
          <button
            key={lng}
            onClick={() => i18n.changeLanguage(lng)}
            className={`
              px-3 py-1.5 rounded-md font-semibold text-sm
              ${i18n.language === lng ? "bg-white text-blue-600" : "text-white"}
            `}
          >
            {lng.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Features:**

- Active state highlighting
- Instant language switch
- Accessible with ARIA attributes
- Responsive design

---

## 📝 Translation Keys Structure

All translations follow a **consistent hierarchical structure**:

```json
{
  "navbar": {
    "about": "...",
    "services": "...",
    "stock": "..."
  },
  "hero": {
    "title": "...",
    "description": "...",
    "learnServices": "...",
    "contactUs": "..."
  },
  "about": { ... },
  "services": { ... },
  "stock": { ... },
  "footer": { ... },
  "language": {
    "en": "English",
    "id": "Indonesian"
  }
}
```

---

## 🌍 Adding New Languages

### Step 1: Create Translation File

```
src/locales/es/translation.json  # Spanish example
```

### Step 2: Update `i18n.js`

```js
import translationES from "./locales/es/translation.json";

const resources = {
  en: { translation: translationEN },
  id: { translation: translationID },
  es: { translation: translationES }, // Add new language
};
```

### Step 3: Update `LanguageSwitcher.jsx`

```jsx
const languages = [
  { code: "id", name: "ID" },
  { code: "en", name: "EN" },
  { code: "es", name: "ES" }, // Add new language
];
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Switch language from navbar (desktop)
- [ ] Switch language from mobile menu
- [ ] Refresh page - language persists
- [ ] Clear localStorage - defaults to Indonesian
- [ ] Change browser language - auto-detects
- [ ] Verify all pages render correctly
- [ ] Check styled text preserves formatting
- [ ] Test button labels and tooltips
- [ ] Verify ARIA labels are translated

### Browser Language Detection Test

1. Open browser settings
2. Change preferred language to English
3. Clear localStorage: `localStorage.clear()`
4. Reload page
5. App should default to English

---

## 🐛 Troubleshooting

### Issue: Language not changing

**Solution:** Check if `import "./i18n";` is in `main.jsx` before `<App />`

### Issue: Styled text shows HTML tags

**Solution:** Use `<Trans>` component instead of `t()` function

### Issue: Translation key not found

**Solution:** Verify key exists in both `en` and `id` files with the same structure

### Issue: Language resets after refresh

**Solution:** Check localStorage permissions in browser settings

---

## 📚 Documentation

- **Implementation Guide:** `I18N_IMPLEMENTATION_GUIDE.md`
- **Quick Reference:** `I18N_QUICK_REFERENCE.md`
- **Official Docs:** [react-i18next.com](https://react.i18next.com/)

---

## ✨ Best Practices

### ✅ DO:

- Use semantic keys: `navbar.about` (not `text1`)
- Use `<Trans>` for HTML-containing text
- Use `t()` for plain text
- Keep consistent structure across languages
- Test all components after adding translations

### ❌ DON'T:

- Hardcode text in components
- Use complex HTML in translation strings
- Mix `t()` and `<Trans>` incorrectly
- Forget to add keys to all language files

---

## 🎯 Performance

- **No runtime fetching** - All translations bundled at build time
- **Minimal re-renders** - i18next optimizes React updates
- **localStorage caching** - Instant language restoration
- **Lazy loading ready** - Can split translations by route if needed

---

## 🔒 Accessibility

All language controls include proper ARIA attributes:

```jsx
<button aria-label="Switch to English" aria-pressed={isActive}>
  EN
</button>
```

---

## 📊 Current Coverage

All major components are fully translated:

| Component  | Status      | Notes                      |
| ---------- | ----------- | -------------------------- |
| Navbar     | ✅ Complete | Includes language switcher |
| Hero       | ✅ Complete | Uses Trans for styled text |
| About      | ✅ Complete | Standard translations      |
| Services   | ✅ Complete | Dynamic array translations |
| Stock Info | ✅ Complete | Real-time data labels      |
| Footer     | ✅ Complete | Uses Trans + standard      |

---

## 🚀 Production Ready

This implementation is **production-ready** with:

- ✅ Automatic language detection
- ✅ Manual language switching
- ✅ Persistent storage
- ✅ HTML element preservation
- ✅ Responsive design
- ✅ Accessibility compliance
- ✅ Performance optimized
- ✅ Comprehensive documentation

---

## 📞 Support

For questions or issues:

1. Check `I18N_IMPLEMENTATION_GUIDE.md` for detailed setup
2. Review `I18N_QUICK_REFERENCE.md` for code examples
3. Visit [react-i18next documentation](https://react.i18next.com/)

---

## 📜 License

This i18n implementation follows the same license as the main project.

---

**Made with ❤️ for BRI Redesign Project**
