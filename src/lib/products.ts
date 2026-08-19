import { createServerFn } from "@tanstack/react-start";
import { sanity, urlFor } from "./sanity";
import { fallbackProducts, fallbackCategories, type Category, type Product } from "@/data/products";

export type { Product, Category };

/** Everything the storefront needs to render, fetched once per request. */
export type Catalog = {
  products: Product[];
  categories: Category[];
  /** False when the data came from the bundled seed instead of Sanity. */
  fromSanity: boolean;
};

type SanityImage = { asset?: { _ref?: string } } | null | undefined;

type RawProduct = {
  _id: string;
  id?: string | null;
  name?: string | null;
  price?: number | null;
  compareAt?: number | null;
  category?: string | null;
  gender?: string | null;
  rating?: number | null;
  reviews?: number | null;
  colors?: { name?: string | null; hex?: string | null }[] | null;
  sizes?: string[] | null;
  images?: SanityImage[] | null;
  badge?: string | null;
  isNew?: boolean | null;
  isBestseller?: boolean | null;
  description?: string | null;
};

const PRODUCT_FIELDS = /* groq */ `
  _id,
  "id": coalesce(slug.current, _id),
  name,
  price,
  compareAt,
  "category": category->slug.current,
  gender,
  rating,
  reviews,
  colors[]{ name, hex },
  sizes,
  images,
  badge,
  isNew,
  isBestseller,
  description
`;

const PRODUCTS_QUERY = /* groq */ `
  *[_type == "product" && !(_id in path("drafts.**"))] | order(coalesce(order, 999) asc, _createdAt desc) {
    ${PRODUCT_FIELDS}
  }
`;

const CATEGORIES_QUERY = /* groq */ `
  *[_type == "category" && !(_id in path("drafts.**"))] | order(coalesce(order, 999) asc, name asc) {
    "slug": slug.current,
    name
  }
`;

const PRODUCT_BY_ID_QUERY = /* groq */ `
  *[_type == "product" && !(_id in path("drafts.**")) && (slug.current == $id || _id == $id)][0] {
    ${PRODUCT_FIELDS}
  }
`;

const GENDERS = new Set(["men", "women", "unisex"]);
const BADGES = new Set(["New", "Sale", "Bestseller"]);

function normalise(raw: RawProduct): Product | null {
  const id = raw.id ?? raw._id;
  if (!id || !raw.name) return null;

  const images = (raw.images ?? [])
    .map((image) => (image ? urlFor(image, 900) : null))
    .filter((url): url is string => Boolean(url));

  const colors = (raw.colors ?? [])
    .filter((c) => c?.name && c?.hex)
    .map((c) => ({ name: c.name as string, hex: c.hex as string }));

  const gender =
    raw.gender && GENDERS.has(raw.gender) ? (raw.gender as Product["gender"]) : "unisex";
  const badge = raw.badge && BADGES.has(raw.badge) ? (raw.badge as Product["badge"]) : undefined;

  return {
    id,
    name: raw.name,
    price: raw.price ?? 0,
    compareAt: raw.compareAt ?? undefined,
    category: raw.category ?? "uncategorised",
    gender,
    rating: raw.rating ?? 5,
    reviews: raw.reviews ?? 0,
    // Every consumer indexes colors[0]/sizes[0], so never hand back empty arrays.
    colors: colors.length ? colors : [{ name: "Default", hex: "#111111" }],
    sizes: raw.sizes?.length ? raw.sizes : ["One Size"],
    images: images.length ? images : ["/logo-white.png"],
    badge,
    isNew: raw.isNew ?? undefined,
    isBestseller: raw.isBestseller ?? undefined,
    description: raw.description ?? "",
  };
}

const seedCatalog = (): Catalog => ({
  products: fallbackProducts,
  categories: fallbackCategories,
  fromSanity: false,
});

/** Categories that appear on at least one product, derived when none are authored. */
function deriveCategories(products: Product[]): Category[] {
  const slugs = [...new Set(products.map((p) => p.category))];
  return slugs.map((slug) => ({
    slug,
    name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
  }));
}

/**
 * Loads the full catalogue. Falls back to the bundled seed data when Sanity is
 * unconfigured, unreachable, or simply empty, so the storefront never renders blank.
 */
export async function getCatalog(): Promise<Catalog> {
  if (!sanity) return seedCatalog();

  try {
    const [rawProducts, rawCategories] = await Promise.all([
      sanity.fetch<RawProduct[]>(PRODUCTS_QUERY),
      sanity.fetch<Category[]>(CATEGORIES_QUERY),
    ]);

    const products = (rawProducts ?? []).map(normalise).filter((p): p is Product => p !== null);

    if (!products.length) return seedCatalog();

    const categories = (rawCategories ?? []).filter((c) => c?.slug && c?.name);

    return {
      products,
      categories: categories.length ? categories : deriveCategories(products),
      fromSanity: true,
    };
  } catch (error) {
    console.error("[sanity] failed to load catalogue, using seed data:", error);
    return seedCatalog();
  }
}

/** Loads a single product by slug (or document id), plus its related pieces. */
export async function getProductWithRelated(
  id: string,
): Promise<{ product: Product; related: Product[] } | null> {
  if (!sanity) {
    const product = fallbackProducts.find((p) => p.id === id);
    if (!product) return null;
    return { product, related: relatedTo(product, fallbackProducts) };
  }

  try {
    const raw = await sanity.fetch<RawProduct | null>(PRODUCT_BY_ID_QUERY, { id });
    const product = raw ? normalise(raw) : null;
    if (!product) return null;

    const { products } = await getCatalog();
    return { product, related: relatedTo(product, products) };
  } catch (error) {
    console.error(`[sanity] failed to load product "${id}", using seed data:`, error);
    const product = fallbackProducts.find((p) => p.id === id);
    if (!product) return null;
    return { product, related: relatedTo(product, fallbackProducts) };
  }
}

function relatedTo(product: Product, pool: Product[]): Product[] {
  const sameCategory = pool.filter((p) => p.id !== product.id && p.category === product.category);
  const filler = pool.filter((p) => p.id !== product.id && p.category !== product.category);
  return [...sameCategory, ...filler].slice(0, 4);
}

/**
 * Sanity's API rejects browser requests from origins that aren't in the project's
 * CORS allowlist, so the loaders must never query it from the client. These server
 * functions keep every Sanity call on the server: the initial SSR render calls the
 * handler directly, and client-side navigations fetch it over RPC.
 */
export const fetchCatalog = createServerFn({ method: "GET" }).handler(() => getCatalog());

export const fetchProductWithRelated = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(({ data }) => getProductWithRelated(data));
