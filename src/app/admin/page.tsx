"use client";

import Link from "next/link";
import { inr } from "@/data/site";
import { repo } from "@/admin/data";
import { paymentLabel } from "@/admin/config";
import { useAdminStore, useRepoQuery } from "@/admin/hooks";
import { OrderList } from "@/admin/components/OrderRow";
import { fmtDate, getStore, todayYmd, toYmd } from "@/admin/lib/calc";
import type { PaymentMode } from "@/admin/types";

export default function TodayPage() {
  const { store } = useAdminStore();
  const { data: orders } = useRepoQuery(() => repo.listOrders({ storeSlug: store }), [store]);
  const today = todayYmd();

  if (!orders) return <p className="py-20 text-center text-muted">Loading…</p>;

  const live = orders.filter((o) => o.status !== "cancelled");
  const open = live.filter((o) => o.status !== "delivered");
  const takenToday = live.filter((o) => toYmd(new Date(o.createdAt)) === today);
  const dueToday = open.filter((o) => o.dueDate === today && o.status !== "ready");
  const overdue = open.filter((o) => o.dueDate < today && o.status !== "ready");
  const ready = open.filter((o) => o.status === "ready");

  const collected: Record<PaymentMode, number> = { cash: 0, upi: 0, card: 0 };
  for (const o of live) for (const p of o.payments) if (toYmd(new Date(p.at)) === today) collected[p.mode] += p.amount;
  const collectedTotal = collected.cash + collected.upi + collected.card;
  const pendingDues = live.reduce((n, o) => n + o.balance, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="display text-4xl text-purple-deep">Today, {fmtDate(today)}</h1>
        <p className="text-sm text-muted">{getStore(store).name}</p>
      </div>

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-lilac/70 ring-1 ring-lilac/70 lg:grid-cols-4">
        <Stat label="Orders taken today" value={String(takenToday.length)} sub={inr(takenToday.reduce((n, o) => n + o.total, 0))} />
        <Stat
          label="Collected today"
          value={inr(collectedTotal)}
          sub={(Object.keys(collected) as PaymentMode[]).map((m) => `${paymentLabel[m]} ${inr(collected[m])}`).join(" · ")}
        />
        <Stat label="Clothes in the shop" value={String(open.reduce((n, o) => n + o.pieces, 0))} sub={`${open.length} open orders`} />
        <Stat label="Pending dues" value={inr(pendingDues)} sub="all orders" tone={pendingDues > 0 ? "warn" : undefined} />
      </section>

      {orders.length === 0 && (
        <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-lilac/70">
          <p className="text-lg font-semibold">No orders yet for this store.</p>
          <Link href="/admin/new" className="mt-4 inline-block rounded-xl bg-eco px-5 py-3 font-bold text-white">
            Take the first order
          </Link>
        </div>
      )}

      {orders.length > 0 && (
        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title="Overdue" count={overdue.length} tone="warn">
            <OrderList orders={overdue} empty="Nothing overdue." />
          </Panel>
          <Panel title="Due today" count={dueToday.length}>
            <OrderList orders={dueToday} empty="Nothing else is due today." />
          </Panel>
          <Panel title="Ready, waiting for customer" count={ready.length}>
            <OrderList orders={ready} empty="No finished orders waiting." />
          </Panel>
          <Panel title="Taken today" count={takenToday.length}>
            <OrderList orders={takenToday} empty="No orders taken today yet." />
          </Panel>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, sub, tone }: { label: string; value: string; sub: string; tone?: "warn" }) {
  return (
    <div className="bg-white p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className={`display mt-1 text-4xl leading-none ${tone === "warn" ? "text-red-600" : "text-purple-deep"}`}>{value}</p>
      <p className="mt-1 text-xs text-muted">{sub}</p>
    </div>
  );
}

function Panel({ title, count, tone, children }: { title: string; count: number; tone?: "warn"; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-lilac/70">
      <h2 className="flex items-center justify-between border-b border-lilac/60 px-4 py-3 font-bold text-purple-deep">
        {title}
        <span className={`rounded-full px-2.5 text-sm ${tone === "warn" && count ? "bg-red-50 text-red-600" : "bg-lavender text-purple"}`}>
          {count}
        </span>
      </h2>
      {children}
    </section>
  );
}
