/**
 * Shape of a storefront product. Documents authored in Sanity are normalised
 * into this type by `src/lib/products.ts`, so components never see raw GROQ
 * results and the bundled seed catalogue below stays a valid fallback.
 */
export type Product = {
  id: string;
  name: string;
  price: number;
  compareAt?: number;
  category: string;
  gender: "men" | "women" | "unisex";
  rating: number;
  reviews: number;
  colors: { name: string; hex: string }[];
  sizes: string[];
  images: string[];
  badge?: "New" | "Sale" | "Bestseller";
  isNew?: boolean;
  isBestseller?: boolean;
  description: string;
};

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export type Category = { slug: string; name: string };

/** Used when Sanity is not configured or unreachable. */
export const fallbackCategories: Category[] = [
  { slug: "mens", name: "Men's Fashion" },
  { slug: "womens", name: "Women's Fashion" },
  { slug: "hoodies", name: "Hoodies" },
  { slug: "tshirts", name: "T-Shirts" },
  { slug: "jackets", name: "Jackets" },
  { slug: "jeans", name: "Jeans" },
  { slug: "dresses", name: "Dresses" },
  { slug: "sneakers", name: "Sneakers" },
  { slug: "accessories", name: "Accessories" },
];

const C = {
  black: { name: "Black", hex: "#000000" },
  white: { name: "White", hex: "#FFFFFF" },
  blue: { name: "Cobalt", hex: "#1E5EFF" },
  cream: { name: "Cream", hex: "#F5F0E6" },
  grey: { name: "Grey", hex: "#8A8A8A" },
  navy: { name: "Navy", hex: "#0B1B3B" },
  olive: { name: "Olive", hex: "#5B6B3A" },
  camel: { name: "Camel", hex: "#B48C63" },
};

const S = ["XS", "S", "M", "L", "XL"];
const SH = ["7", "8", "9", "10", "11", "12"];

