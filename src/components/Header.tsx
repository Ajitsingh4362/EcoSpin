"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Phone } from "lucide-react";
import { LogoEn } from "./Logo";
import { SoapBubbles } from "./SoapBubbles";
import { stores, formatPhone, telHref } from "@/data/site";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Prices" },
  { href: "/stores", label: "Our stores" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const progressRef = useRef<HTMLSpanElement>(null);

  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setPill(null);
  }

  /* Hide on scroll down, show on scroll up; draw reading progress. */
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 240);
        lastY = y;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock scrolling behind the mobile menu. */
  useEffect(() => {
    if (open) window.ecoLenis?.stop();
    else window.ecoLenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const activeIndex = nav.findIndex((n) => pathname.startsWith(n.href));
  const moveTo = (i: number) => {
    const el = linkRefs.current[i];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] md:pt-4 ${
          hidden && !open ? "-translate-y-[130%]" : ""
        }`}
      >
        <div
          className={`relative mx-auto flex max-w-6xl items-center justify-between rounded-full pr-2 pl-4 ring-1 transition-all duration-500 md:pl-6 ${
            scrolled || open
              ? "h-14 bg-white/75 shadow-[0_18px_50px_-20px_rgba(92,35,123,0.45)] ring-white/70 backdrop-blur-xl md:h-16"
              : "h-16 bg-white/45 ring-white/60 backdrop-blur-md md:h-[4.5rem]"
          }`}
        >
          <Link href="/" className="relative z-10 text-purple" aria-label="EcoSpin home">
            <LogoEn className={`w-auto transition-all duration-500 ${scrolled ? "h-9 md:h-11" : "h-10 md:h-12"}`} />
          </Link>

          <nav
            aria-label="Main"
            className="relative hidden items-center md:flex"
            onMouseLeave={() => (activeIndex >= 0 ? moveTo(activeIndex) : setPill(null))}
          >
            <span
              aria-hidden="true"
              className="absolute top-1/2 h-10 -translate-y-1/2 rounded-full bg-lavender transition-all duration-500 ease-[cubic-bezier(.2,.8,.2,1)]"
              style={{ left: pill?.left ?? 0, width: pill?.width ?? 0, opacity: pill ? 1 : 0 }}
            />
            {nav.map((n, i) => (
              <Link
                key={n.href}
                href={n.href}
                ref={(el) => {
                  linkRefs.current[i] = el;
                }}
                onMouseEnter={() => moveTo(i)}
                onFocus={() => moveTo(i)}
                aria-current={i === activeIndex ? "page" : undefined}
                className="relative px-4 py-2 text-[0.95rem] font-medium text-ink/75 transition-colors hover:text-purple aria-[current=page]:text-purple"
              >
                {n.label}
                {i === activeIndex && (
                  <span className="absolute -bottom-0.5 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-eco" aria-hidden="true" />
                )}
              </Link>
            ))}
            <Link
              href="/book"
              data-magnetic
              className="btn-shine ml-3 rounded-full bg-gradient-to-r from-purple to-purple-bright px-5 py-2.5 text-sm font-semibold text-white"
            >
              Book free pickup
            </Link>
          </nav>

          <button
            type="button"
            className="relative z-10 grid size-11 place-items-center rounded-full bg-purple text-white md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="relative block h-3.5 w-5">
              <span className={`absolute left-0 h-0.5 w-5 rounded bg-white transition-all duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute top-1.5 left-0 h-0.5 w-5 rounded bg-white transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-0.5 w-5 rounded bg-white transition-all duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>

          {/* Reading progress */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-8 -bottom-px h-[2px] overflow-hidden rounded-full">
            <span ref={progressRef} className="block h-full origin-left bg-gradient-to-r from-purple via-purple-bright to-eco" style={{ transform: "scaleX(0)" }} />
          </span>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        className={`fixed inset-0 z-[45] bg-gradient-to-br from-purple via-purple-bright to-purple transition-[clip-path] duration-700 ease-[cubic-bezier(.7,0,.2,1)] md:hidden ${
          open ? "[clip-path:circle(150%_at_calc(100%-2.5rem)_2.5rem)]" : "pointer-events-none [clip-path:circle(0%_at_calc(100%-2.5rem)_2.5rem)]"
        }`}
        aria-hidden={!open}
      >
        {open && <SoapBubbles count={8} />}
        <nav aria-label="Mobile" className="relative flex h-full flex-col px-6 pt-28 pb-8 text-white">
          <ul className="space-y-1">
            {[{ href: "/", label: "Home" }, ...nav].map((n, i) => (
              <li
                key={n.href}
                className={`transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)] ${open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                style={{ transitionDelay: open ? `${150 + i * 70}ms` : "0ms" }}
              >
                <Link href={n.href} tabIndex={open ? 0 : -1} className="display block py-1.5 text-5xl">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className={`mt-auto space-y-3 transition-all delay-500 duration-700 ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
            <Link href="/book" tabIndex={open ? 0 : -1} className="block rounded-full bg-mint py-4 text-center font-semibold text-purple-deep">
              Book free pickup
            </Link>
            <div className="grid grid-cols-2 gap-3">
              {stores.map((s) => (
                <a
                  key={s.slug}
                  href={telHref(s.call)}
                  tabIndex={open ? 0 : -1}
                  className="flex flex-col rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/20"
                >
                  <span className="text-xs text-white/70">{s.area.split(",")[0]}</span>
                  <span className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold">
                    <Phone className="size-3.5" /> {formatPhone(s.call)}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
