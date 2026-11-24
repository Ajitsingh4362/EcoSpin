import { stores } from "@/data/site";
import { adminConfig, speeds } from "../config";
import type { OrderItem, Packing, Speed, StoreSlug } from "../types";

const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export const getStore = (slug: StoreSlug) => stores.find((s) => s.slug === slug)!;

/** Adds the store's turnaround in working days, skipping its weekly closed day. */
export function dueDateFor(slug: StoreSlug, speed: Speed, from = new Date()): string {
  const store = getStore(slug);
  const closed = weekdays.indexOf(store.closedOn.toLowerCase());
  const days = speed === "same" ? 0 : speed === "next" ? 1 : store.turnaroundDays;
  const d = new Date(from);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== closed) added++;
  }
  return toYmd(d);
}

export function computeTotals(
  items: Pick<OrderItem, "price" | "qty">[],
  speed: Speed,
  packing: Packing,
  discount: number,
) {
  const pieces = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((n, i) => n + i.qty * i.price, 0);
  const extra = speeds.find((s) => s.id === speed)!.extra;
  const expressCharge = Math.round(subtotal * extra);
  const hangerCharge = packing === "hanger" ? pieces * adminConfig.hangerChargePerPiece : 0;
  const safeDiscount = Math.max(0, Math.min(discount || 0, subtotal + expressCharge + hangerCharge));
  const total = subtotal + expressCharge + hangerCharge - safeDiscount;
  return { pieces, subtotal, expressCharge, hangerCharge, discount: safeDiscount, total };
}

export const toYmd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const todayYmd = () => toYmd(new Date());

export const fmtDate = (isoOrYmd: string) =>
  new Date(isoOrYmd.length === 10 ? `${isoOrYmd}T00:00:00` : isoOrYmd).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export const cleanPhone = (raw: string) => raw.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");

export const isValidPhone = (p: string) => /^[6-9]\d{9}$/.test(p);
