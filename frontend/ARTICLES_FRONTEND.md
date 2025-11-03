# Articles Feature Documentation

Dokumentasi lengkap untuk fitur artikel multi-bahasa di frontend BRImo.

## 📋 Overview

Fitur artikel terdiri dari 3 komponen utama:

1. **ArticlesSection** - Section carousel di homepage
2. **Articles** - Halaman list semua artikel dengan filter
3. **ArticleDetail** - Halaman detail artikel

## 🎨 Components

### 1. ArticlesSection (Homepage)

**Location:** `src/components/ArticlesSection.jsx`

**Features:**

- ✅ Carousel horizontal dengan smooth scroll
- ✅ Next/Previous buttons (hanya muncul jika artikel >3)
- ✅ Auto-fetch berdasarkan bahasa aktif (id/en)
- ✅ Preview 2 content blocks pertama
- ✅ Responsive: 1 kolom (mobile), 2 kolom (tablet), 3 kolom (desktop)
- ✅ Loading state dengan spinner
- ✅ Error handling
- ✅ Link ke detail artikel
- ✅ Button "View All Articles" (jika artikel >3)

**Usage:**

```jsx
import ArticlesSection from "../components/ArticlesSection";

<ArticlesSection />;
```

**Props:** None (menggunakan i18n context)

**Styling:**

- DaisyUI card components
- Custom carousel scrolling
- Hidden scrollbar
- Hover effects (scale, shadow)

### 2. Articles Page

**Location:** `src/pages/Articles.jsx`

**Features:**

- ✅ Grid layout (3 kolom desktop, 2 tablet, 1 mobile)
- ✅ Category filter (sticky header)
- ✅ Dynamic category badges dari database
- ✅ Article count display
- ✅ Meta info (author, date, category)
- ✅ Full Navbar & Footer
- ✅ Hero section dengan gradient

**Routes:**

```javascript
<Route path="/articles" element={<Articles />} />
```

**API Calls:**

```javascript
// Fetch all articles
GET http://localhost:5000/api/articles?lang=id&status=published

// Filter by category
GET http://localhost:5000/api/articles?lang=id&status=published&category=Tutorial
```

### 3. ArticleDetail Page

**Location:** `src/pages/ArticleDetail.jsx`

**Features:**

