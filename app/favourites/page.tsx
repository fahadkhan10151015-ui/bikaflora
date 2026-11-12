import Breadcrumbs from "@/components/ui/Breadcrumbs";
import FavouritesView from "@/components/favourites/FavouritesView";
import { pageMeta } from "@/lib/seo";

export const metadata = { ...pageMeta({ title: "My Favourites", description: "Your saved BikaFlora bouquets.", path: "/favourites" }), robots: { index: false } };

export default function Favourites() {
  return (
    <div className="container-x">
      <Breadcrumbs items={[{ name: "Favourites", path: "/favourites" }]} />
      <h1 className="text-4xl font-semibold mb-6">My favourites</h1>
      <FavouritesView />
    </div>
  );
}
