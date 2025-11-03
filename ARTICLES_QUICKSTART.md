# Articles Feature - Quick Start

## 🚀 Setup

### 1. Install Dependencies

```bash
cd frontend
npm install @heroicons/react
```

### 2. Backend Setup

```bash
cd backend
npm run migrate:articles  # Create collection
npm run seed:articles     # Seed sample article
npm run dev              # Start backend on :5000
```

### 3. Frontend Setup

```bash
cd frontend
npm run dev              # Start frontend on :5173
```

## 📍 Routes

| Route            | Component     | Description                            |
| ---------------- | ------------- | -------------------------------------- |
| `/`              | HomePage      | Homepage with ArticlesSection carousel |
| `/articles`      | Articles      | All articles with category filter      |
| `/article/:slug` | ArticleDetail | Full article view                      |

## 🎯 Components

### ArticlesSection

- **Location:** `src/components/ArticlesSection.jsx`
- **Features:** Carousel, responsive, next/prev buttons
- **Usage:** Imported in HomePage

### Articles Page

- **Location:** `src/pages/Articles.jsx`
- **Features:** Grid layout, category filter, full page

### ArticleDetail Page

- **Location:** `src/pages/ArticleDetail.jsx`
- **Features:** Full article, markdown rendering, share button

## 🌐 API Endpoints

```bash
# Get all articles
GET http://localhost:5000/api/articles?lang=id&status=published

# Get by slug
GET http://localhost:5000/api/articles/slug/cara-membuat-akun-brimo?lang=id

# Get by category
GET http://localhost:5000/api/articles/category/Tutorial?lang=id
```

## 📱 Features

### ArticlesSection (Homepage)

✅ Horizontal carousel with smooth scroll  
✅ Next/Previous buttons (only if >3 articles)  
✅ Auto language detection (id/en)  
✅ Loading & error states  
✅ Responsive design (1-3 columns)  
✅ "View All" button

### Articles Page

✅ Grid layout (responsive)  
✅ Category filter (dynamic from DB)  
✅ Article count display  
✅ Meta info (author, date, category)  
✅ Full Navbar & Footer

### ArticleDetail Page

✅ Full article with cover image  
✅ Content rendering (text + images)  
✅ Markdown formatting (headers, bullets)  
✅ Image captions  
✅ Share functionality  
✅ Back navigation  
✅ Feedback buttons

## 🎨 Styling

- **Framework:** DaisyUI + TailwindCSS
- **Icons:** @heroicons/react
- **Layout:** Responsive grid/flex
- **Theme:** BRI brand colors (primary blue)

## 🔄 Language Support

Files automatically switch between Indonesian and English:

- Translation keys in `src/locales/{id,en}/translation.json`
- Auto re-fetch on language change
- Date formatting per locale

## 🧪 Testing

### Browser Testing

1. Open http://localhost:5173
2. Scroll to "Artikel & Tips" section
3. Click carousel buttons (left/right)
4. Click "Baca Selengkapnya"
5. View full article
6. Click back button
7. Test share button
8. Switch language (navbar)

### Sample Article

- **Title (ID):** Cara Membuat Akun BRImo
- **Title (EN):** How to Create a BRImo Account
- **Slug (ID):** cara-membuat-akun-brimo
- **Slug (EN):** how-to-create-brimo-account
- **Category:** Tutorial
- **Content:** 7 steps + 3 images
- **Images:** From Unsplash

## 📝 Code Snippets

### Fetch Articles

```javascript
const fetchArticles = async () => {
  const response = await fetch(
    `http://localhost:5000/api/articles?lang=${i18n.language}&status=published`
  );
  const data = await response.json();
  setArticles(data.data);
};
```

### Navigate to Detail

```jsx
<Link to={`/article/${article.slug}`}>Read More</Link>
```

### Carousel Scroll

```javascript
const scrollRight = () => {
  document.getElementById("articles-carousel").scrollBy({
    left: 400,
    behavior: "smooth",
  });
};
```

## 🐛 Troubleshooting

### Articles not showing

- Check backend is running on :5000
- Verify MongoDB has articles collection
- Run `npm run seed:articles` if empty

### Images not loading

- Check image URLs are valid
- Verify CORS settings
- Check network tab for errors

### Language not switching

- Verify i18n is configured
- Check translation keys exist
- Restart frontend server

### Carousel not scrolling

- Check articles.length > 3
- Verify scroll buttons are visible
- Test in different browsers

## 📚 Full Documentation

For detailed documentation, see:

- **Frontend:** [ARTICLES_FRONTEND.md](./ARTICLES_FRONTEND.md)
- **Backend:** [../backend/ARTICLES_README.md](../backend/ARTICLES_README.md)
- **API Testing:** [../backend/API_ARTICLES_TESTING.md](../backend/API_ARTICLES_TESTING.md)

## ✅ Checklist

- [ ] Backend running on :5000
- [ ] MongoDB connected
- [ ] Articles collection created
- [ ] Sample article seeded
- [ ] Frontend dependencies installed
- [ ] Frontend running on :5173
- [ ] ArticlesSection visible on homepage
- [ ] Carousel working with buttons
- [ ] Article detail page accessible
- [ ] Language switching works
- [ ] Share button functional
- [ ] Images loading correctly
- [ ] Responsive on mobile/tablet/desktop

---

**Status:** ✅ Ready for Production  
**Last Updated:** November 3, 2025  
**Version:** 1.0.0
