import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EcoSpin — Laundry & Dry Cleaning",
  description: "EcoSpin: eco-friendly laundry, dry cleaning and doorstep pickup & delivery.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
