# Path of Glory

Storefront for Path of Glory, built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Products (Sanity CMS)

Products and categories come from Sanity. Copy `.env.example` to `.env` and set
your project id:

```
VITE_SANITY_PROJECT_ID=your-project-id
VITE_SANITY_DATASET=production
VITE_SANITY_USE_CDN=false
```

Restart the dev server after changing `.env`.

**Content freshness.** With `VITE_SANITY_USE_CDN=false` (the default) a Studio
edit shows on the site within a few seconds. Setting it to `true` serves queries
from Sanity's CDN — faster and cheaper at high traffic, but a warm cached query
can lag a published edit by ~60s. Either way the root route caches the catalogue
for 60s (`staleTime` in `src/routes/__root.tsx`), so the site makes at most one
catalogue query per minute.

Without a project id — or if Sanity is unreachable — the site falls back to the
bundled seed catalogue in `src/data/products.ts`, so it always renders.

The Studio (schemas, content editing, and a seed script that imports the 12
starter products) lives in [`sanity/`](./sanity/README.md).

| File | Role |
| --- | --- |
| `src/lib/sanity.ts` | Sanity client + image url builder |
| `src/lib/products.ts` | GROQ queries, normalisation, seed fallback |
| `src/lib/catalog.tsx` | Shares the catalogue loaded by the root route |
| `src/data/products.ts` | Seed catalogue and the `Product` type |

## Brand assets

`public/logo.png` is the supplied artwork. The derived files it is used through —
`logo-white.png`, `logo-black.png`, `favicon.png`, `apple-touch-icon.png` and
`og-image.png` — are wired up in `src/lib/brand.ts`, which is also the single
place the brand name is written.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
- Sanity
