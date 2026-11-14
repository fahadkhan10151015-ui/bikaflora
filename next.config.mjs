/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    formats: ["image/avif", "image/webp"],
    qualities: [60, 70, 75, 80], // 75 for photos: sharp and small (under 100 KB)
    minimumCacheTTL: 60 * 60 * 24 * 30, // keep optimised images for 30 days
    deviceSizes: [390, 640, 828, 1080],
    imageSizes: [96, 128, 256, 320],
  },
  compress: true,
  // Let browsers and Vercel's CDN keep photos, videos and logos (they were sent with max-age=0 before).
  async headers() {
    const media = "public, max-age=604800, stale-while-revalidate=2592000"; // 7 days, then refresh in the background
    return [
      { source: "/video/:path*", headers: [{ key: "Cache-Control", value: media }] },
      { source: "/products/:path*", headers: [{ key: "Cache-Control", value: media }] },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: media }] },
      { source: "/brand/:path*", headers: [{ key: "Cache-Control", value: media }] },
    ];
  },
  // Old product links (before colours became separate products)
  async redirects() {
    return [
      // One address only: the old Vercel address sends everyone to bikaflora.my
      { source: "/:path*", has: [{ type: "host", value: "bikaflora.vercel.app" }], destination: "https://bikaflora.my/:path*", permanent: true },
      { source: "/product/ferrero-rocher-soap-rose-bouquet", destination: "/product/ferrero-rocher-pink-roses", permanent: true },
      { source: "/product/soap-rose-heart-large", destination: "/product/red-soap-rose-heart-large", permanent: true },
    ];
  },
};
export default nextConfig;
