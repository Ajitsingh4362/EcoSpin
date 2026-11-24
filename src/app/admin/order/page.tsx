"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Printer } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { formatPhone, inr, telHref } from "@/data/site";
import { repo } from "@/admin/data";
import { adminConfig, paymentLabel, statusFlow, statusLabel } from "@/admin/config";
import { fmtDate, fmtDateTime, getStore, todayYmd } from "@/admin/lib/calc";
import { messageLink, prepareWhatsAppTab } from "@/admin/lib/whatsapp";
import { useRepoQuery } from "@/admin/hooks";
import { Receipt } from "@/admin/components/Receipt";
import { StatusBadge } from "@/admin/components/StatusBadge";
import type { Order, OrderStatus, PaymentMode } from "@/admin/types";

export default function OrderPage() {
  return (
    <Suspense fallback={<p className="py-20 text-center text-muted">Loading order…</p>}>
      <OrderView />
    </Suspense>
  );
}

function OrderView() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const isNew = params.get("new") === "1";
  const { data: order, loading } = useRepoQuery(() => repo.getOrder(id), [id]);

  const printed = useRef(false);
  useEffect(() => {
    if (isNew && order && adminConfig.autoPrintOnSave && !printed.current) {
      printed.current = true;
      const t = setTimeout(() => window.print(), 400);
      return () => clearTimeout(t);
    }
  }, [isNew, order]);

  if (loading) return <p className="py-20 text-center text-muted">Loading order…</p>;
  if (!order)
    return (
      <div className="py-20 text-center">
        <p className="text-lg font-semibold">This order could not be found.</p>
        <Link href="/admin/orders" className="mt-3 inline-block font-semibold text-purple underline">
          Back to orders
        </Link>
      </div>
    );

  return <OrderDetail order={order} isNew={isNew} />;
}

