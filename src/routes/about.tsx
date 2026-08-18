import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `About — ${BRAND.name}` },
      { name: "description", content: "Considered essentials, built with restraint. Designed in New York, made in family-run ateliers across Europe." },
      { property: "og:title", content: `About — ${BRAND.name}` },
      { property: "og:description", content: "Our story, our ateliers, our approach." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <Layout>
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1800&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="container-x relative h-full flex items-end pb-16 text-white">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.3em] mb-3 text-white/80">Our Story</div>
            <h1 className="text-4xl md:text-6xl">Built quietly. Worn always.</h1>
          </div>
        </div>
      </section>
      <section className="container-x py-20 md:py-28 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl md:text-4xl">A house of considered essentials.</h2>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            {BRAND.name} began with a simple question — what would a wardrobe look like if every piece was made to be worn a thousand times? The answer became our practice: work with the smallest ateliers, use only materials we would touch every day, and design for a life beyond seasons.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Every collection is shaped by the same rules. Fewer pieces. Longer lives. Cobalt-blue thread stitched invisibly at the hem — a quiet mark of the house.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <img className="rounded-2xl aspect-[3/4] object-cover" src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80" alt="" />
          <img className="rounded-2xl aspect-[3/4] object-cover mt-8" src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80" alt="" />
        </div>
      </section>

      <section className="bg-secondary">
        <div className="container-x py-20 grid md:grid-cols-3 gap-10">
          {[
            { n: "01", t: "Considered Design", d: "Each piece is drafted, worn, and revised — often for years — before it's released." },
            { n: "02", t: "Honest Materials", d: "Italian wools, Japanese denim, Mongolian cashmere. We name every mill on the label." },
            { n: "03", t: "Lifetime Repairs", d: "Send anything back, anytime. We'll mend it and return it to you at no cost." },
          ].map((c) => (
            <div key={c.n}>
              <div className="text-brand font-display text-3xl mb-3">{c.n}</div>
              <div className="text-xl font-display mb-2">{c.t}</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-20 md:py-28">
        <h2 className="text-3xl md:text-4xl mb-10">Policies & Practicalities</h2>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 text-sm leading-relaxed text-muted-foreground">
          {[
            ["Shipping", "Complimentary standard shipping on orders over $150. Express and international options available at checkout."],
            ["Returns", "30-day free returns on all full-priced items. Sale items may be exchanged within 14 days."],
            ["Privacy Policy", "We collect only what we need to serve you well. We never sell your data. Full policy available on request."],
            ["Terms & Conditions", "By using our site you agree to our terms. Read the complete terms in the footer of any page."],
          ].map(([t, d]) => (
            <div key={t}>
              <div className="text-ink font-medium text-base mb-2">{t}</div>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
