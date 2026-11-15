import { categories } from "@/data/categories";
import CategoryCirclesClient from "./CategoryCirclesClient";

/** Category circles. The list is made on the server; the browser only gets names, links and photos. */
export default function CategoryCircles({ compact = false }: { compact?: boolean }) {
  return <CategoryCirclesClient compact={compact} categories={categories.map((c) => ({ slug: c.slug, name: c.name, image: c.image }))} />;
}
