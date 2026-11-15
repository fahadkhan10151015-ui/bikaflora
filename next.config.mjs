import imageRedirects from "./data/image-redirects.json" with { type: "json" };
import content from "./data/content.json" with { type: "json" };

// Redirects added in the admin panel (Admin → Redirects).
const adminRedirects = (content.page?.redirects?.list ?? [])
  .filter((r) => typeof r.from === "string" && /^\/[A-Za-z0-9._~%/-]+$/.test(r.from.trim()) && r.from.trim() !== "/" && typeof r.to === "string" && r.to.trim() && r.from !== r.to)
  .map((r) => ({ source: r.from.trim().replace(/\/$/, ""), destination: r.to.trim(), permanent: r.type !== "302" }));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Photos uploaded in the admin panel are stored in Supabase Storage.
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
    qualities: [60, 70, 75, 80], // 75 for photos: sharp and small (under 100 KB)
    minimumCacheTTL: 60 * 60 * 24 * 30, // keep optimised images for 30 days
    deviceSizes: [390, 640, 828, 1080, 1440, 1920],
    imageSizes: [96, 128, 256, 320],
  },
  compress: true,
  // Let browsers and Vercel's CDN keep photos, videos and logos (they were sent with max-age=0 before).
  async headers() {
    const media = "public, max-age=31536000, immutable"; // 1 year (files get a new name whenever they change)
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
      { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self' https://wa.me https://api.whatsapp.com; upgrade-insecure-requests" },
    ];
    return [
      { source: "/:path*", headers: security },
      { source: "/video/:path*", headers: [{ key: "Cache-Control", value: media }] },
      { source: "/products/:path*", headers: [{ key: "Cache-Control", value: media }] },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: media }] },
      { source: "/brand/:path*", headers: [{ key: "Cache-Control", value: media }] },
    ];
  },
  // Old product links (before colours became separate products)
  async redirects() {
    return [
      // Product photos were renamed to SEO-friendly file names
      ...imageRedirects,
      ...adminRedirects,
      // One address only: the old Vercel address sends everyone to bikaflora.my
      { source: "/:path*", has: [{ type: "host", value: "bikaflora.vercel.app" }], destination: "https://bikaflora.my/:path*", permanent: true },
      { source: "/product/ferrero-rocher-soap-rose-bouquet", destination: "/product/ferrero-rocher-pink-roses", permanent: true },
      { source: "/product/soap-rose-heart-large", destination: "/product/red-soap-rose-heart-large", permanent: true },
    ];
  },
};
export default nextConfig;