function OrderDetail({ order, isNew }: { order: Order; isNew: boolean }) {
  const store = getStore(order.storeSlug);
  const idx = statusFlow.indexOf(order.status);
  const next = idx >= 0 && idx < statusFlow.length - 1 ? statusFlow[idx + 1] : null;
  const overdue = order.status !== "delivered" && order.status !== "cancelled" && order.dueDate < todayYmd();

  async function move(to: OrderStatus) {
    if (to === "ready") {
      const wa = prepareWhatsAppTab();
      const updated = await repo.setStatus(order.id, to);
      wa.go(updated, "order-ready");
      return;
    }
    if (to === "delivered" && order.balance > 0 && !confirm(`${inr(order.balance)} is still unpaid. Mark as delivered anyway?`)) return;
    if (to === "cancelled" && !confirm(`Cancel order ${order.orderNo}?`)) return;
    await repo.setStatus(order.id, to);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
      <div className="no-print min-w-0 space-y-5">
        <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-purple">
          <ArrowLeft className="size-4" /> Orders
        </Link>

        {isNew && (
          <div className="flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-900 ring-1 ring-emerald-200">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
            <div className="text-sm">
              <p className="font-bold">Order {order.orderNo} saved.</p>
              <p>
                WhatsApp opened in a new tab with the bill — press Send there. If it didn’t open,{" "}
                <a className="font-semibold underline" href={messageLink(order, "order-received")} target="_blank" rel="noreferrer">
                  open it again
                </a>
                .
              </p>
            </div>
          </div>
        )}

        <section className="rounded-2xl bg-white p-5 ring-1 ring-lilac/70">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted">{store.name}</p>
              <h1 className="display text-5xl leading-none text-purple-deep">{order.orderNo}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <StatusBadge status={order.status} />
                <span className={overdue ? "font-bold text-red-600" : "text-muted"}>
                  {overdue ? "Overdue · was due " : "Ready by "}
                  {fmtDate(order.dueDate)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="display text-4xl leading-none">{inr(order.total)}</p>
              <p className={`text-sm font-semibold ${order.balance > 0 ? "text-red-600" : "text-eco"}`}>
                {order.balance > 0 ? `${inr(order.balance)} due` : "Paid in full"}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-1 border-t border-lilac/60 pt-4 text-sm">
            <p className="text-base font-bold">{order.customerName}</p>
            <a href={telHref(order.customerPhone)} className="w-fit text-purple underline">
              {formatPhone(order.customerPhone)}
            </a>
            {order.customerAddress && <p className="text-muted">{order.customerAddress}</p>}
            <p className="text-muted">
              {order.pieces} pcs · {order.packing === "hanger" ? "On hangers" : "Folded"} ·{" "}
              {order.homeDelivery ? "Home delivery" : "Collect from store"}
            </p>
            {order.note && <p>Note: {order.note}</p>}
          </div>
        </section>

        {/* Status */}
        <section className="rounded-2xl bg-white p-5 ring-1 ring-lilac/70">
          <h2 className="font-bold text-purple-deep">Progress</h2>
          <ol className="mt-3 flex flex-wrap gap-2 text-sm">
            {statusFlow.map((s, i) => {
              const done = order.status !== "cancelled" && i <= idx;
              const at = [...order.history].reverse().find((h) => h.status === s)?.at;
              return (
                <li
                  key={s}
                  className={`rounded-lg px-3 py-2 ring-1 ${done ? "bg-purple text-white ring-purple" : "bg-white text-muted ring-lilac"}`}
                >
                  <span className="font-semibold">{statusLabel[s]}</span>
                  {at && done && <span className="block text-xs opacity-80">{fmtDateTime(at)}</span>}
                </li>
              );
            })}
          </ol>
          <div className="mt-4 flex flex-wrap gap-2">
            {next && (
              <button onClick={() => move(next)} className="inline-flex items-center gap-2 rounded-xl bg-purple px-5 py-3 font-bold text-white">
                {next === "ready" && <WhatsAppIcon className="size-5" />}
                {next === "ready" ? "Mark ready & tell customer" : `Mark ${statusLabel[next].toLowerCase()}`}
              </button>
            )}
            {order.status !== "delivered" && order.status !== "cancelled" && (
              <button onClick={() => move("cancelled")} className="rounded-xl px-4 py-3 text-sm font-semibold text-red-600 ring-1 ring-red-200">
                Cancel order
              </button>
            )}
          </div>
        </section>

        {/* Payments */}
        <section className="rounded-2xl bg-white p-5 ring-1 ring-lilac/70">
          <h2 className="font-bold text-purple-deep">Payments</h2>
          {order.payments.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Nothing paid yet.</p>
          ) : (
            <ul className="mt-2 divide-y divide-lilac/50 text-sm">
              {order.payments.map((p) => (
                <li key={p.id} className="flex justify-between py-2">
                  <span>
                    {paymentLabel[p.mode]} <span className="text-muted">· {fmtDateTime(p.at)}</span>
                  </span>
                  <span className="font-semibold">{inr(p.amount)}</span>
                </li>
              ))}
            </ul>
          )}
          {order.balance > 0 && order.status !== "cancelled" && <PaymentForm order={order} />}
        </section>

        {/* Messages */}
        <section className="rounded-2xl bg-white p-5 ring-1 ring-lilac/70">
          <h2 className="font-bold text-purple-deep">WhatsApp the customer</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <WaLink order={order} kind="order-received" label="Send bill again" />
            <WaLink order={order} kind="order-ready" label="Clothes are ready" />
            {order.balance > 0 && <WaLink order={order} kind="payment-reminder" label="Payment reminder" />}
          </div>
        </section>
      </div>

      {/* Receipt */}
      <div className="lg:sticky lg:top-20">
        <div className="no-print mb-3 flex items-center justify-between gap-3">
          <h2 className="font-bold text-purple-deep">Customer receipt</h2>
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-purple-deep px-4 py-2.5 font-bold text-white">
            <Printer className="size-4" /> Print
          </button>
        </div>
        <div className="mx-auto w-fit rounded-xl shadow-[0_1px_0_#d9c8e8,0_10px_30px_-12px_rgba(52,17,74,0.35)]">
          <Receipt order={order} />
        </div>
      </div>
    </div>
  );
}

function PaymentForm({ order }: { order: Order }) {
  const [amount, setAmount] = useState(String(order.balance));
  const [mode, setMode] = useState<PaymentMode>("cash");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="mt-4 flex flex-wrap items-end gap-2"
      onSubmit={async (e) => {
        e.preventDefault();
        const n = Math.round(Number(amount));
        if (!(n > 0)) return;
        setBusy(true);
        const updated = await repo.addPayment(order.id, n, mode);
        setAmount(String(updated.balance));
        setBusy(false);
      }}
    >
      <label className="block">
        <span className="mb-1 block text-sm font-semibold">Amount (₹)</span>
        <input
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
          className="w-32 rounded-lg border border-lilac px-3 py-2.5 focus:border-purple focus:outline-none"
        />
      </label>
      <div role="radiogroup" aria-label="Paid by" className="flex rounded-lg bg-lavender p-1">
        {(["cash", "upi", "card"] as const).map((m) => (
          <button
            type="button"
            key={m}
            role="radio"
            aria-checked={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-md px-3 py-1.5 text-sm font-bold ${mode === m ? "bg-white text-purple-deep shadow-sm" : "text-purple"}`}
          >
            {paymentLabel[m]}
          </button>
        ))}
      </div>
      <button disabled={busy} className="rounded-xl bg-eco px-5 py-2.5 font-bold text-white disabled:opacity-60">
        Record payment
      </button>
    </form>
  );
}

function WaLink({ order, kind, label }: { order: Order; kind: Parameters<typeof messageLink>[1]; label: string }) {
  return (
    <a
      href={messageLink(order, kind)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-eco ring-1 ring-eco/40 hover:bg-emerald-50"
    >
      <WhatsAppIcon className="size-4" /> {label}
    </a>
  );
}
