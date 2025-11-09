# Articles Section - Style Updates

## ✨ Style Improvements Applied

### 🎨 Consistent Design System

Updated ArticlesSection to match the design patterns used throughout the homepage.

### 📋 Changes Made

#### 1. **Section Container**

```jsx
// Before: Basic DaisyUI styling
<section className="py-16 bg-base-100">

// After: Consistent with AboutSection
<section
  className="relative py-16 md:py-24 overflow-hidden"
  style={{
    background: "linear-gradient(135deg, #ffffff 0%, #E6F0FA 50%, #F4F6F8 100%)",
  }}
  aria-label="Artikel dan Tips BRI"
>
```

#### 2. **Background Decoration**

Added subtle radial gradient background:

```jsx
<div
  className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-5"
  style={{
    background: "radial-gradient(circle, #F58220 0%, transparent 70%)",
  }}
/>
```

#### 3. **Typography & Spacing**

```jsx
// Header
<h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-bri-primary mb-4">

// Subtitle
<p className="font-body text-lg md:text-xl text-bri-charcoal max-w-3xl mx-auto">

// Spacing
className="container mx-auto px-6"  // Changed from px-4
mb-12 md:mb-16  // Changed from mb-12
```

#### 4. **Card Styling**

```jsx
// Enhanced card with border and group hover
<div className="card bg-white shadow-xl ... group overflow-hidden border border-gray-100">

// Gradient overlay on image hover
<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">

// Image scale on hover
<img className="... group-hover:scale-110 transition-transform duration-500">
```

#### 5. **Color Palette**

Updated to use official BRI colors:

| Element        | Color               | Hex       |
| -------------- | ------------------- | --------- |
| Primary (Blue) | `text-bri-primary`  | `#00529B` |
| Deep Blue      | `text-bri-deep`     | `#003B73` |
| Orange Accent  | `bg-bri-orange`     | `#F58220` |
| Charcoal Text  | `text-bri-charcoal` | `#1F203B` |

#### 6. **Navigation Buttons**

```jsx
// Orange circular buttons with hover effect
<button className="btn btn-circle bg-bri-orange hover:bg-bri-orange/90 text-white border-none ... hover:scale-110">
```

#### 7. **Category Badge**

```jsx
<div
  className="badge badge-sm mb-3"
  style={{ backgroundColor: '#F58220', color: 'white', border: 'none' }}
>
```

#### 8. **Title Hover Effect**

```jsx
<h3 className="... text-bri-primary group-hover:text-bri-orange transition-colors duration-300">
```

#### 9. **Read More Button**

```jsx
// Primary blue with deep blue hover
<Link
  style={{ backgroundColor: '#00529B' }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = '#003B73';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = '#00529B';
  }}
>
```

#### 10. **View All Button**

```jsx
// Outline style with hover fill
<Link
  className="btn btn-outline border-2"
  style={{
    borderColor: '#00529B',
    color: '#00529B',
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = '#00529B';
    e.currentTarget.style.color = 'white';
  }}
>
```

### 📱 Responsive Design

Maintained responsive breakpoints:

- **Mobile**: 1 column, full width
- **Tablet (sm)**: 2 columns, `w-[calc(50%-12px)]`
- **Desktop (lg)**: 3 columns, `w-[calc(33.333%-16px)]`

### 🎭 Animation & Transitions

Enhanced user interactions:

- Card hover: scale + shadow increase
- Image hover: scale to 110%
- Button hover: scale to 105%
- Title color change on card hover
- Smooth transitions (300ms - 500ms)

### 🔄 Consistency with Other Sections

Now matches:

- **AboutSection**: Gradient background, padding, typography
- **ServicesSection**: Card grid, hover effects, spacing
- **InfoSahamBRI**: Updated to match new style

### ✅ Before vs After

| Aspect     | Before               | After                     |
| ---------- | -------------------- | ------------------------- |
| Background | `bg-base-100` (flat) | Gradient with decoration  |
| Padding    | `py-16`              | `py-16 md:py-24`          |
| Container  | `px-4`               | `px-6`                    |
| Typography | Generic sizes        | BRI design system         |
| Colors     | DaisyUI defaults     | BRI brand colors          |
| Cards      | Basic shadow         | White bg + border + hover |
| Buttons    | Generic primary      | BRI blue + orange         |
| Spacing    | `mb-12`              | `mb-12 md:mb-16`          |

### 🎯 Design Principles Applied

1. **Visual Hierarchy**: Larger headings, consistent spacing
2. **Brand Consistency**: BRI color palette throughout
3. **User Feedback**: Hover states, transitions, animations
4. **Accessibility**: ARIA labels, semantic HTML
5. **Responsiveness**: Mobile-first approach
6. **Polish**: Subtle gradients, shadows, decorations

### 📝 Files Updated

1. ✅ `frontend/src/components/ArticlesSection.jsx`
2. ✅ `frontend/src/pages/HomePage.jsx` (InfoSahamBRI section)

### 🚀 Result

The ArticlesSection now seamlessly integrates with the rest of the homepage, providing:

- Consistent visual language
- Professional appearance
- Enhanced user experience
- Brand-aligned design
- Smooth interactions

---

**Status:** ✅ Complete  
**Design System:** BRI Brand Guidelines  
**Updated:** November 3, 2025
