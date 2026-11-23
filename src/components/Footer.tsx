import Link from "next/link";
import { LogoEn, LogoHi } from "./Logo";
import { stores, formatPhone, telHref, waHref } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-purple-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <LogoEn className="h-20 w-auto text-white" />
          <LogoHi className="mt-4 h-8 w-auto text-lilac" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
            Advanced dry cleaning and laundry with free pickup and delivery across Thane, Mulund and Navi Mumbai.
          </p>
        </div>

        {stores.map((s) => (
          <div key={s.slug}>
            <h2 className="display text-2xl">{s.name}</h2>
            <address className="mt-3 text-sm not-italic leading-relaxed text-white/75">
              {s.address.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
            <ul className="mt-4 space-y-1.5 text-sm">
              <li>
                Call{" "}
                <a href={telHref(s.call)} className="font-semibold underline-offset-4 hover:underline">
                  {formatPhone(s.call)}
                </a>
              </li>
              <li>
                WhatsApp{" "}
                <a href={waHref(s.whatsapp)} className="font-semibold underline-offset-4 hover:underline">
                  {formatPhone(s.whatsapp)}
                </a>
              </li>
              <li className="text-white/60">Closed on {s.closedOn}s</li>
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-white/55">
          <p>© EcoSpin Dry-Cleaners. Shine Naturally.</p>
          <nav aria-label="Footer" className="flex gap-5">
            <Link href="/pricing" className="hover:text-white">Prices</Link>
            <Link href="/terms" className="hover:text-white">Terms &amp; conditions</Link>
            <Link href="/book" className="hover:text-white">Book pickup</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
