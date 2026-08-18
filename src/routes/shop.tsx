import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useCatalog } from "@/lib/catalog";
import { BRAND } from "@/lib/brand";
import { SlidersHorizontal } from "lucide-react";

const search = z.object({ category: z.string().optional(), sort: z.string().optional() });

export const Route = createFileRoute("/shop")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: `Shop All — ${BRAND.name}` },
      { name: "description", content: `Shop the full ${BRAND.name} collection: hoodies, jackets, dresses, denim, sneakers and more.` },
      { property: "og:title", content: `Shop All — ${BRAND.name}` },
      { property: "og:description", content: `Shop the full ${BRAND.name} collection.` },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { products, categories } = useCatalog();
  const { category } = useSearch({ from: "/shop" });
  const [active, setActive] = useState<string | undefined>(category);
  const [sort, setSort] = useState("featured");

  const list = useMemo(() => {
    let l = active ? products.filter((p) => p.category === active || p.gender === active.replace("s", "") || (active === "mens" && p.gender === "men") || (active === "womens" && p.gender === "women")) : products;
    if (sort === "price-asc") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "newest") l = [...l].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    return l;
  }, [active, sort, products]);

  return (
    <Layout>
      <section className="container-x pt-10 pb-6 border-b border-border">
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">Shop</div>
        <h1 className="text-4xl md:text-6xl">The Full Collection</h1>
        <p className="mt-3 text-muted-foreground max-w-xl">Considered essentials, seasonal capsules, and the pieces we can&rsquo;t stop wearing.</p>
      </section>

      <section className="container-x py-8 flex flex-col md:flex-row md:items-center gap-4 md:justify-between border-b border-border">
        <div className="flex gap-2 overflow-x-auto -mx-1 px-1">
          <button onClick={() => setActive(undefined)} className={`shrink-0 px-4 h-9 text-sm rounded-full border transition-colors ${!active ? "bg-ink text-white border-ink" : "border-border hover:border-ink"}`}>All</button>
          {categories.map((c) => (
            <button key={c.slug} onClick={() => setActive(c.slug)} className={`shrink-0 px-4 h-9 text-sm rounded-full border transition-colors ${active === c.slug ? "bg-ink text-white border-ink" : "border-border hover:border-ink"}`}>
              {c.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-9 px-3 rounded-full border border-border bg-background text-sm focus:outline-none focus:border-ink">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </section>

      <section className="container-x py-12">
        {list.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">No products match that filter.</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-6">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </Layout>
  );
}
