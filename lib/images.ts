// Free photos from Unsplash (unsplash.com/license). Replace with your own photos any time:
// put files in /public/images/products/ and use "/images/products/your-photo.jpg" instead.

/** Build an Unsplash image URL from its photo id. */
export const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/** Shared site images (not tied to a product). */
/** Square close-up for small round frames. */
export const unsplashSquare = (id: string, size = 240) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&crop=entropy&w=${size}&h=${size}&q=80`;

/** Close-up flowers that orbit the hero bouquet. */
export const heroFlowers = [
  unsplashSquare("1518709779341-56cf4535e94b"), // red roses
  unsplashSquare("1582794543139-8ac9cb0f7b11"), // pink roses
  unsplashSquare("1561181226-e8a7edd504c6"), // tulips
  unsplashSquare("1543409777-30250849aa3e"), // sunflower
  unsplashSquare("1626976109816-08cef8600d7d"), // peony
  unsplashSquare("1641366638032-557d4a999d80"), // hydrangea
];

/** Free flower video (Pexels) shown above the footer on the home page. */
export const flowerVideo = "https://videos.pexels.com/video-files/3914572/3914572-hd_1920_1080_30fps.mp4";

export const siteImages = {
  cover: unsplash("1561729098-cbab0f7a9f7c", 1600),
  florist: unsplash("1642751652611-bb9a7cad58a3", 1200),
  holdingBouquet: unsplash("1567696153798-9111f9cd3d0d", 1000),
  klNight: unsplash("1596422846543-75c6fc197f07", 1800),
  klTowers: unsplash("1566914447826-bf04e54bf1be", 1600),
  klCity: unsplash("1762618300114-94ce42f22a53", 1600),
};
