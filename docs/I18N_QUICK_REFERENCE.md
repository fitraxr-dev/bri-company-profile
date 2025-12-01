# i18n Quick Reference - Before & After Examples

## Simple Text Translation

### ❌ Before (Hardcoded)

```jsx
<h2>Tentang BRI</h2>
<p>Lebih dari 125 tahun melayani Indonesia.</p>
```

### ✅ After (Translated)

```jsx
import { useTranslation } from "react-i18next";

function Component() {
  const { t } = useTranslation();

  return (
    <>
      <h2>{t("about.title")}</h2>
      <p>{t("about.subtitle")}</p>
    </>
  );
}
```

**Translation files:**

```json
// id/translation.json
{
  "about": {
    "title": "Tentang BRI",
    "subtitle": "Lebih dari 125 tahun melayani Indonesia."
  }
}

// en/translation.json
{
  "about": {
    "title": "About BRI",
    "subtitle": "More than 125 years serving Indonesia."
  }
}
```

---

## Text with Styled Elements (Trans Interpolation)

### ❌ Before (Cannot translate styled text)

```jsx
<h1>
  Bersama BRI <span className="font-bold text-bri-orange">mo</span>, Wujudkan
  Masa Depan Finansial Anda.
</h1>
```

### ✅ After (Using Trans component)

```jsx
import { Trans } from "react-i18next";

<h1>
  <Trans i18nKey="hero.title">
    Bersama BRI <span className="font-bold text-bri-orange">mo</span>, Wujudkan
    Masa Depan Finansial Anda.
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

**Key Points:**

- `<1>text</1>` represents the **first child element** (the `<span>`)
- CSS classes are preserved automatically
- Works with any JSX element (span, strong, em, etc.)

---

## Dynamic Content Arrays

### ❌ Before (Hardcoded array)

```jsx
const services = [
  {
    title: "Tabungan & Giro",
    description: "Nikmati berbagai pilihan tabungan",
  },
  {
    title: "Kredit & Pembiayaan",
    description: "Solusi pembiayaan untuk individu",
  },
];
```

### ✅ After (Translated array)

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

**Translation files:**

```json
// id/translation.json
{
  "services": {
    "savings": {
      "title": "Tabungan & Giro",
      "description": "Nikmati berbagai pilihan tabungan"
    },
    "credit": {
      "title": "Kredit & Pembiayaan",
      "description": "Solusi pembiayaan untuk individu"
    }
  }
}
```

---

## Button Labels & Aria Labels

### ❌ Before

```jsx
<button aria-label="Pelajari Layanan">Pelajari Layanan</button>
```

### ✅ After

```jsx
const { t } = useTranslation();

<button aria-label={t("hero.learnServices")}>{t("hero.learnServices")}</button>;
```

---

## Navigation Links

### ❌ Before

```jsx
const links = [
  { href: "#about", label: "Tentang Kami" },
  { href: "#services", label: "Layanan Kami" },
];
```

### ✅ After

```jsx
const { t } = useTranslation();

const links = [
  { href: "#about", label: t("navbar.about") },
  { href: "#services", label: t("navbar.services") },
];
```

---

## Language Switcher Implementation

### Complete Example

```jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

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
      <Globe className="w-5 h-5" />

      <div className="flex gap-1 bg-white/10 rounded-lg p-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`
              px-3 py-1.5 rounded-md font-semibold text-sm
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
```

---

## Multiple Styled Elements in Trans

### ❌ Before

```jsx
<p>
  Memberikan layanan terbaik dengan semangat{" "}
  <span className="text-white font-semibold">Melayani Dengan Setulus Hati</span>
  .
</p>
```

### ✅ After

```jsx
<p>
  <Trans i18nKey="footer.brand.description">
    Memberikan layanan terbaik dengan semangat{" "}
    <span className="text-white font-semibold">
      Melayani Dengan Setulus Hati
    </span>
    .
  </Trans>
</p>
```

**Translation:**

```json
{
  "footer": {
    "brand": {
      "description": "Memberikan layanan terbaik dengan semangat <1>Melayani Dengan Setulus Hati</1>."
    }
  }
}
```

---

## Common Patterns

### Pattern 1: Page Titles

```jsx
const { t } = useTranslation();
<h1>{t("section.title")}</h1>;
```

### Pattern 2: Button Text

```jsx
<button>{t("actions.submit")}</button>
```

### Pattern 3: Error Messages

```jsx
{
  error && <p>{t("errors.loadFailed")}</p>;
}
```

### Pattern 4: Conditional Text

```jsx
<span>{isLoading ? t("status.loading") : t("status.ready")}</span>
```

### Pattern 5: Dynamic Interpolation (with variables)

```jsx
// Translation: "Welcome, {{name}}!"
{
  t("greeting.welcome", { name: userName });
}
```

---

## Testing Language Changes

### Manual Testing

1. Open app in browser
2. Click language switcher (ID/EN)
3. Verify all text changes instantly
4. Refresh page - language persists
5. Clear localStorage - resets to default (ID)

### Browser Language Detection

1. Change browser language to English
2. Clear localStorage
3. Reload page
4. App should default to English

---

## Component Checklist

When converting a component to use i18n:

- [ ] Import `useTranslation` or `Trans`
- [ ] Call `const { t } = useTranslation();`
- [ ] Replace hardcoded text with `t("key")`
- [ ] Use `<Trans>` for styled text
- [ ] Add translation keys to both `en` and `id` files
- [ ] Test language switching
- [ ] Verify styling preserved
- [ ] Check aria-labels updated

---

## Common Mistakes to Avoid

### ❌ Wrong: Using t() for styled text

```jsx
<h1>{t("hero.title")}</h1>
// Result: "Bersama BRI <1>mo</1>, ..." (shows HTML tags!)
```

### ✅ Correct: Using Trans for styled text

```jsx
<h1>
  <Trans i18nKey="hero.title">
    Bersama BRI <span>mo</span>, ...
  </Trans>
</h1>
```

---

### ❌ Wrong: Forgetting to import i18n

```jsx
// main.jsx
import App from "./App";
// Missing: import "./i18n";
```

### ✅ Correct: Import before App

```jsx
import "./i18n"; // Initialize first
import App from "./App";
```

---

### ❌ Wrong: Mismatched translation keys

```json
// en/translation.json
{ "button": "Submit" }

// id/translation.json
{ "btn": "Kirim" }  // Different key!
```

### ✅ Correct: Consistent keys

```json
// en/translation.json
{ "button": "Submit" }

// id/translation.json
{ "button": "Kirim" }  // Same key structure
```

---

## Quick Copy-Paste Templates

### Template 1: Basic Component

```jsx
import { useTranslation } from "react-i18next";

export default function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h2>{t("section.title")}</h2>
      <p>{t("section.description")}</p>
      <button>{t("actions.cta")}</button>
    </div>
  );
}
```

### Template 2: Component with Trans

```jsx
import { useTranslation, Trans } from "react-i18next";

export default function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>
        <Trans i18nKey="hero.title">
          Welcome to <span className="highlight">BRI</span>
        </Trans>
      </h1>
      <p>{t("hero.subtitle")}</p>
    </div>
  );
}
```

---

This quick reference covers all common use cases in the BRI Redesign project! 🎉
