import type { Metadata, Viewport } from "next";
import "@fontsource/barlow-condensed/600-italic.css";
import "@fontsource/barlow-condensed/700-italic.css";
import "@fontsource/barlow-condensed/700.css";
import "@fontsource-variable/figtree";
import "./globals.css";
import { site } from "@/data/site";

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        {children}
      </body>
    </html>
  );
}
