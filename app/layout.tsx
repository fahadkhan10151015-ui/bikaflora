import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/whatsapp/FloatingWhatsApp";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { WhatsAppChooserProvider } from "@/components/whatsapp/WhatsAppChooser";
import JsonLd from "@/components/ui/JsonLd";
import { orgSchema } from "@/lib/seo";
import { site } from "@/lib/site";
import { siteImages } from "@/lib/images";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Florist & Flower Delivery KL & Selangor`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: ["florist KL", "flower delivery Kuala Lumpur", "flower delivery Selangor", "rose bouquet Malaysia", "flower box KL", "convocation flowers", "same day flower delivery"],
  openGraph: { siteName: site.name, locale: "en_MY", type: "website", images: [siteImages.cover] },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#a3284f" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-MY">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
        <JsonLd data={orgSchema()} />
      </head>
      <body>
        <AuthProvider>
          <WhatsAppChooserProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <FloatingWhatsApp />
          </WhatsAppChooserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
