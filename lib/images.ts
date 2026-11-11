// Free photos from Unsplash (unsplash.com/license). Replace with your own photos any time:
// put files in /public/images/products/ and use "/images/products/your-photo.jpg" instead.

/** Build an Unsplash image URL from its photo id. */
export const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/** Shared site images (not tied to a product). */
export const siteImages = {
  cover: unsplash("1561729098-cbab0f7a9f7c", 1600),
  florist: unsplash("1642751652611-bb9a7cad58a3", 1200),
  holdingBouquet: unsplash("1567696153798-9111f9cd3d0d", 1000),
  klNight: unsplash("1596422846543-75c6fc197f07", 1800),
  klTowers: unsplash("1566914447826-bf04e54bf1be", 1600),
  klCity: unsplash("1762618300114-94ce42f22a53", 1600),
};
