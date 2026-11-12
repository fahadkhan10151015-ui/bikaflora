"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct, type Product } from "@/data/products";

/** One line in the customer's WhatsApp order list. */
export type OrderLine = { slug: string; size?: string; price: number; qty: number };
export type ResolvedLine = OrderLine & { product: Product };

type Ctx = {
  lines: ResolvedLine[];
  count: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (line: Omit<OrderLine, "qty">) => void;
  setQty: (index: number, qty: number) => void;
  remove: (index: number) => void;
  clear: () => void;
  has: (slug: string) => boolean;
};

const OrderListCtx = createContext<Ctx | null>(null);
const KEY = "bf_order_list";

export function OrderListProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<OrderLine[]>([]);
  const [isOpen, setOpen] = useState(false);

  // Load once, then keep localStorage in sync (so the list survives page changes).
  useEffect(() => {
    try { setRaw(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { /* ignore */ }
  }, []);
  const save = useCallback((next: OrderLine[]) => {
    setRaw(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }, []);

  const lines = useMemo(
    () => raw.map((l) => ({ ...l, product: getProduct(l.slug)! })).filter((l) => l.product),
    [raw],
  );

  const value: Ctx = {
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    total: lines.reduce((n, l) => n + l.price * l.qty, 0),
    isOpen,
    open: () => setOpen(true),
    close: () => setOpen(false),
    add: (line) => {
      const i = raw.findIndex((l) => l.slug === line.slug && l.size === line.size);
      save(i >= 0 ? raw.map((l, j) => (j === i ? { ...l, qty: l.qty + 1 } : l)) : [...raw, { ...line, qty: 1 }]);
    },
    setQty: (index, qty) => save(qty < 1 ? raw.filter((_, j) => j !== index) : raw.map((l, j) => (j === index ? { ...l, qty } : l))),
    remove: (index) => save(raw.filter((_, j) => j !== index)),
    clear: () => save([]),
    has: (slug) => raw.some((l) => l.slug === slug),
  };

  return <OrderListCtx.Provider value={value}>{children}</OrderListCtx.Provider>;
}

export function useOrderList() {
  const ctx = useContext(OrderListCtx);
  if (!ctx) throw new Error("useOrderList must be used inside OrderListProvider");
  return ctx;
}
