"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { priceList, inr } from "@/data/site";

export function PriceTable() {
  const [tab, setTab] = useState(priceList[0].slug);
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const visible = useMemo(() => {
    if (!query) return priceList.filter((c) => c.slug === tab);
    return priceList
      .map((c) => ({ ...c, rows: c.rows.filter((r) => r.item.toLowerCase().includes(query)) }))
      .filter((c) => c.rows.length > 0);
  }, [tab, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div role="tablist" aria-label="Price categories" className="flex flex-wrap gap-2">
          {priceList.map((c) => (
            <button
              key={c.slug}
              role="tab"
              type="button"
              aria-selected={!query && tab === c.slug}
              onClick={() => {
                setTab(c.slug);
                setQ("");
              }}
              className="display rounded-full px-4 py-1.5 text-xl text-purple sm:px-5 sm:py-2 sm:text-2xl ring-1 ring-lilac hover:bg-lavender aria-selected:bg-purple aria-selected:text-white aria-selected:ring-purple"
            >
              {c.title}
            </button>
          ))}
        </div>
        <label className="relative block md:w-80">
          <span className="sr-only">Search garments</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search, e.g. saree, blanket"
            className="w-full rounded-full border border-lilac bg-white py-3 pr-4 pl-12 outline-none focus:border-purple"
          />
        </label>
      </div>

      {visible.length === 0 && (
        <p className="mt-10 rounded-2xl bg-lavender p-6 text-ink/80">
          “{q}” isn’t on the list. Unlisted items are charged in proportion to a similar garment — call or WhatsApp
          either store for a quote.
        </p>
      )}

      {visible.map((c) => (
        <div key={c.slug} className="mt-8 overflow-x-auto">
          {query && <h2 className="display mb-2 text-3xl text-purple">{c.title}</h2>}
          <table className="w-full min-w-[22rem] text-left">
            <caption className="sr-only">{c.title} prices</caption>
            <thead>
              <tr className="border-b-2 border-purple text-sm text-muted">
                <th scope="col" className="py-3 font-medium">Item</th>
                <th scope="col" className="py-3 text-right font-medium">
                  {c.columns === "price" ? "Price" : "Dry clean"}
                </th>
                {c.columns === "dc+press" && (
                  <th scope="col" className="py-3 pl-4 text-right font-medium">Steam press only</th>
                )}
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r) => (
                <tr key={r.item} className="border-b border-lilac/70">
                  <th scope="row" className="py-3.5 pr-4 font-medium">{r.item}</th>
                  <td className="py-3.5 text-right text-lg font-semibold text-purple tabular-nums">
                    {r.dc != null ? inr(r.dc) : "—"}
                  </td>
                  {c.columns === "dc+press" && (
                    <td className="py-3.5 pl-4 text-right tabular-nums text-ink/75">
                      {r.press != null ? inr(r.press) : <span aria-label="Not available">—</span>}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
