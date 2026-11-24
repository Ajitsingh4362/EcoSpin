import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Experience } from "@/components/Experience";
import { LogoEn } from "@/components/Logo";
import { site, stores } from "@/data/site";

// Public website chrome (intro, header, footer, WhatsApp button, smooth scroll).
// The admin panel under /admin has its own layout and does not load any of this.

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

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
    </>
  );
}
