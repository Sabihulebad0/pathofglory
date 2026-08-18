import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/lib/catalog";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/new-arrivals")({
  head: () => ({
    meta: [
      { title: `New Arrivals — ${BRAND.name}` },
      { name: "description", content: `The latest drops from ${BRAND.name}. New season silhouettes, freshly landed.` },
      { property: "og:title", content: `New Arrivals — ${BRAND.name}` },
      { property: "og:description", content: `The latest drops from ${BRAND.name}.` },
    ],
  }),
  component: NewArrivals,
});

function NewArrivals() {
  const products = useProducts();
  const list = products.filter((p) => p.isNew).concat(products.slice(0, 4));
  return (
    <Layout>
      <section className="container-x pt-14 pb-10 text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-brand mb-3">Just Landed</div>
        <h1 className="text-4xl md:text-6xl">New Arrivals</h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Fresh silhouettes, seasonal fabrics, and the pieces defining the season ahead.</p>
      </section>
      <section className="container-x pb-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-6">
          {list.map((p, i) => <ProductCard key={p.id + i} product={p} />)}
        </div>
      </section>
    </Layout>
  );
}
