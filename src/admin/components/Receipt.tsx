import { LogoEn } from "@/components/Logo";
import { formatPhone, inr } from "@/data/site";
import { adminConfig, paymentLabel, speeds } from "../config";
import { fmtDate, fmtDateTime, getStore } from "../lib/calc";
import type { Order } from "../types";

/** Customer copy, sized for an 80 mm thermal printer (also prints fine on A4/A5). */
export function Receipt({ order }: { order: Order }) {
  const store = getStore(order.storeSlug);
  // Tag numbers run across the order: items 1–3, 4–5, …
  const ranges = order.items.map((_, i) => {
    const before = order.items.slice(0, i).reduce((n, x) => n + x.qty, 0);
    return [before + 1, before + order.items[i].qty] as const;
  });
  return (
    <div className="receipt print-area">
      <div className="text-center">
        <LogoEn className="receipt-logo mx-auto h-auto w-[56mm] max-w-full text-black" />
        <p className="mt-2 text-[10px] leading-tight">{store.address.join(", ")}</p>
        <p className="text-[10px]">Call {formatPhone(store.call)} · WhatsApp {formatPhone(store.whatsapp)}</p>
      </div>

      <div className="r-rule" />
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px]">Order no.</p>
          <p className="display text-2xl leading-none">{order.orderNo}</p>
        </div>
        <div className="text-right text-[11px] leading-tight">
          <p>{fmtDateTime(order.createdAt)}</p>
          <p className="font-bold">Ready by {fmtDate(order.dueDate)}</p>
        </div>
      </div>

      <div className="r-rule" />
      <p className="text-[12px] font-bold">{order.customerName}</p>
      <p className="text-[11px]">{formatPhone(order.customerPhone)}</p>
      {order.customerAddress && <p className="text-[10px] leading-tight">{order.customerAddress}</p>}

      <div className="r-rule" />
      <table className="w-full text-[11px]">
        <thead>
          <tr className="text-left">
            <th className="font-semibold">Item</th>
            <th className="text-right font-semibold">Qty</th>
            <th className="text-right font-semibold">Amt</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((i, n) => {
            const [from, tag] = ranges[n];
            return (
              <tr key={i.id} className="align-top">
                <td className="pr-1 pt-1 leading-tight">
                  {i.name}
                  {i.mode === "press" ? " (press)" : ""}
                  <span className="block text-[9px]">
                    Tag {from === tag ? from : `${from}–${tag}`} · {inr(i.price)} ea{i.note ? ` · ${i.note}` : ""}
                  </span>
                </td>
                <td className="pt-1 text-right">{i.qty}</td>
                <td className="pt-1 text-right">{inr(i.qty * i.price)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="r-rule" />
      <dl className="r-totals text-[11px]">
        <dt>Pieces</dt>
        <dd>{order.pieces}</dd>
        <dt>Subtotal</dt>
        <dd>{inr(order.subtotal)}</dd>
        {order.expressCharge > 0 && (
          <>
            <dt>{speeds.find((s) => s.id === order.speed)!.label}</dt>
            <dd>{inr(order.expressCharge)}</dd>
          </>
        )}
        {order.hangerCharge > 0 && (
          <>
            <dt>Hanger packing</dt>
            <dd>{inr(order.hangerCharge)}</dd>
          </>
        )}
        {order.discount > 0 && (
          <>
            <dt>Discount</dt>
            <dd>−{inr(order.discount)}</dd>
          </>
        )}
      </dl>
      <div className="mt-1 flex items-baseline justify-between border-t border-black pt-1">
        <span className="text-[12px] font-bold">Total</span>
        <span className="display text-2xl leading-none">{inr(order.total)}</span>
      </div>
      <dl className="r-totals text-[11px]">
        {order.payments.map((p) => (
          <FragmentRow key={p.id} label={`Paid (${paymentLabel[p.mode]})`} value={inr(p.amount)} />
        ))}
        <dt className="font-bold">Balance</dt>
        <dd className="font-bold">{order.balance > 0 ? inr(order.balance) : "Nil"}</dd>
      </dl>

      <div className="r-rule" />
      <p className="text-[10px]">
        Packing: {order.packing === "hanger" ? "On hangers" : "Folded"} · {order.homeDelivery ? "Home delivery" : "Collect from store"}
      </p>
      {order.note && <p className="text-[10px]">Note: {order.note}</p>}
      <ul className="mt-1 list-disc pl-3 text-[9px] leading-snug">
        {adminConfig.receiptTerms.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <p className="mt-1 text-[9px]">Complaints: {formatPhone(adminConfig.complaintsPhone)}</p>
      <p className="mt-2 text-center text-[11px] font-semibold">Thank you!</p>
    </div>
  );
}

function FragmentRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  );
}
