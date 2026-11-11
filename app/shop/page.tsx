import { products } from "@/data/products";
import ShopGrid from "@/components/product/ShopGrid";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import WaCta from "@/components/sections/WaCta";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Shop Flower Bouquets Online | KL & Selangor Delivery",
  description: "Browse all BikaFlora bouquets: soap roses, crochet tulips, dried flowers, convocation and birthday bouquets. Order on WhatsApp with same-day delivery in KL & Selangor.",
  path: "/shop",
});

export default function Shop() {
  return (
    <>
      <div className="container-x">
        <Breadcrumbs items={[{ name: "Shop", path: "/shop" }]} />
        <h1 className="text-4xl font-semibold">Shop all bouquets</h1>
        <p className="mt-2 text-muted max-w-2xl mb-8">Handmade bouquets for every occasion, delivered across Kuala Lumpur & Selangor. Tap any bouquet to order on WhatsApp.</p>
        <ShopGrid items={products} />
      </div>
      <WaCta />
    </>
  );
}
