/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
    formats: ["image/avif", "image/webp"],
    qualities: [60, 70, 75, 80], // 75 for photos: sharp and small (under 100 KB)
    minimumCacheTTL: 60 * 60 * 24 * 30, // keep optimised images for 30 days
    deviceSizes: [390, 640, 828, 1080, 1280],
  },
  compress: true,
  // Old product links (before colours became separate products)
  async redirects() {
    return [
      { source: "/product/ferrero-rocher-soap-rose-bouquet", destination: "/product/ferrero-rocher-pink-roses", permanent: true },
      { source: "/product/soap-rose-heart-large", destination: "/product/red-soap-rose-heart-large", permanent: true },
    ];
  },
};
export default nextConfig;
