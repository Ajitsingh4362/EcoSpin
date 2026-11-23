"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import { priceList, stores, inr, waHref } from "@/data/site";

type Mode = "dc" | "press";
type Line = { key: string; item: string; mode: Mode; price: number; qty: number; category: string };

const speeds = [
  { id: "regular", label: "Regular", note: "4–5 working days", extra: 0 },
  { id: "next", label: "Next day", note: "+50%", extra: 0.5 },
  { id: "same", label: "Same day", note: "+100%", extra: 1 },
] as const;

/** Smoothly counts a number towards its target. */
function useCountUp(target: number) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / 500);
      const v = Math.round(a + (target - a) * (1 - Math.pow(1 - k, 3)));
      setValue(v);
      from.current = v;
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return value;
}

export function BagBuilder() {
  const [cat, setCat] = useState(priceList[0].slug);
  const [mode, setMode] = useState<Mode>("dc");
  const [bag, setBag] = useState<Record<string, Line>>({});
  const [speed, setSpeed] = useState<(typeof speeds)[number]["id"]>("regular");
  const [storeSlug, setStoreSlug] = useState<string>(stores[0].slug);
  const bagRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const category = priceList.find((c) => c.slug === cat)!;
  const effectiveMode: Mode = category.columns === "price" ? "dc" : mode;

  const lines = Object.values(bag).filter((l) => l.qty > 0);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);
  const extra = speeds.find((s) => s.id === speed)!.extra;
  const total = Math.round(subtotal * (1 + extra));

  const dcLines = lines.filter((l) => l.mode === "dc" && l.category !== "household");
  const dcCount = dcLines.reduce((n, l) => n + l.qty, 0);
  const dcTotal = dcLines.reduce((n, l) => n + l.qty * l.price, 0);
  const belowMinimum = dcCount > 0 && dcCount < 7 && dcTotal < 1000;

  const fill = Math.min(1, count / 14);
  const shownTotal = useCountUp(total);

  const change = (item: string, price: number, delta: number) => {
    const key = `${cat}:${effectiveMode}:${item}`;
    setBag((b) => {
      const current = b[key]?.qty ?? 0;
      const qty = Math.max(0, Math.min(99, current + delta));
      return { ...b, [key]: { key, item, mode: effectiveMode, price, qty, category: cat } };
    });
    if (delta > 0 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      bagRef.current?.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.14) rotate(-5deg)" }, { transform: "scale(1)" }],
        { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" },
      );
    }
  };

  const store = stores.find((s) => s.slug === storeSlug)!;
  const message = useMemo(() => {
    const rows = lines.map(
      (l) => `• ${l.item}${l.mode === "press" ? " (steam press)" : ""} × ${l.qty} = ${inr(l.qty * l.price)}`,
    );
    return [
      `Hi EcoSpin ${store.area}! I’d like to book a free pickup. 🧺`,
      ``,
      `*My laundry bag (${count} ${count === 1 ? "item" : "items"}):*`,
      ...rows,
      ``,
      `Delivery: ${speeds.find((s) => s.id === speed)!.label}`,
      `*Estimated total: ${inr(total)}*`,
      name.trim() ? `\nName: ${name.trim()}` : "",
      address.trim() ? `Pickup address: ${address.trim()}` : "",
    ]
      .filter((l, i, arr) => l !== "" || (arr[i - 1] ?? "") !== "")
      .join("\n")
      .trim();
  }, [lines, speed, total, store, count, name, address]);
  const waLink = lines.length ? waHref(store.whatsapp, message) : undefined;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
      {/* ---------- Picker ---------- */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div role="tablist" aria-label="Category" className="flex flex-wrap gap-2">
            {priceList.map((c) => (
              <button
                key={c.slug}
                type="button"
                role="tab"
                aria-selected={cat === c.slug}
                onClick={() => setCat(c.slug)}
                className="display rounded-full px-4 py-1.5 text-xl text-purple sm:px-5 sm:py-2 sm:text-2xl ring-1 ring-lilac hover:bg-white aria-selected:bg-purple aria-selected:text-white aria-selected:ring-purple"
              >
                {c.title}
              </button>
            ))}
          </div>
          {category.columns === "dc+press" && (
            <div className="flex max-w-full rounded-full bg-white p-1 ring-1 ring-lilac" role="radiogroup" aria-label="Service">
              {(["dc", "press"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={mode === m}
                  onClick={() => setMode(m)}
                  className="rounded-full px-4 py-1.5 text-sm font-semibold text-purple aria-checked:bg-eco aria-checked:text-white"
                >
                  {m === "dc" ? "Dry clean" : "Steam press only"}
                </button>
              ))}
            </div>
          )}
        </div>

        <ul data-lenis-prevent className="mt-6 grid max-h-[34rem] gap-2 overflow-y-auto overscroll-contain pr-1 sm:grid-cols-2">
          {category.rows.map((r) => {
            const price = effectiveMode === "press" ? r.press : r.dc;
            const key = `${cat}:${effectiveMode}:${r.item}`;
            const qty = bag[key]?.qty ?? 0;
            const disabled = price == null;
            return (
              <li
                key={r.item}
                className={`flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 ring-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-14px_rgba(92,35,123,0.5)] ${
                  qty > 0 ? "ring-2 ring-purple" : "ring-lilac/70"
                } ${disabled ? "opacity-40" : ""}`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium" title={r.item}>
                    {r.item}
                  </p>
                  <p className="text-sm font-semibold text-purple">{price != null ? inr(price) : "Not available"}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {qty > 0 && (
                    <>
                      <button
                        type="button"
                        aria-label={`Remove one ${r.item}`}
                        onClick={() => change(r.item, price!, -1)}
                        className="grid size-8 place-items-center rounded-full bg-lavender text-purple hover:bg-lilac"
                      >
                        <Minus className="size-4" />
                      </button>
                      <span className="w-6 text-center font-semibold tabular-nums">{qty}</span>
                    </>
                  )}
                  <button
                    type="button"
                    disabled={disabled}
                    aria-label={`Add ${r.item}`}
                    onClick={() => change(r.item, price!, 1)}
                    className="grid size-8 place-items-center rounded-full bg-purple text-white hover:bg-purple-deep disabled:cursor-not-allowed"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ---------- Bag ---------- */}
      <div
        id="your-bag"
        className="relative min-w-0 scroll-mt-28 self-start overflow-hidden rounded-[2rem] bg-gradient-to-br from-purple via-purple-bright to-purple p-6 text-white shadow-[0_40px_80px_-40px_rgba(92,35,123,0.8)] md:p-8 lg:sticky lg:top-28"
      >
        <span aria-hidden="true" className="porthole-spin pointer-events-none absolute -top-24 -right-24 size-64 rounded-full border-2 border-dashed border-white/15" />
        <div className="flex items-center gap-5">
          <div ref={bagRef} className="shrink-0">
            <LaundryBag fill={fill} />
          </div>
          <div>
            <p className="text-sm text-white/70">Your laundry bag</p>
            <p className="display text-5xl tabular-nums">{inr(shownTotal)}</p>
            <p className="text-sm text-white/70">
              {count} {count === 1 ? "item" : "items"}
              {extra > 0 && ` · includes ${extra * 100}% express`}
            </p>
          </div>
        </div>

        {lines.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-white/10 p-4 text-sm text-white/80">
            Tap + on anything you want cleaned. Your bag fills up as you go.
          </p>
        ) : (
          <ul data-lenis-prevent className="mt-6 max-h-48 space-y-2 overflow-y-auto overscroll-contain pr-1 text-sm">
            {lines.map((l) => (
              <li key={l.key} className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate">
                  {l.qty} × {l.item}
                  {l.mode === "press" && <span className="text-white/50"> (press)</span>}
                </span>
                <span className="flex items-center gap-2 tabular-nums">
                  {inr(l.qty * l.price)}
                  <button
                    type="button"
                    aria-label={`Remove ${l.item}`}
                    onClick={() => setBag((b) => ({ ...b, [l.key]: { ...l, qty: 0 } }))}
                    className="text-white/40 hover:text-white"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}

        <fieldset className="mt-6">
          <legend className="text-sm font-semibold text-white/80">Delivery speed</legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {speeds.map((s) => (
              <label
                key={s.id}
                className="cursor-pointer rounded-xl bg-white/10 px-3 py-2 text-center ring-1 ring-white/15 transition-colors has-[:checked]:bg-white has-[:checked]:text-purple has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-mint"
              >
                <input
                  type="radio"
                  name="speed"
                  className="sr-only"
                  checked={speed === s.id}
                  onChange={() => setSpeed(s.id)}
                />
                <span className="block text-sm font-semibold">{s.label}</span>
                <span className="block text-xs opacity-70">{s.note}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {belowMinimum && (
          <p className="mt-4 rounded-xl bg-white/15 px-4 py-3 text-sm text-[#fff1b8]">
            Dry cleaning needs at least 7 garments or a ₹1,000 bill — add {7 - dcCount} more{" "}
            {7 - dcCount === 1 ? "garment" : "garments"} or {inr(1000 - dcTotal)} worth.
          </p>
        )}

        <div className="mt-6 grid gap-2">
          <label className="sr-only" htmlFor="bag-name">Your name</label>
          <input
            id="bag-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            autoComplete="name"
            className="w-full rounded-xl bg-white/15 px-4 py-3 text-white placeholder:text-white/60 outline-none ring-1 ring-white/20 focus:ring-white"
          />
          <label className="sr-only" htmlFor="bag-address">Pickup address</label>
          <input
            id="bag-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Pickup address (optional)"
            autoComplete="street-address"
            className="w-full rounded-xl bg-white/15 px-4 py-3 text-white placeholder:text-white/60 outline-none ring-1 ring-white/20 focus:ring-white"
          />
        </div>

        <p className="mt-5 text-sm font-semibold text-white/85">Send to store</p>
        <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Store">
          {stores.map((s) => (
            <button
              key={s.slug}
              type="button"
              role="radio"
              aria-checked={storeSlug === s.slug}
              onClick={() => setStoreSlug(s.slug)}
              className="rounded-xl px-3 py-2 text-sm font-semibold ring-1 ring-white/25 transition-colors aria-checked:bg-white aria-checked:text-purple"
            >
              {s.area.split(",")[0]}
            </button>
          ))}
        </div>

        <a
          href={waLink}
          aria-disabled={lines.length === 0}
          target="_blank"
          rel="noopener noreferrer"
          data-magnetic
          className="btn-shine mt-4 flex items-center justify-center gap-2 rounded-full bg-eco px-6 py-4 text-lg font-semibold text-white aria-disabled:pointer-events-none aria-disabled:opacity-40"
        >
          <WhatsAppIcon className="size-6" /> Send this bag on WhatsApp
        </a>
        <p className="mt-3 text-center text-xs text-white/60">
          Estimate only. Kids’ clothes (up to 10 yrs) cost about 70% of these prices.{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-white">
            Terms apply
          </Link>
          .
        </p>
      </div>

      {/* Mobile quick bar */}
      {count > 0 && (
        <div className="fixed right-20 bottom-4 left-3 z-40 flex animate-[pop-in_.4s_cubic-bezier(.2,.8,.2,1)] items-center gap-2 rounded-full bg-gradient-to-r from-purple to-purple-bright p-1.5 pl-5 text-white shadow-[0_20px_40px_-15px_rgba(92,35,123,0.8)] lg:hidden">
          <a href="#your-bag" className="min-w-0 flex-1">
            <span className="block text-xs text-white/75">
              {count} {count === 1 ? "item" : "items"} · view bag
            </span>
            <span className="display block text-2xl leading-none tabular-nums">{inr(shownTotal)}</span>
          </a>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full bg-eco px-4 py-3 text-sm font-semibold"
          >
            <WhatsAppIcon className="size-4" /> Send
          </a>
        </div>
      )}
    </div>
  );
}

function LaundryBag({ fill }: { fill: number }) {
  const level = 150 - fill * 92; // y of the fill line
  return (
    <svg viewBox="0 0 120 160" className="h-28 w-20" aria-hidden="true">
      <defs>
        <clipPath id="bag-shape">
          <path d="M20,40 Q10,40 12,60 L18,140 Q20,154 34,154 L86,154 Q100,154 102,140 L108,60 Q110,40 100,40 Z" />
        </clipPath>
      </defs>
      <path d="M38,40 Q36,14 60,14 Q84,14 82,40" fill="none" stroke="#c9b8db" strokeWidth="6" strokeLinecap="round" />
      <path d="M20,40 Q10,40 12,60 L18,140 Q20,154 34,154 L86,154 Q100,154 102,140 L108,60 Q110,40 100,40 Z" fill="#ffffff" opacity="0.12" />
      <g clipPath="url(#bag-shape)">
        <rect x="0" y={level} width="120" height="160" fill="#9cf5ae" style={{ transition: "y 0.5s cubic-bezier(.2,.8,.2,1)" }} />
        <path
          d={`M0,${level} Q15,${level - 6} 30,${level} T60,${level} T90,${level} T120,${level} V${level + 8} H0 Z`}
          fill="#c7ffd2"
          style={{ transition: "d 0.5s" }}
        />
      </g>
      <path d="M20,40 Q10,40 12,60 L18,140 Q20,154 34,154 L86,154 Q100,154 102,140 L108,60 Q110,40 100,40 Z" fill="none" stroke="#ffffff" strokeWidth="4" />
      <text x="60" y="108" textAnchor="middle" fontFamily="Barlow Condensed, sans-serif" fontStyle="italic" fontWeight="700" fontSize="22" fill="#34114a">
        ECO
      </text>
    </svg>
  );
}
