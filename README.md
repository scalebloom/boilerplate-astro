# Astro Boilerplate

## Logo

The logo exists in two places:

- **`public/logo.svg`** - Static file for structured data/SEO (used by `LocalBusinessSchema.astro`)
- **`src/components/logo.astro`** - Inline SVG component with hover animation (used in Header and Footer)

Both files must be updated when changing the logo. The duplication is intentional: inline SVG is required for CSS animations, while the public file provides a URL for search engines.

## Schema (Structured Data)

[Layout.astro](src/layouts/Layout.astro) imports two Schema.org components for SEO from [src/components/schema/](src/components/schema/). Both components rely on [src/config/site.ts](src/config/site.ts) for site data.

### BreadcrumbSchema

Automatically included on **all pages**. Generates breadcrumb schema based on the current URL path.

### LocalBusinessSchema

Opt-in per page. Used it on 1 page such as home, about, or contact — not on every page. Include it by passing the prop to Layout:

```astro
<Layout
  title="Home"
  description="Welcome"
  includeLocalBusinessSchema={true}
>
```

## Images

This boilerplate uses Astro's built-in image optimization with responsive images enabled globally.

### Global Configuration

In [astro.config.mjs](astro.config.mjs):

```js
image: {
  responsiveStyles: true,
  layout: 'constrained',
}
```

- **`layout: 'constrained'`** - Images scale down on smaller screens but won't exceed their specified dimensions
- **`responsiveStyles: true`** - Adds global CSS for responsive behavior

### Using Images

Import and use the `<Image>` component from `astro:assets`:

```astro
---
import { Image } from 'astro:assets';
import photo from '../assets/photo.jpg';
---
<Image src={photo} alt="Description" width={800} height={600} />
```

Images in `src/` are optimized (WebP conversion, srcset generation). Images in `public/` are served as-is.

## Redirects

For Netlify or Cloudflare Pages deployments, create `public/_redirects`:

```text
/old-path    /new-path    301
/another     https://example.com    302
```
