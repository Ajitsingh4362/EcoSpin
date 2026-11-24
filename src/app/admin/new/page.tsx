"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Search, Trash2, UserCheck } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { inr, priceList } from "@/data/site";
import { repo } from "@/admin/data";
import { adminConfig, paymentLabel, speeds } from "@/admin/config";
import { cleanPhone, computeTotals, dueDateFor, fmtDate, isValidPhone } from "@/admin/lib/calc";
import { prepareWhatsAppTab } from "@/admin/lib/whatsapp";
import { useAdminStore } from "@/admin/hooks";
import type { Packing, PaymentMode, ServiceMode, Speed } from "@/admin/types";

type Line = { key: string; name: string; category: string; mode: ServiceMode; price: number; qty: number; note: string };

const input =
  "w-full rounded-lg border border-lilac bg-white px-3 py-2.5 text-base text-ink placeholder:text-muted/70 focus:border-purple focus:outline-none";

export default function NewOrderPage() {
  const router = useRouter();
  const { store } = useAdminStore();

  // Customer
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [homeDelivery, setHomeDelivery] = useState(false);
  const [returning, setReturning] = useState<string | null>(null);

  // Menu
  const [cat, setCat] = useState(priceList[0].slug);
  const [mode, setMode] = useState<ServiceMode>("dc");
  const [query, setQuery] = useState("");
  const [custom, setCustom] = useState({ name: "", price: "" });

  // Bill
  const [lines, setLines] = useState<Line[]>([]);
  const [speed, setSpeed] = useState<Speed>("regular");
  const [packing, setPacking] = useState<Packing>("fold");
  const [discount, setDiscount] = useState("");
  const [advance, setAdvance] = useState("");
  const [payMode, setPayMode] = useState<PaymentMode>("cash");
  const [note, setNote] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const billRef = useRef<HTMLDivElement>(null);

  const category = priceList.find((c) => c.slug === cat);

  const menu = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) {
      // Search across every category.
      return priceList.flatMap((c) =>
        c.rows
          .filter((r) => r.item.toLowerCase().includes(q))
          .map((r) => ({ cat: c.slug, catTitle: c.title, item: r.item, price: effectiveFor(c.columns, r, mode) })),
      );
    }
    if (!category) return [];
    return category.rows.map((r) => ({
      cat: category.slug,
      catTitle: category.title,
      item: r.item,
      price: effectiveFor(category.columns, r, mode),
    }));
  }, [query, category, mode]);

  const totals = computeTotals(lines, speed, packing, Number(discount) || 0);
  const due = dueDateFor(store, speed);

  function add(item: string, category: string, m: ServiceMode, price: number) {
    const key = `${category}:${m}:${item}`;
    setLines((ls) => {
      const found = ls.find((l) => l.key === key);
      if (found) return ls.map((l) => (l.key === key ? { ...l, qty: Math.min(999, l.qty + 1) } : l));
      return [...ls, { key, name: item, category, mode: m, price, qty: 1, note: "" }];
    });
    setErrors((e) => ({ ...e, items: "" }));
  }

  const change = (key: string, patch: Partial<Line>) =>
    setLines((ls) => ls.map((l) => (l.key === key ? { ...l, ...patch } : l)).filter((l) => l.qty > 0));

  const qtyOf = (item: string, c: string, m: ServiceMode) => lines.find((l) => l.key === `${c}:${m}:${item}`)?.qty ?? 0;

  async function onPhone(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 12);
    setPhone(digits);
    setErrors((e) => ({ ...e, phone: "" }));
    const p = cleanPhone(digits);
    if (!isValidPhone(p)) return setReturning(null);
    const c = await repo.findCustomerByPhone(p);
    if (c) {
      setReturning(c.name);
      setName((n) => n || c.name);
      setAddress((a) => a || c.address);
    } else setReturning(null);
  }

  function addCustom() {
    const price = Math.round(Number(custom.price));
    if (!custom.name.trim() || !(price > 0)) return;
    add(custom.name.trim(), "custom", "dc", price);
    setCustom({ name: "", price: "" });
  }

  async function save() {
    const p = cleanPhone(phone);
    const errs: Record<string, string> = {};
    if (!isValidPhone(p)) errs.phone = "Enter a 10-digit mobile number.";
    if (!name.trim()) errs.name = "Enter the customer’s name.";
    if (homeDelivery && !address.trim()) errs.address = "Add the address for home delivery.";
    if (!lines.length) errs.items = "Tap at least one item from the menu.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.getElementById(Object.keys(errs)[0] === "items" ? "menu" : "customer")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setSaving(true);
    const wa = prepareWhatsAppTab(); // must open inside the click
    try {
      const order = await repo.createOrder({
        storeSlug: store,
        customer: { name: name.trim(), phone: p, address: address.trim() },
        items: lines.map(({ name, category, mode, price, qty, note }) => ({ name, category, mode, price, qty, note })),
        speed,
        packing,
        homeDelivery,
        discount: Number(discount) || 0,
        advance: Number(advance) > 0 ? { amount: Math.round(Number(advance)), mode: payMode } : null,
        note: note.trim(),
      });
      wa.go(order, "order-received");
      router.push(`/admin/order?id=${order.id}&new=1`);
    } catch (e) {
      wa.close();
      setSaving(false);
      setErrors({ save: e instanceof Error ? e.message : "Could not save the order. Try again." });
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
      <div className="min-w-0 space-y-6">
        {/* ---------- Customer ---------- */}
        <section id="customer" className="scroll-mt-24 rounded-2xl bg-white p-5 ring-1 ring-lilac/70">
          <h1 className="display text-4xl text-purple-deep">New order</h1>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Mobile number" error={errors.phone}>
              <input
                className={input}
                inputMode="numeric"
                autoComplete="off"
                placeholder="98xxxxxxxx"
                value={phone}
                onChange={(e) => onPhone(e.target.value)}
                autoFocus
              />
              {returning && (
                <span className="mt-1.5 inline-flex items-center gap-1 text-sm font-semibold text-eco">
                  <UserCheck className="size-4" /> Returning customer: {returning}
                </span>
              )}
            </Field>
            <Field label="Name" error={errors.name}>
              <input
                className={input}
                autoComplete="off"
                placeholder="Customer name"
                value={name}
                onChange={(e) => (setName(e.target.value), setErrors((x) => ({ ...x, name: "" })))}
              />
            </Field>
            <Field label="Address" error={errors.address} className="sm:col-span-2">
              <textarea
                className={`${input} min-h-[72px] resize-y`}
                placeholder="Flat, building, area"
                value={address}
                onChange={(e) => (setAddress(e.target.value), setErrors((x) => ({ ...x, address: "" })))}
              />
            </Field>
          </div>
          <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              className="size-5 accent-purple"
              checked={homeDelivery}
              onChange={(e) => setHomeDelivery(e.target.checked)}
            />
            Home delivery
          </label>
        </section>

        {/* ---------- Menu ---------- */}
        <section id="menu" className="scroll-mt-24 rounded-2xl bg-white p-5 ring-1 ring-lilac/70">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Category">
              {priceList.map((c) => (
                <button
                  key={c.slug}
                  role="tab"
                  aria-selected={!query && cat === c.slug}
                  onClick={() => (setCat(c.slug), setQuery(""))}
                  className={`rounded-lg px-4 py-2 text-sm font-bold ${
                    !query && cat === c.slug ? "bg-purple text-white" : "bg-lavender text-purple hover:bg-lilac/60"
                  }`}
                >
                  {c.title}
                </button>
              ))}
              <button
                role="tab"
                aria-selected={!query && cat === "custom"}
                onClick={() => (setCat("custom"), setQuery(""))}
                className={`rounded-lg px-4 py-2 text-sm font-bold ${
                  !query && cat === "custom" ? "bg-purple text-white" : "bg-lavender text-purple hover:bg-lilac/60"
                }`}
              >
                Other item
              </button>
            </div>

            {(query || category?.columns === "dc+press") && (
              <div role="radiogroup" aria-label="Service" className="flex rounded-lg bg-lavender p-0.5">
                {(["dc", "press"] as const).map((m) => (
                  <button
                    key={m}
                    role="radio"
                    aria-checked={mode === m}
                    onClick={() => setMode(m)}
                    className={`rounded-md px-3 py-1.5 text-sm font-bold ${
                      mode === m ? "bg-white text-purple-deep shadow-sm" : "text-purple"
                    }`}
                  >
                    {m === "dc" ? "Dry clean" : "Press only"}
                  </button>
                ))}
              </div>
            )}

            <label className="relative ml-auto w-full sm:w-56">
              <span className="sr-only">Search items</span>
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
              <input
                className={`${input} py-2 pl-9 text-sm`}
                placeholder="Search item"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>

          {errors.items && <p className="mt-3 text-sm font-semibold text-red-600">{errors.items}</p>}

          {!query && cat === "custom" ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_140px_auto] sm:items-end">
              <Field label="Item name">
                <input
                  className={input}
                  placeholder="e.g. Kids jacket"
                  value={custom.name}
                  onChange={(e) => setCustom((c) => ({ ...c, name: e.target.value }))}
                />
              </Field>
              <Field label="Price per piece (₹)">
                <input
                  className={input}
                  inputMode="numeric"
                  value={custom.price}
                  onChange={(e) => setCustom((c) => ({ ...c, price: e.target.value.replace(/\D/g, "") }))}
                  onKeyDown={(e) => e.key === "Enter" && addCustom()}
                />
              </Field>
              <button onClick={addCustom} className="h-[46px] rounded-lg bg-purple px-5 font-bold text-white">
                Add
              </button>
            </div>
          ) : (
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
              {menu.map((m) => {
                const itemMode: ServiceMode = priceList.find((c) => c.slug === m.cat)!.columns === "price" ? "dc" : mode;
                const qty = qtyOf(m.item, m.cat, itemMode);
                const disabled = m.price == null;
                return (
                  <li key={`${m.cat}:${m.item}`}>
                    <button
                      disabled={disabled}
                      onClick={() => add(m.item, m.cat, itemMode, m.price!)}
                      className={`relative flex h-full min-h-[76px] w-full flex-col justify-between rounded-xl p-3 text-left ring-1 transition active:scale-[0.97] disabled:opacity-40 ${
                        qty ? "bg-purple text-white ring-purple" : "bg-white text-ink ring-lilac hover:ring-purple"
                      }`}
                    >
                      <span className="text-sm leading-snug font-semibold">{m.item}</span>
                      <span className={`mt-1 text-sm ${qty ? "text-lilac" : "text-muted"}`}>
                        {disabled ? "Not offered" : inr(m.price!)}
                        {query && <span className="ml-1 text-xs">· {m.catTitle}</span>}
                      </span>
                      {qty > 0 && (
                        <span className="display absolute top-2 right-2 grid min-w-7 place-items-center rounded-full bg-eco px-1.5 text-lg leading-7 text-white">
                          {qty}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
              {menu.length === 0 && (
                <li className="col-span-full py-6 text-center text-muted">
                  No item matches “{query}”. Use <b>Other item</b> to add it with your own price.
                </li>
              )}
            </ul>
          )}
        </section>
      </div>

      {/* ---------- Bill ---------- */}
      <aside ref={billRef} id="bill" className="scroll-mt-24 rounded-2xl bg-white ring-1 ring-lilac/70 lg:sticky lg:top-20">
        <div className="flex items-baseline justify-between border-b border-lilac/70 px-5 py-4">
          <h2 className="text-lg font-bold text-purple-deep">Bill</h2>
          <span className="text-sm text-muted">{totals.pieces} pcs</span>
        </div>

        <ul className="max-h-[38vh] divide-y divide-lilac/50 overflow-y-auto px-5">
          {lines.length === 0 && <li className="py-6 text-center text-sm text-muted">Tap items in the menu to add them here.</li>}
          {lines.map((l) => (
            <li key={l.key} className="py-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm leading-snug font-semibold">
                    {l.name}
                    {l.mode === "press" && <span className="font-normal text-muted"> (press)</span>}
                  </p>
                  <p className="text-xs text-muted">{inr(l.price)} each</p>
                </div>
                <p className="text-sm font-bold whitespace-nowrap">{inr(l.price * l.qty)}</p>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center rounded-lg ring-1 ring-lilac">
                  <button aria-label="One less" onClick={() => change(l.key, { qty: l.qty - 1 })} className="p-2 text-purple">
                    <Minus className="size-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-bold">{l.qty}</span>
                  <button aria-label="One more" onClick={() => change(l.key, { qty: l.qty + 1 })} className="p-2 text-purple">
                    <Plus className="size-4" />
                  </button>
                </div>
                <input
                  className="min-w-0 flex-1 rounded-lg border border-lilac/70 px-2 py-1.5 text-xs placeholder:text-muted/60 focus:border-purple focus:outline-none"
                  placeholder="Colour / brand / damage"
                  value={l.note}
                  onChange={(e) => change(l.key, { note: e.target.value })}
                />
                <button aria-label={`Remove ${l.name}`} onClick={() => change(l.key, { qty: 0 })} className="p-1.5 text-muted hover:text-red-600">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="space-y-4 border-t border-lilac/70 px-5 py-4">
          <Segmented
            label="Delivery speed"
            value={speed}
            onChange={setSpeed}
            options={speeds.map((s) => ({ id: s.id, label: s.label }))}
          />
          <Segmented
            label="Packing"
            value={packing}
            onChange={setPacking}
            options={[
              { id: "fold", label: "Folded" },
              { id: "hanger", label: `Hanger +${inr(adminConfig.hangerChargePerPiece)}/pc` },
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Discount (₹)">
              <input className={`${input} py-2`} inputMode="numeric" value={discount} onChange={(e) => setDiscount(e.target.value.replace(/\D/g, ""))} />
            </Field>
            <Field label="Paid now (₹)">
              <input className={`${input} py-2`} inputMode="numeric" value={advance} onChange={(e) => setAdvance(e.target.value.replace(/\D/g, ""))} />
            </Field>
          </div>
          {Number(advance) > 0 && (
            <Segmented
              label="Paid by"
              value={payMode}
              onChange={setPayMode}
              options={(["cash", "upi", "card"] as const).map((m) => ({ id: m, label: paymentLabel[m] }))}
            />
          )}
          <Field label="Note for the order">
            <input className={`${input} py-2 text-sm`} placeholder="Optional" value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>
        </div>

        <div className="rounded-b-2xl bg-lavender/60 px-5 py-4">
          <dl className="grid grid-cols-[1fr_auto] gap-y-1 text-sm">
            <dt className="text-muted">Subtotal</dt>
            <dd className="text-right">{inr(totals.subtotal)}</dd>
            {totals.expressCharge > 0 && (
              <>
                <dt className="text-muted">Express</dt>
                <dd className="text-right">{inr(totals.expressCharge)}</dd>
              </>
            )}
            {totals.hangerCharge > 0 && (
              <>
                <dt className="text-muted">Hangers</dt>
                <dd className="text-right">{inr(totals.hangerCharge)}</dd>
              </>
            )}
            {totals.discount > 0 && (
              <>
                <dt className="text-muted">Discount</dt>
                <dd className="text-right">−{inr(totals.discount)}</dd>
              </>
            )}
            <dt className="text-muted">Ready by</dt>
            <dd className="text-right font-semibold">{fmtDate(due)}</dd>
          </dl>
          <div className="mt-3 flex items-end justify-between">
            <span className="text-sm font-semibold text-purple-deep">Total</span>
            <span className="display text-5xl leading-none text-purple-deep">{inr(totals.total)}</span>
          </div>
          {Number(advance) > 0 && (
            <p className="mt-1 text-right text-sm text-muted">
              Balance {inr(Math.max(0, totals.total - Math.min(Number(advance), totals.total)))}
            </p>
          )}
          {errors.save && <p className="mt-3 text-sm font-semibold text-red-600">{errors.save}</p>}
          <button
            onClick={save}
            disabled={saving}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-eco px-5 py-4 text-lg font-bold text-white hover:brightness-110 disabled:opacity-60"
          >
            <WhatsAppIcon className="size-5" />
            {saving ? "Saving…" : "Save order"}
          </button>
          <p className="mt-2 text-center text-xs text-muted">Opens WhatsApp with the bill for the customer, then the receipt to print.</p>
        </div>
      </aside>

      {/* Mobile: quick jump to the bill */}
      <div className="no-print fixed inset-x-0 bottom-0 z-20 border-t border-lilac bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          onClick={() => billRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="flex w-full items-center justify-between rounded-xl bg-purple-deep px-4 py-3 text-white"
        >
          <span className="text-sm font-semibold">{totals.pieces} pcs</span>
          <span className="display text-2xl leading-none">{inr(totals.total)}</span>
          <span className="text-sm font-bold">View bill</span>
        </button>
      </div>
    </div>
  );
}

function effectiveFor(columns: "dc+press" | "price", r: { dc: number | null; press?: number | null }, mode: ServiceMode) {
  if (columns === "price") return r.dc;
  return mode === "press" ? (r.press ?? null) : r.dc;
}

function Field({
  label,
  error,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-semibold text-ink">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm font-semibold text-red-600">{error}</span>}
    </label>
  );
}

function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div>
      <span className="mb-1 block text-sm font-semibold text-ink">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1 rounded-lg bg-lavender p-1">
        {options.map((o) => (
          <button
            key={o.id}
            role="radio"
            aria-checked={value === o.id}
            onClick={() => onChange(o.id)}
            className={`flex-1 rounded-md px-2 py-1.5 text-xs font-bold whitespace-nowrap ${
              value === o.id ? "bg-white text-purple-deep shadow-sm" : "text-purple"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
