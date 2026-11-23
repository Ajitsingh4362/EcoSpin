"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LogoEn } from "./Logo";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Prices" },
  { href: "/stores", label: "Our stores" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    // Close the mobile menu after navigating.
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-lilac/60 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 md:h-20">
        <Link href="/" className="text-purple" aria-label="EcoSpin home">
          <LogoEn className="h-11 w-auto md:h-14" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={pathname === n.href ? "page" : undefined}
              className="text-[0.95rem] font-medium text-ink/80 hover:text-purple aria-[current=page]:text-purple aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8"
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="rounded-full bg-purple px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-deep"
          >
            Book free pickup
          </Link>
        </nav>

        <button
          type="button"
          className="-mr-2 p-2 text-purple md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-7" /> : <Menu className="size-7" />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-lilac/60 bg-white px-5 pb-6 md:hidden">
          <ul className="divide-y divide-lilac/50">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="display block py-3 text-3xl text-purple">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/book"
            className="mt-4 block rounded-full bg-purple px-5 py-3 text-center font-semibold text-white"
          >
            Book free pickup
          </Link>
        </nav>
      )}
    </header>
  );
}
