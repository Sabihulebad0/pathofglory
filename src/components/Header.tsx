import { Link } from "@tanstack/react-router";
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart";
import { useCategories } from "@/lib/catalog";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [collOpen, setCollOpen] = useState(false);
  const { count, wishlist } = useCart();
  const categories = useCategories();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="bg-ink text-white text-xs">
        <div className="container-x flex items-center justify-between h-9 overflow-hidden">
          <span className="hidden sm:block opacity-70">Complimentary shipping on orders over $150</span>
          <div className="flex-1 overflow-hidden">
            <div className="flex marquee gap-12 whitespace-nowrap justify-center sm:justify-end">
              <span>New Season SS26 — now landed</span>
              <span>Free returns within 30 days</span>
              <span>Members earn 2× points this week</span>
              <span>New Season SS26 — now landed</span>
              <span>Free returns within 30 days</span>
              <span>Members earn 2× points this week</span>
            </div>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 bg-background/90 backdrop-blur-md transition-shadow ${
          scrolled ? "shadow-[0_1px_0_0_var(--color-border)]" : ""
        }`}
      >
        <div className="container-x flex items-center justify-between h-20 md:h-24 gap-4 md:gap-6">
          <div className="flex items-center gap-8 md:w-1/3">
            <button
              className="md:hidden -ml-2 p-2"
              onClick={() => setMobile(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <nav className="hidden md:flex items-center gap-7 text-sm">
              <Link to="/shop" className="hover:text-brand transition-colors">Shop</Link>
              <div
                className="relative"
                onMouseEnter={() => setCollOpen(true)}
                onMouseLeave={() => setCollOpen(false)}
              >
                <button className="flex items-center gap-1 hover:text-brand transition-colors">
                  Collections <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {collOpen && (
                  <div className="absolute left-0 top-full pt-3 w-64">
                    <div className="bg-background border border-border rounded-xl shadow-soft p-3 grid gap-1">
                      {categories.map((c) => (
                        <Link
                          key={c.slug}
                          to="/shop"
                          search={{ category: c.slug } as never}
                          className="px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Link to="/new-arrivals" className="hover:text-brand transition-colors">New Arrivals</Link>
              <Link to="/about" className="hover:text-brand transition-colors">About</Link>
              <Link to="/contact" className="hover:text-brand transition-colors">Contact</Link>
            </nav>
          </div>

          <div className="md:w-1/3 flex justify-center">
            <Logo variant="light" />
          </div>

          <div className="flex items-center justify-end gap-1 md:gap-2 md:w-1/3">
            <button className="p-2 hover:text-brand transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/about" className="hidden md:inline-flex p-2 hover:text-brand transition-colors" aria-label="Account">
              <User className="w-5 h-5" />
            </Link>
            <Link to="/cart" className="relative p-2 hover:text-brand transition-colors" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand text-brand-foreground text-[10px] font-medium rounded-full w-4 h-4 grid place-items-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative p-2 hover:text-brand transition-colors" aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand text-brand-foreground text-[10px] font-medium rounded-full w-4 h-4 grid place-items-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {mobile && (
        <div className="fixed inset-0 z-50 bg-background md:hidden animate-in fade-in">
          <div className="container-x flex items-center justify-between h-16">
            <Logo variant="light" />
            <button onClick={() => setMobile(false)} aria-label="Close menu"><X className="w-6 h-6" /></button>
          </div>
          <nav className="container-x flex flex-col gap-1 mt-6 text-lg">
            {[
              { to: "/shop", label: "Shop" },
              { to: "/new-arrivals", label: "New Arrivals" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
              { to: "/cart", label: "Cart" },
            ].map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMobile(false)} className="py-3 border-b border-border">
                {l.label}
              </Link>
            ))}
            <div className="pt-6 text-sm uppercase tracking-widest text-muted-foreground">Collections</div>
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/shop"
                search={{ category: c.slug } as never}
                onClick={() => setMobile(false)}
                className="py-2 text-base"
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
