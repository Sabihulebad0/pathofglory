import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useCart } from "@/lib/cart";
import { BRAND } from "@/lib/brand";
import { Minus, Plus, X, ShoppingBag, Lock } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: `Your Cart — ${BRAND.name}` },
      { name: "description", content: `Review your ${BRAND.name} selections and check out securely.` },
      { property: "og:title", content: `Your Cart — ${BRAND.name}` },
      { property: "og:description", content: `Review your ${BRAND.name} selections.` },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { items, resolve, setQty, remove, subtotal } = useCart();
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 12;
  const total = subtotal + shipping;

  return (
    <Layout>
      <section className="container-x pt-12 pb-6 border-b border-border">
        <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">Bag</div>
        <h1 className="text-4xl md:text-5xl">Your Cart</h1>
      </section>

      {items.length === 0 ? (
        <div className="container-x py-24 text-center">
          <img src={BRAND.logoLight} alt={BRAND.name} className="h-16 w-auto mx-auto mb-8 object-contain opacity-20" />
          <div className="w-16 h-16 rounded-full bg-secondary grid place-items-center mx-auto mb-6">
            <ShoppingBag className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="text-2xl font-display">Your cart is empty.</div>
          <p className="text-muted-foreground mt-2">Add some considered essentials to get started.</p>
          <Link to="/shop" className="mt-8 inline-flex items-center h-12 px-7 rounded-full bg-ink text-white text-sm font-medium hover:bg-brand transition-colors">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <section className="container-x py-12 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 divide-y divide-border">
            {items.map((it) => {
              const p = resolve(it);
              if (!p) return null;
              return (
                <div key={`${it.productId}-${it.size}-${it.color}`} className="py-6 flex gap-4 md:gap-6">
                  <Link to="/products/$id" params={{ id: p.id }} className="w-24 md:w-32 aspect-[3/4] rounded-xl overflow-hidden bg-secondary shrink-0">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link to="/products/$id" params={{ id: p.id }} className="font-medium hover:text-brand transition-colors line-clamp-1">{p.name}</Link>
                        <div className="text-xs text-muted-foreground mt-1">{it.color} · Size {it.size}</div>
                      </div>
                      <button onClick={() => remove(it.productId, it.size, it.color)} aria-label="Remove" className="p-1 text-muted-foreground hover:text-ink"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div className="flex items-center border border-border rounded-full">
                        <button onClick={() => setQty(it.productId, it.size, it.color, it.quantity - 1)} className="w-9 h-9 grid place-items-center hover:text-brand"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="w-8 text-center text-sm">{it.quantity}</span>
                        <button onClick={() => setQty(it.productId, it.size, it.color, it.quantity + 1)} className="w-9 h-9 grid place-items-center hover:text-brand"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                      <div className="font-medium">${(p.price * it.quantity).toFixed(0)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <aside className="lg:col-span-1">
            <div className="rounded-2xl bg-secondary p-6 md:p-8 sticky top-28">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Order Summary</div>
              <div className="space-y-3 text-sm">
                <Row label="Subtotal" value={`$${subtotal.toFixed(0)}`} />
                <Row label="Shipping" value={shipping === 0 ? "Free" : `$${shipping.toFixed(0)}`} />
              </div>
              <div className="my-5 h-px bg-border" />
              <div className="flex justify-between text-base font-medium">
                <span>Total</span><span>${total.toFixed(0)}</span>
              </div>
              <Link to="/checkout" className="mt-6 w-full h-12 rounded-full bg-ink text-white text-sm font-medium hover:bg-brand transition-colors inline-flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" /> Secure Checkout
              </Link>
              <Link to="/shop" className="mt-3 w-full h-11 rounded-full border border-border text-sm inline-flex items-center justify-center hover:border-ink transition-colors">Continue Shopping</Link>
            </div>
          </aside>
        </section>
      )}
    </Layout>
  );
}
const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span>{value}</span></div>
);
