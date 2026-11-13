"use client";
import { createContext, useContext, useState } from "react";
import type { Product, Variant } from "@/data/products";

/** Which colour the customer picked on a product page (shared by gallery, order panel and details). */
type Ctx = { variant?: Variant; setVariant: (id: string) => void; images: string[] };
const VariantCtx = createContext<Ctx>({ setVariant: () => {}, images: [] });

export function VariantProvider({ p, children }: { p: Product; children: React.ReactNode }) {
  const [id, setId] = useState(p.variants?.[0]?.id);
  const variant = p.variants?.find((v) => v.id === id);
  return <VariantCtx.Provider value={{ variant, setVariant: setId, images: variant?.images ?? p.images }}>{children}</VariantCtx.Provider>;
}

export const useVariant = () => useContext(VariantCtx);
