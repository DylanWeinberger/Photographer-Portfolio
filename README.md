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

### Image Optimization
- **Next.js Image Component** - Automatic image optimization
- **Sanity Image URLs** - CDN-powered image transformations
- **WebP/AVIF Support** - Modern image formats for better performance

## 📁 Project Structure

```
photographer-portfolio/
├── app/                      # Next.js App Router
│   ├── photos/              # Photo gallery page
│   │   └── page.tsx         # Server component with data fetching
│   ├── sanity/              # Sanity Studio route
│   │   └── [[...tool]]/
│   └── globals.css          # Global styles + protection CSS
├── components/              # React components
│   ├── ProtectedImage.tsx   # Image with right-click protection
│   └── PhotoGrid.tsx        # Responsive grid layout
├── lib/                     # Utility functions
│   └── imageBuilder.ts      # Sanity image URL helpers
├── sanity/                  # Sanity configuration
│   ├── env.ts              # Environment variable management
│   ├── lib/
│   │   ├── client.ts       # Sanity client setup
│   │   └── image.ts        # Image URL builder
│   ├── schemaTypes/        # Content schemas
│   │   ├── index.ts        # Schema exports
│   │   ├── photo.ts        # Photo document type
│   │   └── tag.ts          # Tag document type
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
   ```

   **How to get these values:**
   - Run `npx sanity init` if you haven't already
   - Project ID: Found in your Sanity project settings
   - API Token: Generate in Sanity Manage → API → Tokens

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
- ✅ **Photo Documents** - Title, image, caption, alt text
- ✅ **Tag System** - Reusable, organized tags
- ✅ **Featured Photos** - Highlight important work
- ✅ **Display Quality** - High/Medium/Low settings
- ✅ **Watermark Toggle** - Per-photo watermark control
- ✅ **Custom Sorting** - Multiple sort options

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

### Responsive Design
- 📱 **Mobile First** - 1 column layout
- 💻 **Tablet** - 2 column layout
- 🖥️ **Desktop** - 3 column layout

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

### Phase 2 🚀 (In Progress)
- [ ] Homepage with featured photos
- [ ] Individual photo detail pages
- [ ] Tag filtering
- [ ] Search functionality

### Phase 3 📅 (Planned)
- [ ] Lightbox/modal for full-size images
- [ ] Visible watermark overlay
- [ ] Photo collections/galleries
- [ ] Contact form
- [ ] About page

### Phase 4 🎯 (Future)
- [ ] Client proofing galleries (password protected)
- [ ] Shopping cart for prints
- [ ] Blog integration
- [ ] Social media sharing
- [ ] Advanced image effects

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
