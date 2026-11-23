import type { Metadata, Viewport } from "next";
import "@fontsource/barlow-condensed/600-italic.css";
import "@fontsource/barlow-condensed/700-italic.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource-variable/figtree";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Experience } from "@/components/Experience";
import { LogoEn } from "@/components/Logo";
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

// Runs before paint: enables JS-only animations and skips the intro after the first page view.
const introScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('ecospin-intro')||matchMedia('(prefers-reduced-motion: reduce)').matches)d.dataset.intro='seen'}catch(e){d.dataset.intro='seen'}})();`;

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
    <html lang="en-IN" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <div id="intro" aria-hidden="true">
          <div>
            <LogoEn className="intro-logo" />
            <div className="intro-bar">
              <span />
            </div>
          </div>
        </div>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:p-3">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
        <Experience />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
