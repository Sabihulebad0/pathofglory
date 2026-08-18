import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Truck, RefreshCw, ShieldCheck, Sparkles, Star, Instagram } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useProducts } from "@/lib/catalog";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${BRAND.name} — Considered Fashion Essentials` },
      { name: "description", content: "Modern luxury basics and elevated wardrobe staples. Shop hoodies, jackets, dresses, sneakers and more." },
      { property: "og:title", content: `${BRAND.name} — Considered Fashion Essentials` },
      { property: "og:description", content: "Modern luxury basics and elevated wardrobe staples." },
    ],
  }),
  component: Home,
});

const heroImg = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80";
const editorialA = "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80";
const editorialB = "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=80";
const promoImg = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=80";

function Home() {
  const products = useProducts();
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const trending = products.slice(2, 6);
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <Layout>
      {/* HERO */}
      <section className="relative">
        <div className="relative h-[85vh] min-h-[560px] w-full overflow-hidden">
          <img src={heroImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
          <div className="container-x relative z-10 h-full flex items-end pb-16 md:pb-24">
            <div className="max-w-2xl text-white fade-up">
              <span className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-white/80 mb-5">
                <span className="w-8 h-px bg-white/60" /> Spring / Summer 2026
              </span>
              <h1 className="text-5xl sm:text-6xl md:text-7xl leading-[1.02] font-medium">
                Quiet luxury,<br /><em className="font-normal">loudly considered.</em>
              </h1>
              <p className="mt-6 text-base md:text-lg text-white/85 max-w-lg">
                A curated wardrobe of essentials — sculpted silhouettes, honest materials, and the kind of finish you feel before you see.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/shop" className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-white text-ink font-medium text-sm hover:bg-brand hover:text-white transition-colors">
                  Shop the Collection <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/new-arrivals" className="inline-flex items-center gap-2 h-12 px-7 rounded-full border border-white/50 text-white text-sm hover:bg-white/10 transition-colors">
                  New Arrivals
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE STRIP */}
      <section className="border-y border-border">
        <div className="container-x grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {[
            { I: Truck, t: "Complimentary Shipping", s: "On orders over $150" },
            { I: RefreshCw, t: "Easy 30-Day Returns", s: "Effortless & free" },
            { I: ShieldCheck, t: "Lifetime Repairs", s: "Because things should last" },
            { I: Sparkles, t: "Ethically Crafted", s: "Family-run ateliers" },
          ].map(({ I, t, s }) => (
            <div key={t} className="py-6 px-4 flex items-center gap-3 justify-center text-center md:text-left">
              <I className="w-5 h-5 text-brand shrink-0" />
              <div>
                <div className="text-sm font-medium">{t}</div>
                <div className="text-xs text-muted-foreground">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED COLLECTIONS */}
      <section className="container-x py-20 md:py-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">Featured</div>
            <h2 className="text-3xl md:text-5xl">Explore Collections</h2>
          </div>
          <Link to="/shop" className="hidden md:inline-flex items-center gap-2 text-sm hover:text-brand transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { name: "Men's Fashion", slug: "mens", img: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80" },
            { name: "Women's Fashion", slug: "womens", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80" },
            { name: "Outerwear", slug: "jackets", img: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=800&q=80" },
            { name: "Sneakers", slug: "sneakers", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80" },
          ].map((c) => (
            <Link key={c.slug} to="/shop" search={{ category: c.slug } as never} className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-secondary">
              <img src={c.img} alt={c.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="text-lg md:text-xl font-display">{c.name}</div>
                <div className="text-xs uppercase tracking-widest opacity-80 mt-1 flex items-center gap-1.5">Shop now <ArrowRight className="w-3.5 h-3.5" /></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="container-x pb-20 md:pb-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">Just In</div>
            <h2 className="text-3xl md:text-5xl">New Arrivals</h2>
          </div>
          <Link to="/new-arrivals" className="hidden md:inline-flex items-center gap-2 text-sm hover:text-brand transition-colors">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
          {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* EDITORIAL SPLIT */}
      <section className="container-x pb-20 md:pb-28">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/5] group">
            <img src={editorialA} alt="" className="w-full h-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end text-white">
              <div className="text-xs tracking-[0.25em] uppercase opacity-80 mb-2">Editorial</div>
              <h3 className="text-3xl md:text-4xl max-w-xs">The Everyday, Elevated</h3>
              <Link to="/shop" className="mt-5 inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline">Read the story <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-[4/5] group bg-brand text-brand-foreground">
            <img src={editorialB} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-luminosity transition-transform duration-[900ms] group-hover:scale-105" />
            <div className="absolute inset-0 bg-brand/50" />
            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
              <div className="text-xs tracking-[0.25em] uppercase opacity-90 mb-2">Signature Blue</div>
              <h3 className="text-3xl md:text-4xl max-w-xs">The Cobalt Capsule</h3>
              <Link to="/shop" className="mt-5 inline-flex items-center gap-2 text-sm underline-offset-4 hover:underline">Shop capsule <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <section className="container-x pb-20 md:pb-28">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">Trending</div>
          <h2 className="text-3xl md:text-5xl">This Week in Motion</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
          {trending.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="relative h-[420px] md:h-[520px] overflow-hidden">
        <img src={promoImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-ink/60" />
        <div className="container-x relative h-full flex items-center">
          <div className="max-w-xl text-white">
            <div className="text-xs tracking-[0.3em] uppercase text-brand-foreground bg-brand inline-block px-3 py-1 rounded-full mb-5">Members Only</div>
            <h2 className="text-4xl md:text-6xl">Up to 30% off select styles.</h2>
            <p className="mt-4 text-white/80 max-w-md">A seasonal edit of pieces we still adore. Members unlock early. Free shipping included.</p>
            <Link to="/shop" className="mt-7 inline-flex items-center gap-2 h-12 px-7 rounded-full bg-white text-ink text-sm font-medium hover:bg-brand hover:text-white transition-colors">
              Shop the Edit <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="container-x py-20 md:py-28">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">Bestsellers</div>
          <h2 className="text-3xl md:text-5xl">Loved by many.</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
          {bestsellers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-secondary">
        <div className="container-x py-20 md:py-28">
          <div className="text-center mb-14">
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">Kind Words</div>
            <h2 className="text-3xl md:text-5xl">From our community</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { q: "The fit and finish is unreal. My hoodie has become a signature piece.", n: "Elena V.", r: "Verified Buyer" },
              { q: "You can feel the intention in every seam. Truly quiet luxury.", n: "Marcus L.", r: "Verified Buyer" },
              { q: "Shipped fast, packaged beautifully, and fits like it was made for me.", n: "Priya S.", r: "Verified Buyer" },
            ].map((t) => (
              <div key={t.n} className="bg-background rounded-2xl p-8 shadow-card">
                <div className="flex gap-0.5 text-brand mb-4">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-lg font-display leading-snug">&ldquo;{t.q}&rdquo;</p>
                <div className="mt-6 text-sm">
                  <div className="font-medium">{t.n}</div>
                  <div className="text-muted-foreground text-xs">{t.r}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM / LOOKBOOK */}
      <section className="container-x py-20 md:py-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2 flex items-center gap-2"><Instagram className="w-3.5 h-3.5" /> {BRAND.social}</div>
            <h2 className="text-3xl md:text-5xl">Styled by you</h2>
          </div>
          <a href="#" className="hidden md:inline-flex items-center gap-2 text-sm hover:text-brand transition-colors">Follow along <ArrowRight className="w-4 h-4" /></a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-3">
          {[
            "photo-1490481651871-ab68de25d43d",
            "photo-1483985988355-763728e1935b",
            "photo-1509631179647-0177331693ae",
            "photo-1516826957135-700dedea698c",
            "photo-1542291026-7eec264c27ff",
            "photo-1539533018447-63fcce2678e3",
          ].map((id) => (
            <a key={id} href="#" className="group relative aspect-square rounded-xl overflow-hidden bg-secondary">
              <img src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=500&q=80`} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 grid place-items-center transition-colors">
                <Instagram className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="bg-ink text-white">
        <div className="container-x py-20 md:py-24 text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-[0.3em] text-white/60 mb-3">Stay in the know</div>
          <h2 className="text-3xl md:text-5xl">Join the atelier list.</h2>
          <p className="mt-4 text-white/70">First access to new arrivals, private events, and a welcome offer of 10% off.</p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" required placeholder="Enter your email" className="flex-1 h-12 px-5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-brand" />
            <button className="h-12 px-7 rounded-full bg-brand text-brand-foreground font-medium text-sm hover:opacity-90 transition-opacity">Subscribe</button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
