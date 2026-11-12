import type { Metadata, Viewport } from "next";
// Self-hosted fonts (no external requests = faster first paint)
import "@fontsource/jost/latin-400.css";
import "@fontsource/jost/latin-500.css";
import "@fontsource/jost/latin-600.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-600.css";
import "@fontsource/cormorant-garamond/latin-600-italic.css";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/whatsapp/FloatingWhatsApp";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { WhatsAppChooserProvider } from "@/components/whatsapp/WhatsAppChooser";
import { OrderListProvider } from "@/components/order/OrderListProvider";
import OrderListDrawer from "@/components/order/OrderListDrawer";
import ChatBot from "@/components/chat/ChatBot";
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

export const viewport: Viewport = { themeColor: "#1f2a44" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-MY">
      <head>
        <JsonLd data={orgSchema()} />
      </head>
      <body>
        <AuthProvider>
          <WhatsAppChooserProvider>
            <OrderListProvider>
              <Header />
              <main className="pb-24">{children}</main>
              <Footer />
              <FloatingWhatsApp />
              <OrderListDrawer />
              <ChatBot />
            </OrderListProvider>
          </WhatsAppChooserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
