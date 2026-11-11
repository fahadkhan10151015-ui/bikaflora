"use client";
import { useMemo, useState } from "react";
import { Product } from "@/data/products";
import { categories } from "@/data/categories";
import ProductCard from "./ProductCard";

export default function ShopGrid({ items, initialCat = "" }: { items: Product[]; initialCat?: string }) {
  const [cat, setCat] = useState(initialCat);
  const [sort, setSort] = useState("popular");
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    let l = items.filter((p) => (!cat || p.categories.includes(cat)) && (!q || p.name.toLowerCase().includes(q.toLowerCase())));
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    return l;
  }, [items, cat, sort, q]);
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setCat("")} className={`shrink-0 px-4 py-2 rounded-full text-sm border ${!cat ? "bg-brand text-white border-brand" : "bg-white border-blush-2"}`}>All</button>
          {categories.map((c) => (
            <button key={c.slug} onClick={() => setCat(c.slug)} className={`shrink-0 px-4 py-2 rounded-full text-sm border ${cat === c.slug ? "bg-brand text-white border-brand" : "bg-white border-blush-2"}`}>{c.name}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="input !py-2 md:w-48" placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search bouquets" />
          <select className="input !py-2 !w-auto" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
            <option value="popular">Popular</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option>
          </select>
        </div>
      </div>
      <p className="text-sm text-muted mb-4">{list.length} bouquets</p>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      {list.length === 0 && <p className="text-center text-muted py-16">No bouquets found. Try another category or message us on WhatsApp.</p>}
    </div>
  );
}
