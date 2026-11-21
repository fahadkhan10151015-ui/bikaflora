// Site photos (free Unsplash licence, unsplash.com/license), stored on our own site in
// /public/images/site/ so they load fast and never depend on another website.

/** Shared site images (not tied to a product). */
/** Free florist video (Pexels) for the "Crafted by hand" section. */
/** A florist arranging a lilac & rose bouquet (Pexels 4621358, free licence, stored on our site). */
export const flowerVideo = "/video/crafted-720.mp4";
export const flowerVideoMobile = "/video/crafted-480.mp4";
export const flowerVideoPoster = "/video/crafted-poster.webp";

export const siteImages = {
  cover: "/images/site/cover.webp",
  florist: "/images/site/florist.webp",
  holdingBouquet: "/images/site/holding-bouquet.webp",
  klNight: "/images/site/kl-night.webp",
  klTowers: "/images/site/kl-towers.webp",
  klCity: "/images/site/kl-city.webp",
};

/** Tiny (about 1 KB) version of the first hero background for phones. It sits behind dark gradients as soft city lights.
 *  Being this small, Chrome does not count it as the LCP picture, so the bouquet photo stays the LCP (fast). */
export const HERO_BG_MOBILE = (src: string) => `/_next/image?url=${encodeURIComponent(src)}&w=128&q=75`;

/** The hero bouquet is about 300px wide on phones and up to 450px on desktop, so phones get a ~640px file instead of 1080px. */
export const HERO_BOUQUET_SIZES = "(max-width: 767px) 300px, 450px";
