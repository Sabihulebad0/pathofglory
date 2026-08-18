import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useProducts } from "@/lib/catalog";
import type { Product } from "@/data/products";

export type CartItem = {
  productId: string;
  size: string;
  color: string;
  quantity: number;
};

type CartCtx = {
  items: CartItem[];
  wishlist: string[];
  add: (item: CartItem) => void;
  remove: (productId: string, size: string, color: string) => void;
  setQty: (productId: string, size: string, color: string, qty: number) => void;
  toggleWish: (productId: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  resolve: (item: CartItem) => Product | undefined;
};

const Ctx = createContext<CartCtx | null>(null);

const CART_KEY = "pog_cart";
const WISH_KEY = "pog_wish";

export function CartProvider({ children }: { children: ReactNode }) {
  const products = useProducts();
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY);
      const w = localStorage.getItem(WISH_KEY);
      if (c) setItems(JSON.parse(c));
      if (w) setWishlist(JSON.parse(w));
    } catch {}
  }, []);
  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem(WISH_KEY, JSON.stringify(wishlist)); }, [wishlist]);

  const add: CartCtx["add"] = (item) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.productId === item.productId && x.size === item.size && x.color === item.color);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + item.quantity };
        return next;
      }
      return [...prev, item];
    });
  };
  const remove: CartCtx["remove"] = (productId, size, color) =>
    setItems((prev) => prev.filter((x) => !(x.productId === productId && x.size === size && x.color === color)));
  const setQty: CartCtx["setQty"] = (productId, size, color, qty) =>
    setItems((prev) => prev.map((x) => (x.productId === productId && x.size === size && x.color === color ? { ...x, quantity: Math.max(1, qty) } : x)));
  const toggleWish = (id: string) =>
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const resolve = (it: CartItem) => products.find((p) => p.id === it.productId);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + (resolve(i)?.price ?? 0) * i.quantity, 0);

  return (
    <Ctx.Provider value={{ items, wishlist, add, remove, setQty, toggleWish, clear: () => setItems([]), count, subtotal, resolve }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be inside CartProvider");
  return c;
};
