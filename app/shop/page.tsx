import { products } from "@/data/products";
import ShopGrid from "@/components/product/ShopGrid";
import CategoryCircles from "@/components/sections/CategoryCircles";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import WaCta from "@/components/sections/WaCta";
import { pageMeta } from "@/lib/seo";
import { collectionSeo } from "@/data/collection-seo";
import CollectionGuide from "@/components/sections/CollectionGuide";

const seo = collectionSeo.shop;

export const metadata = pageMeta({ title: seo.title, description: seo.description, path: "/shop", absoluteTitle: true });

export default function Shop() {
  return (
    <>
      <div className="bg-gradient-to-br from-blush via-[#fbf3ee] to-cream border-b border-blush-2">
        <div className="container-x pb-10 md:pb-12">
          <Breadcrumbs items={[{ name: "Shop", path: "/shop" }]} />
          <p className="eyebrow mb-3">{products.length} handmade bouquets · KL &amp; Selangor</p>
          <h1 className="text-4xl md:text-6xl font-semibold leading-[1.05] text-ink">{seo.h1}</h1>
          <div className="mt-5 text-lg md:text-xl text-ink/75 max-w-3xl leading-relaxed prose-intro" dangerouslySetInnerHTML={{ __html: seo.intro }} />
        </div>
      </div>
      <CategoryCircles compact />
      <div className="container-x mt-10">
        <ShopGrid items={products} showChips={false} />
        <CollectionGuide name="Shop" html={seo.html} faqTitle={seo.faqTitle} faqs={seo.faqs} />
      </div>
      <WaCta />
    </>
  );
}
