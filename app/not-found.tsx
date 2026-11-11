import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container-x py-28 text-center">
      <div className="text-6xl">🌷</div>
      <h1 className="mt-4 text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 text-muted">This page may have moved. Let&apos;s get you back to the flowers.</p>
      <div className="mt-8 flex gap-3 justify-center"><Link href="/" className="btn btn-primary">Go home</Link><Link href="/shop" className="btn btn-outline">Shop bouquets</Link></div>
    </div>
  );
}
