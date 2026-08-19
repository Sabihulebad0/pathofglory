import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { fetchProductWithRelated, type Product } from "@/lib/products";
import { BRAND } from "@/lib/brand";
import { useCart } from "@/lib/cart";
import { Heart, Minus, Plus, ShoppingBag, Star, Truck, RefreshCw, ShieldCheck } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/products/$id")({
  loader: async ({ params }) => {
    const result = await fetchProductWithRelated({ data: params.id });
    if (!result) throw notFound();
    return result;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product.name ?? "Product"} — ${BRAND.name}` },
      { name: "description", content: loaderData?.product.description ?? "" },
      { property: "og:title", content: `${loaderData?.product.name ?? "Product"} — ${BRAND.name}` },
      { property: "og:description", content: loaderData?.product.description ?? "" },
      { property: "og:image", content: loaderData?.product.images[0] ?? BRAND.ogImage },
      { name: "twitter:image", content: loaderData?.product.images[0] ?? BRAND.ogImage },
    ],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { product, related } = Route.useLoaderData();
  // Keyed so the colour/size/image selections reset when navigating between products.
  return <ProductDetailView key={product.id} product={product} related={related} />;
}

function ProductDetailView({ product, related }: { product: Product; related: Product[] }) {
  const { add, toggleWish, wishlist } = useCart();
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [mainImg, setMainImg] = useState(product.images[0]);
  const wished = wishlist.includes(product.id);

  return (
    <Layout>
      <section className="container-x pt-8">
        <div className="text-xs text-muted-foreground flex gap-2">
          <Link to="/" className="hover:text-ink">Home</Link><span>/</span>
          <Link to="/shop" className="hover:text-ink">Shop</Link><span>/</span>
          <span className="text-ink">{product.name}</span>
        </div>
      </section>

      <section className="container-x py-10 grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <div className="rounded-2xl overflow-hidden bg-secondary aspect-[4/5] mb-4">
            <img src={mainImg} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.images.slice(0, 4).map((im, i) => (
              <button key={im + i} onClick={() => setMainImg(im)} className={`rounded-xl overflow-hidden aspect-square bg-secondary border-2 transition-colors ${mainImg === im ? "border-ink" : "border-transparent"}`}>
                <img src={im} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:pl-4">
          {product.badge && (
            <span className={`inline-block text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full font-medium mb-4 ${
              product.badge === "Sale" ? "bg-brand text-brand-foreground" :
              product.badge === "New" ? "bg-ink text-white" : "bg-secondary text-ink"
            }`}>{product.badge}</span>
          )}
          <h1 className="text-3xl md:text-5xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-medium">${product.price}</span>
              {product.compareAt && <span className="text-muted-foreground line-through">${product.compareAt}</span>}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <div className="flex text-ink">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? "fill-current" : ""}`} />)}
              </div>
              {product.rating} · {product.reviews} reviews
            </div>
          </div>
          <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="mt-8">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Color · <span className="text-ink">{color}</span></div>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button key={c.name} onClick={() => setColor(c.name)} className={`w-9 h-9 rounded-full border-2 transition-all ${color === c.name ? "border-ink scale-110" : "border-border"}`} style={{ background: c.hex }} aria-label={c.name} />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground mb-3">
              <span>Size</span><button className="hover:text-ink">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`min-w-12 h-11 px-4 rounded-full border text-sm transition-colors ${size === s ? "bg-ink text-white border-ink" : "border-border hover:border-ink"}`}>{s}</button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-stretch gap-3">
            <div className="flex items-center border border-border rounded-full">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-11 h-12 grid place-items-center hover:text-brand"><Minus className="w-4 h-4" /></button>
              <span className="w-8 text-center">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-11 h-12 grid place-items-center hover:text-brand"><Plus className="w-4 h-4" /></button>
            </div>
            <button onClick={() => add({ productId: product.id, size, color, quantity: qty })} className="flex-1 h-12 rounded-full bg-ink text-white text-sm font-medium hover:bg-brand transition-colors inline-flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
            <button onClick={() => toggleWish(product.id)} className={`w-12 h-12 rounded-full border grid place-items-center transition-colors ${wished ? "border-brand text-brand" : "border-border hover:border-ink"}`}>
              <Heart className={`w-4 h-4 ${wished ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 text-xs">
            {[[Truck, "Free ship $150+"], [RefreshCw, "30-day returns"], [ShieldCheck, "Lifetime repairs"]].map(([I, t], i) => {
              const Icon = I as typeof Truck;
              return (
                <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-secondary">
                  <Icon className="w-4 h-4 text-brand" /><span>{t as string}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x py-20 border-t border-border">
          <h2 className="text-3xl md:text-4xl mb-10">You may also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </Layout>
  );
}
