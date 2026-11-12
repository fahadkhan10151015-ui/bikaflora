"use client";
import { ShoppingBag } from "lucide-react";
import { useOrderList } from "./OrderListProvider";

/** Header icon with a count badge that opens the order list. */
export default function OrderListButton() {
  const { count, open } = useOrderList();
  return (
    <button type="button" onClick={open} className="relative p-2 rounded-full hover:bg-blush" aria-label={`Order list, ${count} item${count === 1 ? "" : "s"}`}>
      <ShoppingBag className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-gold text-deep text-[11px] font-bold grid place-items-center">{count}</span>
      )}
    </button>
  );
}
