import { createContext, useContext, type ReactNode } from "react";
import type { Catalog } from "./products";

const Ctx = createContext<Catalog | null>(null);

/**
 * Holds the catalogue fetched once by the root route loader so the header,
 * cart and every page read the same Sanity data without refetching.
 */
export function CatalogProvider({ value, children }: { value: Catalog; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCatalog(): Catalog {
  const catalog = useContext(Ctx);
  if (!catalog) throw new Error("useCatalog must be used inside CatalogProvider");
  return catalog;
}

export const useProducts = () => useCatalog().products;
export const useCategories = () => useCatalog().categories;
