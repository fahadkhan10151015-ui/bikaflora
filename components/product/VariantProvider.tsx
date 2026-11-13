"use client";
import { createContext, useContext, useState } from "react";
import type { PaperColour, Product, Variant } from "@/data/products";

/** What the customer picked on a product page (shared by gallery, order panel and details). */
type Ctx = {
  variant?: Variant;
  setVariant: (id: string) => void;
  images: string[];
  /** Chosen custom wrapping paper (undefined = original paper) */
  paper?: PaperColour;
  setPaper: (id?: string) => void;
};
const VariantCtx = createContext<Ctx>({ setVariant: () => {}, images: [], setPaper: () => {} });

export function VariantProvider({ p, children }: { p: Product; children: React.ReactNode }) {
  const [id, setId] = useState(p.variants?.[0]?.id);
  const [paperId, setPaperId] = useState<string | undefined>();
  const variant = p.variants?.find((v) => v.id === id);
  const paper = p.paperColours?.find((c) => c.id === paperId && c.image);
  return (
    <VariantCtx.Provider value={{ variant, setVariant: setId, images: variant?.images ?? p.images, paper, setPaper: setPaperId }}>
      {children}
    </VariantCtx.Provider>
  );
}

export const useVariant = () => useContext(VariantCtx);
