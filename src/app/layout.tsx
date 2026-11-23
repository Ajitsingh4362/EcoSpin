import type { Metadata, Viewport } from "next";
import "@fontsource/barlow-condensed/600-italic.css";
import "@fontsource/barlow-condensed/700-italic.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource-variable/figtree";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { site, stores } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "EcoSpin Dry-Cleaners — Dry cleaning & laundry in Thane and Kharghar",
    template: "%s | EcoSpin Dry-Cleaners",
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_IN",
    images: [{ url: "/images/suit.webp" }],
  },
};

export const viewport: Viewport = { themeColor: "#5c237b" };

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": stores.map((s) => ({
    "@type": "DryCleaningOrLaundry",
    "@id": `${site.url}/stores#${s.slug}`,
    name: `${site.name} — ${s.area}`,
    url: `${site.url}/stores`,
    telephone: `+91${s.call}`,
    image: `${site.url}/images/suit.webp`,
    priceRange: "₹₹",
    areaServed: site.areasServed,
    address: {
      "@type": "PostalAddress",
      streetAddress: s.address.slice(0, 2).join(", "),
      addressLocality: s.slug === "thane" ? "Thane" : "Navi Mumbai",
      postalCode: s.slug === "thane" ? "400615" : "410210",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
  })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className="h-full">
      <body className="flex min-h-full flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:p-3">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
