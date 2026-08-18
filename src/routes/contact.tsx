import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { BRAND } from "@/lib/brand";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact — ${BRAND.name}` },
      { name: "description", content: `Reach the ${BRAND.name} team. We reply within one business day.` },
      { property: "og:title", content: `Contact — ${BRAND.name}` },
      { property: "og:description", content: `Reach the ${BRAND.name} team.` },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <Layout>
      <section className="container-x pt-16 pb-10 text-center max-w-2xl mx-auto">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Get in Touch</div>
        <h1 className="text-4xl md:text-6xl">We&rsquo;re here to help.</h1>
        <p className="mt-4 text-muted-foreground">Questions about fit, an order, or a private appointment — write to us and we&rsquo;ll reply within one business day.</p>
      </section>

      <section className="container-x pb-24 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2 space-y-6">
          {[
            { I: Mail, t: "Email", d: "hello@pathofglory.com" },
            { I: Phone, t: "Phone", d: "+1 (212) 555-0199" },
            { I: MapPin, t: "Flagship", d: "128 Grand Street, New York" },
          ].map(({ I, t, d }) => (
            <div key={t} className="flex items-start gap-4 p-5 rounded-2xl border border-border">
              <div className="w-10 h-10 rounded-full bg-brand/10 text-brand grid place-items-center shrink-0"><I className="w-5 h-5" /></div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{t}</div>
                <div className="text-base font-medium mt-1">{d}</div>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="md:col-span-3 bg-secondary rounded-2xl p-8 md:p-10 space-y-5">
          {sent ? (
            <div className="py-16 text-center">
              <div className="text-2xl font-display mb-2">Thank you.</div>
              <p className="text-muted-foreground">We&rsquo;ve received your note and will reply shortly.</p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="First name" name="fn" />
                <Field label="Last name" name="ln" />
              </div>
              <Field label="Email" name="email" type="email" />
              <Field label="Subject" name="subject" />
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
                <textarea required rows={5} className="mt-2 w-full rounded-xl bg-background border border-border p-4 text-sm focus:outline-none focus:border-ink" />
              </div>
              <button className="h-12 px-7 rounded-full bg-ink text-white text-sm font-medium hover:bg-brand transition-colors">Send Message</button>
            </>
          )}
        </form>
      </section>
    </Layout>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input required name={name} type={type} className="mt-2 w-full h-12 rounded-xl bg-background border border-border px-4 text-sm focus:outline-none focus:border-ink" />
    </div>
  );
}