- ✅ Full article view dengan cover image
- ✅ Content rendering (text + image blocks)
- ✅ Markdown-style formatting (##, ###, bullet points)
- ✅ Image captions
- ✅ Share button (native share API + clipboard fallback)
- ✅ Back button dengan navigate(-1)
- ✅ Sticky header dengan back button
- ✅ Meta info (author, date, category)
- ✅ Article feedback (helpful buttons)
- ✅ Related articles placeholder

**Routes:**

```javascript
<Route path="/article/:slug" element={<ArticleDetail />} />
```

**API Calls:**

```javascript
// Fetch by slug
GET http://localhost:5000/api/articles/slug/cara-membuat-akun-brimo?lang=id
```

**Content Rendering:**
The component handles two types of content blocks:

1. **Text blocks:**

   - Supports markdown headers (## and ###)
   - Bullet points (• prefix)
   - Regular paragraphs
   - Line breaks

2. **Image blocks:**
   - Full-width responsive images
   - Optional captions
   - Rounded corners with shadow

## 🎯 Routes Summary

```javascript
// Public routes
/                    → HomePage (with ArticlesSection)
/articles            → All articles page
/article/:slug       → Article detail page
```

## 🌐 Internationalization

### Translation Keys

**ID (Indonesia):**

```json
{
  "articles": {
    "title": "Artikel & Tips",
    "subtitle": "Pelajari lebih lanjut tentang layanan perbankan digital BRI dan tips keuangan",
    "readMore": "Baca Selengkapnya",
    "viewAll": "Lihat Semua Artikel",
    "back": "Kembali",
    "helpful": "Apakah artikel ini membantu?",
    "yes": "👍 Ya",
    "no": "👎 Tidak",
    "related": "Artikel Terkait"
  }
}
```

**EN (English):**

```json
{
  "articles": {
    "title": "Articles & Tips",
    "subtitle": "Learn more about BRI digital banking services and financial tips",
    "readMore": "Read More",
    "viewAll": "View All Articles",
    "back": "Back",
    "helpful": "Was this article helpful?",
    "yes": "👍 Yes",
    "no": "👎 No",
    "related": "Related Articles"
  }
}
```

### Language Switching

Components automatically re-fetch data when language changes:

```javascript
useEffect(() => {
  fetchArticles();
}, [i18n.language]);
```

## 🎨 Design System

### Colors (DaisyUI)

- Primary: Blue BRI brand
- Base-100: Light background
- Base-200: Card background
- Base-300: Borders

### Typography

- Title: 4xl-5xl font-bold
- Subtitle: xl
- Body: base/lg with leading-relaxed
- Meta: xs-sm with opacity

### Spacing

- Section padding: py-12 to py-16
- Card gap: gap-6 to gap-8
- Content margins: mb-4 to mb-8

### Components Used

- `card` - Article cards
- `btn` - Buttons (primary, outline, circle)
- `badge` - Category tags
- `loading` - Spinner animations
- `alert` - Error messages

## 📱 Responsive Breakpoints

```css
/* Mobile first approach */
default: 1 column (w-full)
sm:     2 columns (w-[calc(50%-12px)])
lg:     3 columns (w-[calc(33.333%-16px)])
```

### Carousel Controls

```jsx
// Only show if articles.length > 3
{
  articles.length > 3 && (
    <button className="btn btn-circle btn-primary">
      <ChevronLeftIcon />
    </button>
  );
}
```

## 🔄 Data Flow

```
Backend API
    ↓
ArticlesSection/Articles/ArticleDetail
    ↓
useState hooks
    ↓
Render UI
    ↓
User interaction
    ↓
Navigate/Filter/Share
```

### State Management

**ArticlesSection:**

```javascript
const [articles, setArticles] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

**Articles Page:**

```javascript
const [selectedCategory, setSelectedCategory] = useState("all");
const [categories, setCategories] = useState([]);
```

**ArticleDetail:**

```javascript
const [article, setArticle] = useState(null);
const { slug } = useParams();
```

## 🎬 User Interactions

### ArticlesSection

1. View carousel articles
2. Scroll left/right (if >3 articles)
3. Click "Baca Selengkapnya" → Navigate to detail
4. Click "Lihat Semua Artikel" → Navigate to /articles

### Articles Page

1. Filter by category
2. Click article card → Navigate to detail
3. View meta info (author, date)

### ArticleDetail

1. Read full article
2. Click back button → Go back
3. Click share button → Share/Copy link
4. View images with captions
5. Click helpful buttons (feedback)

## 🛠️ Development

### Install Dependencies

```bash
npm install @heroicons/react
```

### Test Locally

```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd frontend
npm run dev
```

### API Endpoints

```
GET /api/articles?lang=id&status=published
GET /api/articles/slug/:slug?lang=id
GET /api/articles/category/:category?lang=id
```

## 🎯 Features Checklist

### ArticlesSection

- [x] Carousel with navigation
- [x] Responsive design
- [x] Loading state
- [x] Error handling
- [x] Multi-language support
- [x] Image lazy loading
- [x] Content preview
- [x] Navigation to detail

### Articles Page

- [x] Grid layout
- [x] Category filter
- [x] Article count
- [x] Meta information
- [x] Responsive design
- [x] Loading state
- [x] Empty state

### ArticleDetail

- [x] Full article view
- [x] Cover image
- [x] Content rendering (text + images)
- [x] Markdown formatting
- [x] Share functionality
- [x] Back navigation
- [x] Sticky header
- [x] Meta information
- [x] Feedback buttons
- [x] Related articles section

## 🔮 Future Enhancements

1. **Search functionality**

   - Add search bar
   - Search by title/content

2. **Pagination**

   - Load more button
   - Infinite scroll

3. **Related articles**

   - Fetch by category
   - Display at bottom of detail page

4. **Comments section**

   - User comments
   - Moderation

5. **Reading time**

   - Calculate from content
   - Display on card

6. **Bookmarks**

   - Save favorite articles
   - User profile integration

7. **Social sharing**

   - Twitter, Facebook, WhatsApp
   - Copy link with success toast

8. **Article views counter**
   - Track page views
   - Display popularity

## 📊 Performance

### Optimizations

- Image lazy loading
- Smooth scroll behavior
- Debounced scroll events
- Efficient re-renders with useEffect dependencies
- Content preview truncation
- Hidden scrollbar CSS

### Loading States

```jsx
{
  loading ? <Spinner /> : <Content />;
}
{
  error ? <Alert /> : <Content />;
}
{
  articles.length === 0 ? <Empty /> : <List />;
}
```

## 🐛 Error Handling

```javascript
try {
  const response = await fetch(url);
  const data = await response.json();
  if (data.success) {
    setArticles(data.data);
  } else {
    setError("Failed to fetch");
  }
} catch (err) {
  setError(err.message);
  console.error(err);
}
```

## 📝 Code Examples

### Fetch Articles

```javascript
const fetchArticles = async () => {
  try {
    setLoading(true);
    const response = await fetch(
      `http://localhost:5000/api/articles?lang=${i18n.language}&status=published`
    );
    const data = await response.json();

    if (data.success) {
      setArticles(data.data);
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Render Content Blocks

```javascript
const renderContent = (content) => {
  return content.map((block, index) => {
    if (block.type === "text") {
      return <div key={index}>{block.value}</div>;
    } else if (block.type === "image") {
      return (
        <figure key={index}>
          <img src={block.value} alt={block.caption} />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    }
  });
};
```

### Carousel Scroll

```javascript
const scrollLeft = () => {
  document.getElementById("articles-carousel").scrollBy({
    left: -400,
    behavior: "smooth",
  });
};
```

## 📄 License

MIT License - BRI Digital Banking Project
