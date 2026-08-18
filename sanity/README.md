# Path of Glory — Sanity Studio

The CMS behind the storefront. Products and categories authored here render on
the site immediately; the app falls back to the bundled seed catalogue whenever
Sanity is not configured or unreachable.

## 1. Create the project

```sh
cd sanity
npm install
npx sanity login
npx sanity init --create-project "Path of Glory" --dataset production
```

`sanity init` prints a **project ID** — you need it in two places:

| File                 | Variable                   |
| -------------------- | -------------------------- |
| `sanity/.env`        | `SANITY_STUDIO_PROJECT_ID` |
| `../.env` (app root) | `VITE_SANITY_PROJECT_ID`   |

Copy `.env.example` to `.env` in both folders and fill them in.

## 2. Run the Studio

```sh
npm run dev      # http://localhost:3333
```

## 3. Seed the starter catalogue (optional)

Loads the 12 demo products and 9 categories, uploading each image as a real
Sanity asset. Add a write token (Sanity manage → API → Tokens → Editor) to
`sanity/.env`, then:

```sh
npm run seed
```

The project id and dataset are read from `sanity/.env`, falling back to the app's
root `.env`. Re-running is safe — documents use fixed ids, images are deduped,
and an unreachable source image is skipped with a warning rather than aborting.

## 4. Allow the storefront to read the dataset

Public datasets need no token. If yours is private, add the site origin under
**API → CORS origins** in sanity.io/manage.

## Deploying the Studio

```sh
npm run deploy   # hosts it at <your-project>.sanity.studio
```

## Content model

- **product** — name, slug (the `/products/<slug>` url), description, images,
  price, compare-at price, category reference, gender, sizes, colours
  (name + hex), badge, New/Bestseller flags, rating, review count, sort order.
- **category** — name, slug (used by `/shop?category=<slug>`), sort order.

The storefront reads these in `src/lib/products.ts`; adding a field there and to
the GROQ projection is all it takes to surface new content.