/** Used when Sanity is not configured or unreachable. */
export const fallbackProducts: Product[] = [
  {
    id: "atlas-oversized-hoodie",
    name: "Atlas Oversized Hoodie",
    price: 148, compareAt: 189,
    category: "hoodies", gender: "unisex",
    rating: 4.8, reviews: 214,
    colors: [C.black, C.cream, C.blue],
    sizes: S,
    images: [img("photo-1556821840-3a63f95609a7"), img("photo-1620799140408-edc6dcb6d633"), img("photo-1620799139507-2a76f79a2f4d")],
    badge: "Sale", isBestseller: true,
    description: "A relaxed heavyweight hoodie in brushed loop-back cotton. Dropped shoulders, ribbed cuffs, and a lined hood.",
  },
  {
    id: "linen-relaxed-shirt",
    name: "Meridian Linen Shirt",
    price: 128,
    category: "mens", gender: "men",
    rating: 4.7, reviews: 132,
    colors: [C.white, C.cream, C.navy],
    sizes: S,
    images: [img("photo-1602810318383-e386cc2a3ccf"), img("photo-1603252109303-2751441dd157")],
    isNew: true, badge: "New",
    description: "Airy European linen with a soft camp collar and mother-of-pearl buttons.",
  },
  {
    id: "silk-slip-dress",
    name: "Aurora Silk Slip Dress",
    price: 245,
    category: "dresses", gender: "women",
    rating: 4.9, reviews: 89,
    colors: [C.black, C.navy, C.cream],
    sizes: S,
    images: [img("photo-1595777457583-95e059d581b8"), img("photo-1618932260643-eee4a2f652a6")],
    isNew: true, badge: "New",
    description: "Bias-cut silk with adjustable straps and a whisper-fine hem.",
  },
  {
    id: "raw-selvedge-jeans",
    name: "Warden Selvedge Jeans",
    price: 168,
    category: "jeans", gender: "men",
    rating: 4.6, reviews: 301,
    colors: [C.navy, C.black],
    sizes: ["28", "30", "32", "34", "36"],
    images: [img("photo-1541099649105-f69ad21f3246"), img("photo-1602293589930-45aad59ba3ab")],
    isBestseller: true,
  badge: "Bestseller",
    description: "13.5oz Japanese selvedge denim, straight leg, unwashed for personal fade.",
  },
  {
    id: "cashmere-crew-tee",
    name: "Halcyon Cashmere Tee",
    price: 195,
    category: "tshirts", gender: "unisex",
    rating: 4.8, reviews: 76,
    colors: [C.cream, C.grey, C.black],
    sizes: S,
    images: [img("photo-1521572163474-6864f9cf17ab"), img("photo-1583743814966-8936f5b7be1a")],
    description: "Pure Mongolian cashmere in a relaxed crew silhouette.",
  },
  {
    id: "wool-topcoat",
    name: "Sable Wool Topcoat",
    price: 620, compareAt: 780,
    category: "jackets", gender: "women",
    rating: 4.9, reviews: 54,
    colors: [C.camel, C.black, C.navy],
    sizes: S,
    images: [img("photo-1539533018447-63fcce2678e3"), img("photo-1591047139829-d91aecb6caea")],
    badge: "Sale", isBestseller: true,
    description: "Double-faced Italian wool with concealed placket and drop shoulders.",
  },
  {
    id: "runner-low-sneaker",
    name: "Course Runner Low",
    price: 189,
    category: "sneakers", gender: "unisex",
    rating: 4.7, reviews: 442,
    colors: [C.white, C.black, C.blue],
    sizes: SH,
    images: [img("photo-1542291026-7eec264c27ff"), img("photo-1600185365483-26d7a4cc7519")],
    isBestseller: true, badge: "Bestseller",
    description: "Italian leather runner on a sculpted rubber sole.",
  },
  {
    id: "leather-crossbody",
    name: "Aria Leather Crossbody",
    price: 340,
    category: "accessories", gender: "women",
    rating: 4.8, reviews: 121,
    colors: [C.black, C.camel],
    sizes: ["One Size"],
    images: [img("photo-1548036328-c9fa89d128fa"), img("photo-1590874103328-eac38a683ce7")],
    isNew: true, badge: "New",
    description: "Vegetable-tanned leather with a solid brass clasp.",
  },
  {
    id: "quilted-liner-jacket",
    name: "Nord Quilted Liner",
    price: 285,
    category: "jackets", gender: "men",
    rating: 4.6, reviews: 88,
    colors: [C.olive, C.black, C.navy],
    sizes: S,
    images: [img("photo-1548883354-94bcfe321cbb"), img("photo-1520975916090-3105956dac38")],
    description: "Diamond-quilted liner jacket with recycled down.",
  },
  {
    id: "poplin-midi-dress",
    name: "Sonder Poplin Midi",
    price: 175,
    category: "dresses", gender: "women",
    rating: 4.5, reviews: 63,
    colors: [C.white, C.blue],
    sizes: S,
    images: [img("photo-1572804013309-59a88b7e92f1"), img("photo-1495385794356-15371f348c31")],
    isNew: true, badge: "New",
    description: "Crisp cotton poplin with a fluid midi silhouette.",
  },
  {
    id: "wide-leg-trouser",
    name: "Vanta Wide-Leg Trouser",
    price: 165,
    category: "womens", gender: "women",
    rating: 4.7, reviews: 97,
    colors: [C.black, C.cream],
    sizes: S,
    images: [img("photo-1594633312681-425c7b97ccd1")],
    description: "High-rise pleat-front trousers in fluid wool crepe.",
  },
  {
    id: "merino-zip-hoodie",
    name: "Kite Merino Zip Hoodie",
    price: 220,
    category: "hoodies", gender: "unisex",
    rating: 4.8, reviews: 118,
    colors: [C.navy, C.grey, C.black],
    sizes: S,
    images: [img("photo-1618354691373-d851c5c3a990"), img("photo-1512436991641-6745cdb1723f")],
    isBestseller: true, badge: "Bestseller",
    description: "Fine-gauge merino hoodie with YKK zip and thumbholes.",
  },
];
