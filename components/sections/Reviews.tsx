import { products } from "@/data/products";
import ReviewsClient from "./ReviewsClient";

/** Customer reviews. Product names are looked up on the server (no product data sent to the browser). */
export default function Reviews({ limit = 6 }: { limit?: number }) {
  return <ReviewsClient limit={limit} names={Object.fromEntries(products.map((p) => [p.slug, p.name]))} />;
}
