import { categories } from "@/data/categories";
import { getLocation } from "@/data/locations";
import { menuAreaSlugs } from "@/lib/site";
import HeaderClient from "./HeaderClient";

/** Site header. Works out the menu lists on the server and sends only names and links to the browser. */
export default function Header() {
  const cats = categories.map((c) => ({ slug: c.slug, name: c.name, short: c.short }));
  const areas = menuAreaSlugs.map((s) => getLocation(s)).filter((l): l is NonNullable<typeof l> => Boolean(l)).map((l) => ({ slug: l.slug, name: l.name }));
  return <HeaderClient categories={cats} topAreas={areas} />;
}
