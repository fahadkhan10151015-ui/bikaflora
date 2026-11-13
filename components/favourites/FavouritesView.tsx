"use client";
import Link from "next/link";
import { Heart } from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "@/components/product/ProductCard";
import { useOrderList } from "@/components/order/OrderListProvider";
import { useFavourites } from "./FavouritesProvider";

export default function FavouritesView() {
  const { slugs, ready } = useFavourites();
  const list = useOrderList();
  const items = slugs.map((s) => products.find((p) => p.slug === s)).filter((p) => !!p);

  if (!ready) return <div className="h-64" />;
  if (!items.length)
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-blush-2">
        <Heart className="w-12 h-12 mx-auto text-blush-2" />
        <p className="mt-3 font-semibold text-lg">No favourites yet</p>
        <p className="text-muted mt-1">Tap the heart on any bouquet to save it here.</p>
        <Link href="/shop" className="btn btn-primary mt-6">Browse bouquets</Link>
      </div>
    );

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="text-muted">{items.length} saved item{items.length > 1 ? "s" : ""}</p>
        <button className="btn btn-outline !py-2.5" onClick={() => { items.forEach((p) => list.add({ slug: p.slug, size: p.variants?.[0]?.label, price: p.price })); list.open(); }}>
          Add all to order list
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
        {items.map((p) => <ProductCard key={p.slug} p={p} />)}
      </div>
    </>
  );
}
