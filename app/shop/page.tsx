import { products } from "@/data/products";
import ShopGrid from "@/components/product/ShopGrid";
import CategoryCircles from "@/components/sections/CategoryCircles";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import WaCta from "@/components/sections/WaCta";
import { pageMeta } from "@/lib/seo";
import { collectionSeo } from "@/data/collection-seo";
import Faq from "@/components/sections/Faq";

const seo = collectionSeo.shop;

export const metadata = pageMeta({ title: seo.title, description: seo.description, path: "/shop", absoluteTitle: true });

export default function Shop() {
  return (
    <>
      <div className="container-x">
        <Breadcrumbs items={[{ name: "Shop", path: "/shop" }]} />
        <h1 className="text-4xl font-semibold">{seo.h1}</h1>
        <div className="mt-2 text-muted max-w-3xl leading-relaxed prose-intro" dangerouslySetInnerHTML={{ __html: seo.intro }} />
      </div>
      <CategoryCircles compact />
      <div className="container-x mt-10">
        <ShopGrid items={products} showChips={false} />
        <div className="max-w-3xl mx-auto mt-16 prose-bf prose-product" dangerouslySetInnerHTML={{ __html: seo.html }} />
        <section className="mt-14">
          <h2 className="text-2xl md:text-3xl font-semibold text-center max-w-3xl mx-auto mb-6">{seo.faqTitle}</h2>
          <Faq items={seo.faqs} />
        </section>
      </div>
      <WaCta />
    </>
  );
}
