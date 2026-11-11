import Link from "next/link";
import JsonLd from "./JsonLd";
import { breadcrumbSchema } from "@/lib/seo";

export default function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted py-4">
      <JsonLd data={breadcrumbSchema(all)} />
      <ol className="flex flex-wrap gap-1.5">
        {all.map((it, i) => (
          <li key={it.path} className="flex gap-1.5">
            {i < all.length - 1 ? <Link href={it.path} className="hover:text-brand">{it.name}</Link> : <span className="text-ink">{it.name}</span>}
            {i < all.length - 1 && <span>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
