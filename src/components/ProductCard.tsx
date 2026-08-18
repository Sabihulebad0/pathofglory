import { Link } from "@tanstack/react-router";
import { Heart, Star } from "lucide-react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/data/products";

export function ProductCard({ product }: { product: Product }) {
  const { toggleWish, wishlist, add } = useCart();
  const wished = wishlist.includes(product.id);
  const onSale = !!product.compareAt;

  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-2xl bg-secondary aspect-[3/4]">
        <Link to="/products/$id" params={{ id: product.id }}>
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />
          )}
        </Link>
        {product.badge && (
          <span className={`absolute top-3 left-3 text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full font-medium ${
            product.badge === "Sale" ? "bg-brand text-brand-foreground" :
            product.badge === "New" ? "bg-ink text-white" : "bg-white text-ink"
          }`}>
            {product.badge}
          </span>
        )}
        <button
          onClick={() => toggleWish(product.id)}
          aria-label="Add to wishlist"
          className={`absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-full bg-white/90 backdrop-blur transition-transform hover:scale-110 ${
            wished ? "text-brand" : "text-ink"
          }`}
        >
          <Heart className={`w-4 h-4 ${wished ? "fill-current" : ""}`} />
        </button>
        <button
          onClick={() => add({ productId: product.id, size: product.sizes[0], color: product.colors[0].name, quantity: 1 })}
          className="absolute bottom-3 left-3 right-3 h-11 rounded-full bg-ink text-white text-sm font-medium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand"
        >
          Quick Add
        </button>
      </div>
      <div className="pt-4 space-y-1.5">
        <div className="flex items-start justify-between gap-3">
          <Link to="/products/$id" params={{ id: product.id }} className="text-sm font-medium hover:text-brand transition-colors line-clamp-1">
            {product.name}
          </Link>
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Star className="w-3 h-3 fill-current text-ink" />
            {product.rating}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium">${product.price}</span>
            {onSale && <span className="text-xs text-muted-foreground line-through">${product.compareAt}</span>}
          </div>
          <div className="flex gap-1">
            {product.colors.slice(0, 4).map((c) => (
              <span key={c.name} className="w-3 h-3 rounded-full border border-border" style={{ background: c.hex }} title={c.name} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
