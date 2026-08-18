/**
 * Seeds the Sanity dataset with the storefront's starter catalogue
 * (sanity/seed/catalog.json), uploading every product image as a real asset.
 *
 * Put SANITY_WRITE_TOKEN in sanity/.env (or the app's root .env), then run from
 * the sanity/ folder:
 *   npm run seed
 *
 * The project id and dataset are picked up from sanity/.env, falling back to the
 * app's root .env (VITE_SANITY_PROJECT_ID), so there is only ever one to set.
 *
 * Safe to re-run: documents use deterministic ids and are replaced, and images
 * already present in the dataset are reused rather than uploaded twice.
 */
import { createClient } from "@sanity/client";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(readFileSync(resolve(here, "../seed/catalog.json"), "utf8"));

/** Minimal .env reader — real env vars always win. */
function loadEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!match) continue;
    const value = match[2].trim().replace(/^["']|["']$/g, "");
    if (value && !process.env[match[1]]) process.env[match[1]] = value;
  }
}

loadEnv(resolve(here, "../.env"));
loadEnv(resolve(here, "../../.env"));

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  process.env.VITE_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.SANITY_DATASET ||
  process.env.VITE_SANITY_DATASET ||
  "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  console.error("Missing project id. Set VITE_SANITY_PROJECT_ID in the app's .env.");
  process.exit(1);
}
if (!token) {
  console.error(
    "Missing SANITY_WRITE_TOKEN.\n" +
      `Create one with Editor rights at https://sanity.io/manage/project/${projectId}/api#tokens\n` +
      "then add it to sanity/.env as:  SANITY_WRITE_TOKEN=sk...",
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: "2024-10-01", token, useCdn: false });

/** Upload an image once per source url; reuse the asset on re-runs. */
const uploaded = new Map();
async function uploadImage(url, label) {
  if (uploaded.has(url)) return uploaded.get(url);

  const existing = await client.fetch(
    `*[_type == "sanity.imageAsset" && source.id == $id][0]._id`,
    { id: url },
  );
  if (existing) {
    uploaded.set(url, existing);
    return existing;
  }

  const response = await fetch(url);
  if (!response.ok) {
    // A dead source url should not abort the whole import.
    console.warn(`    ! skipped image (${response.status}): ${url}`);
    uploaded.set(url, null);
    return null;
  }
  const buffer = Buffer.from(await response.arrayBuffer());

  const asset = await client.assets.upload("image", buffer, {
    filename: `${label}.jpg`,
    // `source` lets the lookup above dedupe on re-runs.
    source: { name: "seed", id: url, url },
  });
  uploaded.set(url, asset._id);
  return asset._id;
}

const imageRef = (assetId, key) => ({
  _type: "image",
  _key: key,
  asset: { _type: "reference", _ref: assetId },
});

async function run() {
  console.log(`Seeding ${projectId}/${dataset}…`);

  const categoryDocs = catalog.categories.map((c, i) => ({
    _id: `category-${c.slug}`,
    _type: "category",
    name: c.name,
    slug: { _type: "slug", current: c.slug },
    order: i + 1,
  }));

  const tx = client.transaction();
  categoryDocs.forEach((doc) => tx.createOrReplace(doc));
  await tx.commit();
  console.log(`  ${categoryDocs.length} categories`);

  const knownCategories = new Set(catalog.categories.map((c) => c.slug));

  for (const [index, p] of catalog.products.entries()) {
    const assetIds = [];
    for (const [i, url] of (p.images ?? []).entries()) {
      const assetId = await uploadImage(url, `${p.id}-${i + 1}`);
      if (assetId) assetIds.push(assetId);
    }

    const doc = {
      _id: `product-${p.id}`,
      _type: "product",
      name: p.name,
      slug: { _type: "slug", current: p.id },
      description: p.description ?? "",
      price: p.price,
      gender: p.gender ?? "unisex",
      rating: p.rating ?? 5,
      reviews: p.reviews ?? 0,
      sizes: p.sizes ?? [],
      colors: (p.colors ?? []).map((c, i) => ({ _type: "color", _key: `c${i}`, ...c })),
      images: assetIds.map((id, i) => imageRef(id, `img${i}`)),
      order: index + 1,
    };
    if (p.compareAt != null) doc.compareAt = p.compareAt;
    if (p.badge) doc.badge = p.badge;
    if (p.isNew) doc.isNew = true;
    if (p.isBestseller) doc.isBestseller = true;
    if (knownCategories.has(p.category)) {
      doc.category = { _type: "reference", _ref: `category-${p.category}` };
    }

    await client.createOrReplace(doc);
    console.log(`  ${index + 1}/${catalog.products.length} ${p.name}`);
  }

  console.log("Done. Set VITE_SANITY_PROJECT_ID in the app's .env and restart the dev server.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
