# 📸 Photographer Portfolio

A modern, professional photography portfolio website built with Next.js 16 and Sanity CMS. Features optimized image delivery, right-click protection, and a powerful content management system.

## 🎯 Project Overview

This is a full-stack photographer portfolio application that allows photographers to:
- Showcase their work in a beautiful, responsive grid layout
- Manage photos through an intuitive Sanity Studio CMS
- Protect images with right-click and drag prevention
- Organize photos with tags and featured status
- Deliver optimized images via Sanity's CDN with automatic WebP/AVIF conversion

## 🚀 Tech Stack

### Frontend
- **[Next.js 16.0.1](https://nextjs.org/)** - React framework with App Router
- **[React 19.2.0](https://react.dev/)** - Latest React with Server Components
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework

### CMS & Backend
- **[Sanity 4.12.0](https://www.sanity.io/)** - Headless CMS
- **[Sanity Studio](https://www.sanity.io/studio)** - Content management interface
- **[next-sanity 11.6.3](https://github.com/sanity-io/next-sanity)** - Next.js integration
- **[GROQ](https://www.sanity.io/docs/groq)** - Query language for Sanity
- **[Resend](https://resend.com/)** - Email API for contact form

### Image Optimization
- **Next.js Image Component** - Automatic image optimization
- **Sanity Image URLs** - CDN-powered image transformations
- **WebP/AVIF Support** - Modern image formats for better performance

## 📁 Project Structure

```
photographer-portfolio/
├── app/                      # Next.js App Router
│   ├── contact/             # Contact page with form
│   │   └── page.tsx         # Contact form with rate limiting
│   ├── photos/              # Photo gallery page
│   │   └── page.tsx         # Server component with data fetching
│   ├── tag/[slug]/          # Dynamic tag pages
│   │   └── page.tsx         # Tag-filtered gallery with pagination
│   ├── sanity/              # Sanity Studio route
│   │   └── [[...tool]]/
│   ├── layout.tsx           # Root layout with navigation
│   └── globals.css          # Global styles + protection CSS
├── components/              # React components
│   ├── About.tsx            # About section component
│   ├── FeaturedSection.tsx  # Featured work section
│   ├── Footer.tsx           # Site footer
│   ├── Header.tsx           # Site header with navigation
│   ├── InfoPanel.tsx        # Photo metadata panel (desktop/mobile)
│   ├── Lightbox.tsx         # Interactive photo viewer
│   ├── Pagination.tsx       # Pagination component
│   ├── PhotoGrid.tsx        # Responsive grid layout
│   └── ProtectedImage.tsx   # Image with right-click protection
├── lib/                     # Utility functions
│   ├── colorSchemes.ts      # Tag color theme system
│   ├── imageBuilder.ts      # Sanity image URL helpers
│   ├── queries.ts           # GROQ queries
│   └── rateLimit.ts         # Contact form rate limiting
├── sanity/                  # Sanity configuration
│   ├── env.ts              # Environment variable management
│   ├── lib/
│   │   ├── client.ts       # Sanity client setup
│   │   └── image.ts        # Image URL builder
│   ├── schemaTypes/        # Content schemas
│   │   ├── index.ts        # Schema exports
│   │   ├── homepage.ts     # Homepage content schema
│   │   ├── navigation.ts   # Site navigation schema
│   │   ├── photo.ts        # Photo document type
│   │   ├── settings.ts     # Site settings schema
│   │   └── tag.ts          # Tag document type with page customization
│   └── structure.ts        # Studio structure customization
├── types/                   # TypeScript types
│   └── sanity.ts           # Sanity data types
├── .env.local              # Environment variables (not committed)
├── .gitignore              # Git ignore rules
├── next.config.ts          # Next.js configuration
├── sanity.config.ts        # Sanity Studio configuration
└── tailwind.config.ts      # Tailwind configuration
```

## 🛠️ Getting Started

### Prerequisites

- **Node.js 18+** (for Next.js 16)
- **npm** or **yarn** or **pnpm**
- **Sanity account** (free at [sanity.io](https://www.sanity.io/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd photographer-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id"
   NEXT_PUBLIC_SANITY_DATASET="production"
   NEXT_PUBLIC_SANITY_API_VERSION="2024-01-01"

   # For write access (creating/updating content)
   SANITY_API_TOKEN="your-api-token"

   # For preview mode (optional)
   SANITY_PREVIEW_SECRET="your-secret-string"

   # For contact form
   RESEND_API_KEY="your-resend-api-key"
   CONTACT_EMAIL="your-email@example.com"
   ```

   **How to get these values:**
   - Run `npx sanity init` if you haven't already
   - Project ID: Found in your Sanity project settings
   - API Token: Generate in Sanity Manage → API → Tokens
   - Resend API Key: Sign up at [resend.com](https://resend.com) and create an API key

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will be available at:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Sanity Studio**: [http://localhost:3000/sanity](http://localhost:3000/sanity)

### First Time Setup

1. **Access Sanity Studio** at `http://localhost:3000/sanity`
2. **Create some tags** (e.g., "landscape", "portrait", "urban")
3. **Upload your first photo**:
   - Add a title
   - Upload an image
   - Optionally add alt text, caption, tags
   - Set display quality
   - Mark as featured (optional)
4. **Publish the photo**
5. **View your gallery** at `http://localhost:3000/photos`

## 📸 Features

### Content Management
- ✅ **Photo Documents** - Title, image, caption, alt text, metadata
- ✅ **Tag System** - Reusable tags with custom page styling
- ✅ **Featured Photos** - Highlight important work
- ✅ **Display Quality** - High/Medium/Low settings
- ✅ **Homepage Builder** - Hero, featured work, and about sections
- ✅ **Site Navigation** - Customizable menu via Sanity
- ✅ **Color Schemes** - Tag pages with custom themes
- ✅ **Custom Sorting** - Multiple sort options

### User Experience
- 🎨 **Interactive Lightbox** - Full-screen viewer with zoom, navigation, keyboard controls
- 📊 **Info Panel** - Photo metadata sidebar (desktop) and sheet (mobile)
- 🔖 **Dynamic Tag Pages** - Filterable galleries with pagination
- 📧 **Contact Form** - Integrated with Resend, rate limiting, honeypot protection
- 🎯 **Responsive Navigation** - Mobile-friendly header and footer

### Image Protection
- 🔒 **Right-Click Prevention** - Shows "Image protected" warning
- 🔒 **Drag & Drop Prevention** - Images can't be dragged
- 🔒 **Selection Prevention** - Text/image selection disabled
- 🔒 **CSS Protection** - Cross-browser user-drag disabled

### Performance
- ⚡ **Server Components** - Fast initial page load
- ⚡ **Image Optimization** - Automatic WebP/AVIF conversion
- ⚡ **Blur Placeholders** - Smooth loading experience
- ⚡ **Lazy Loading** - Images load as you scroll
- ⚡ **CDN Delivery** - Sanity's global CDN
- ⚡ **Pagination** - Efficient loading for large galleries

### Responsive Design
- 📱 **Mobile First** - 1 column layout, touch-optimized
- 💻 **Tablet** - 2 column layout
- 🖥️ **Desktop** - 3 column layout with sidebar

## 🎨 Customization

### Adjusting Image Quality

Edit `lib/imageBuilder.ts`:
```typescript
const qualityMap = {
  high: 80,   // Change these values
  medium: 60,
  low: 40,
}
```

### Changing Grid Layout

Edit `components/PhotoGrid.tsx`:
```tsx
// Current: 1/2/3 columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Example: 1/3/4 columns
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
```

### Adding New Schemas

1. Create schema file in `sanity/schemaTypes/`
2. Export from `sanity/schemaTypes/index.ts`
3. Restart dev server

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start Next.js dev server + Sanity Studio

# Building
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## 🔐 Security Notes

### Environment Variables
- ✅ `.env.local` is git-ignored (never committed)
- ✅ All secrets use `NEXT_PUBLIC_` or private env vars
- ✅ No hardcoded credentials in source code

### Before Committing
The following files are automatically ignored:
- `.env.local` - Your environment variables
- `schema.json` - Auto-generated schema
- `.next/` - Build output
- `node_modules/` - Dependencies

**Always verify before pushing:**
```bash
git status
# Ensure no .env files are staged
```

## 🚧 Roadmap

### Phase 1 ✅ (Completed)
- [x] Sanity CMS setup
- [x] Photo and Tag schemas
- [x] Image optimization helpers
- [x] Protected image component
- [x] Photo grid layout
- [x] Basic photo display page

### Phase 2 ✅ (Completed)
- [x] Homepage with featured photos
- [x] Interactive lightbox for full-size images
- [x] Tag filtering with dynamic pages
- [x] Contact form with rate limiting
- [x] Site navigation and footer
- [x] About section
- [x] Photo metadata panel

### Phase 3 🚀 (In Progress)
- [x] Pagination for tag galleries
- [ ] Search functionality
- [ ] Photo collections/galleries
- [ ] Blog integration

### Phase 4 🎯 (Future)
- [ ] Client proofing galleries (password protected)
- [ ] Shopping cart for prints
- [ ] Social media sharing
- [ ] Advanced image effects
- [ ] Visible watermark overlay

## 🐛 Troubleshooting

### Images not loading?
- Check `next.config.ts` has Sanity CDN in `remotePatterns`
- Verify `.env.local` has correct project ID
- Restart dev server after env changes

### Sanity Studio not working?
- Ensure you're logged in: `npx sanity login`
- Check Sanity project ID matches `.env.local`
- Clear browser cache

### TypeScript errors?
```bash
npx tsc --noEmit
# Fix any type issues
rm -rf .next
npm run dev
```

### Build failing?
```bash
rm -rf .next node_modules
npm install
npm run build
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Dylan Weinberger**

---

**Built with ❤️ using Next.js 16 and Sanity CMS**
