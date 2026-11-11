import Link from "next/link";
import { Mail, Phone, Clock, MapPin } from "lucide-react";
import Logo from "@/components/layout/Logo";
import { site } from "@/lib/site";
import { categories } from "@/data/categories";
import { locations } from "@/data/locations";

export default function Footer() {
  const topAreas = ["kuala-lumpur", "petaling-jaya", "shah-alam", "subang-jaya", "cheras", "puchong", "cyberjaya", "bangsar"]
    .map((s) => locations.find((l) => l.slug === s)!).filter(Boolean);
  return (
    <footer className="bg-rose-950 text-white/80 mt-20">
      <div className="container-x py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed max-w-sm">
            {site.name} is an online florist in Kuala Lumpur &amp; Selangor. Handmade, soap and fresh-style bouquets delivered with care. Order easily on WhatsApp.
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex gap-2"><Phone className="w-4 h-4 mt-0.5" /> <a href={`https://wa.me/${site.whatsapp}`} className="hover:text-white">{site.phoneDisplay} (WhatsApp)</a></li>
            <li className="flex gap-2"><Mail className="w-4 h-4 mt-0.5" /> <a href={`mailto:${site.email}`} className="hover:text-white break-all">{site.email}</a></li>
            <li className="flex gap-2"><Clock className="w-4 h-4 mt-0.5" /> {site.openingHours}</li>
            <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5" /> {site.addressRegion}</li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3 font-sans">Shop</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => <li key={c.slug}><Link href={`/category/${c.slug}`} className="hover:text-white">{c.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3 font-sans">Flower Delivery</h3>
          <ul className="space-y-2 text-sm">
            {topAreas.map((l) => <li key={l.slug}><Link href={`/flower-delivery/${l.slug}`} className="hover:text-white">Florist {l.name}</Link></li>)}
            <li><Link href="/flower-delivery" className="text-blush-2 hover:text-white">All delivery areas →</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3 font-sans">Help</h3>
          <ul className="space-y-2 text-sm">
            {[["/about","About Us"],["/contact","Contact"],["/faq","FAQ"],["/delivery-information","Delivery Information"],["/refund-policy","Refund Policy"],["/privacy-policy","Privacy Policy"],["/terms","Terms & Conditions"],["/blog","Blog"]].map(([h,l]) =>
              <li key={h}><Link href={h} className="hover:text-white">{l}</Link></li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-5 text-xs flex flex-col sm:flex-row gap-2 justify-between">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <span>Florist in Kuala Lumpur &amp; Selangor, Malaysia</span>
        </div>
      </div>
    </footer>
  );
}
