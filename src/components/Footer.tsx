import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { Logo } from "./Logo";
import { BRAND } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="bg-ink text-white/85 mt-24">
      <div className="container-x py-16 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2 space-y-5">
          <Logo variant="light" />
          <p className="text-sm text-white/60 max-w-xs">
            Considered essentials, built with restraint. Designed in New York, made in family-run ateliers across Europe.
          </p>
          <div className="flex gap-3 pt-2">
            {[Instagram, Twitter, Facebook, Youtube].map((I, i) => (
              <a key={i} href="#" aria-label="social" className="w-9 h-9 grid place-items-center rounded-full border border-white/20 hover:bg-brand hover:border-brand transition-colors">
                <I className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {[
          { title: "Shop", links: [["Shop All", "/shop"], ["New Arrivals", "/new-arrivals"], ["Bestsellers", "/shop"], ["Sale", "/shop"]] },
          { title: "Support", links: [["Contact", "/contact"], ["Shipping Policy", "/about"], ["Returns", "/about"], ["Size Guide", "/about"]] },
          { title: "Company", links: [["About Us", "/about"], ["Privacy Policy", "/about"], ["Terms & Conditions", "/about"], ["Careers", "/about"]] },
        ].map((col) => (
          <div key={col.title}>
            <div className="text-xs uppercase tracking-[0.2em] text-white/50 mb-4">{col.title}</div>
            <ul className="space-y-2.5 text-sm">
              {col.links.map(([label, to]) => (
                <li key={label}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <span>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</span>
          <span>Designed with intention.</span>
        </div>
      </div>
    </footer>
  );
}
