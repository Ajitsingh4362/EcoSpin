"use client";

import { useMemo, useRef, useState } from "react";
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

export function BagBuilder() {
  const [cat, setCat] = useState(priceList[0].slug);
  const [mode, setMode] = useState<Mode>("dc");
  const [bag, setBag] = useState<Record<string, Line>>({});
  const [speed, setSpeed] = useState<(typeof speeds)[number]["id"]>("regular");
  const [storeSlug, setStoreSlug] = useState<string>(stores[0].slug);
  const bagRef = useRef<HTMLDivElement>(null);

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

  const message = useMemo(() => {
    const store = stores.find((s) => s.slug === storeSlug)!;
    const rows = lines.map(
      (l) => `• ${l.item}${l.mode === "press" ? " (steam press)" : ""} × ${l.qty} = ${inr(l.qty * l.price)}`,
    );
    return [
      `Hi EcoSpin ${store.area}, I’d like to book a pickup for:`,
      ...rows,
      ``,
      `Delivery: ${speeds.find((s) => s.id === speed)!.label}`,
      `Estimated total: ${inr(total)}`,
    ].join("\n");
  }, [lines, speed, total, storeSlug]);

  const store = stores.find((s) => s.slug === storeSlug)!;

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

        <ul className="mt-6 grid max-h-[34rem] gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
          {category.rows.map((r) => {
            const price = effectiveMode === "press" ? r.press : r.dc;
            const key = `${cat}:${effectiveMode}:${r.item}`;
            const qty = bag[key]?.qty ?? 0;
            const disabled = price == null;
            return (
              <li
                key={r.item}
                className={`flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 ring-1 transition-colors ${
                  qty > 0 ? "ring-purple" : "ring-lilac/70"
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
      <div id="your-bag" className="min-w-0 self-start rounded-[2rem] bg-purple-deep p-6 text-white md:p-8 lg:sticky lg:top-28">
        <div className="flex items-center gap-5">
          <div ref={bagRef} className="shrink-0">
            <LaundryBag fill={fill} />
          </div>
          <div>
            <p className="text-sm text-white/60">Your bag</p>
            <p className="display text-5xl tabular-nums">{inr(total)}</p>
            <p className="text-sm text-white/70">
              {count} {count === 1 ? "item" : "items"}
              {extra > 0 && ` · includes ${extra * 100}% express`}
            </p>
          </div>
        </div>

        {lines.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-white/5 p-4 text-sm text-white/70">
            Tap + on anything you want cleaned. Your bag fills up as you go.
          </p>
        ) : (
          <ul className="mt-6 max-h-48 space-y-2 overflow-y-auto pr-1 text-sm">
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
                className="cursor-pointer rounded-xl bg-white/5 px-3 py-2 text-center ring-1 ring-white/10 has-[:checked]:bg-white has-[:checked]:text-purple has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-mint"
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
          <p className="mt-4 rounded-xl bg-[#f2c14e]/15 px-4 py-3 text-sm text-[#ffe29a]">
            Dry cleaning needs at least 7 garments or a ₹1,000 bill — add {7 - dcCount} more{" "}
            {7 - dcCount === 1 ? "garment" : "garments"} or {inr(1000 - dcTotal)} worth.
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Store">
          {stores.map((s) => (
            <button
              key={s.slug}
              type="button"
              role="radio"
              aria-checked={storeSlug === s.slug}
              onClick={() => setStoreSlug(s.slug)}
              className="rounded-xl px-3 py-2 text-sm font-semibold ring-1 ring-white/15 aria-checked:bg-white/15 aria-checked:ring-white/60"
            >
              {s.area.split(",")[0]}
            </button>
          ))}
        </div>

        <a
          href={lines.length ? waHref(store.whatsapp, message) : undefined}
          aria-disabled={lines.length === 0}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 rounded-full bg-eco px-6 py-3.5 font-semibold text-white hover:brightness-110 aria-disabled:pointer-events-none aria-disabled:opacity-40"
        >
          <WhatsAppIcon className="size-5" /> Send bag & book pickup
        </a>
        <p className="mt-3 text-center text-xs text-white/50">
          Estimate only. Kids’ clothes (up to 10 yrs) cost about 70% of these prices.
        </p>
      </div>

      {/* Mobile quick bar */}
      {count > 0 && (
        <a
          href="#your-bag"
          className="fixed right-24 bottom-5 left-4 z-40 flex items-center justify-between rounded-full bg-purple-deep px-5 py-3 text-white shadow-xl lg:hidden"
        >
          <span className="text-sm">
            {count} {count === 1 ? "item" : "items"} in bag
          </span>
          <span className="display text-2xl">{inr(total)}</span>
        </a>
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
