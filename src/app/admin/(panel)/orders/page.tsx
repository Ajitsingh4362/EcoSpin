"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { repo } from "@/admin/data";
import { statusLabel } from "@/admin/config";
import { useAdminStore, useRepoQuery } from "@/admin/hooks";
import { OrderList } from "@/admin/components/OrderRow";
import { getStore } from "@/admin/lib/calc";
import type { OrderFilter } from "@/admin/data";

const filters: { id: NonNullable<OrderFilter["status"]> | "all"; label: string }[] = [
  { id: "open", label: "Open" },
  { id: "received", label: statusLabel.received },
  { id: "processing", label: statusLabel.processing },
  { id: "ready", label: statusLabel.ready },
  { id: "delivered", label: statusLabel.delivered },
  { id: "cancelled", label: statusLabel.cancelled },
  { id: "all", label: "All" },
];

export default function OrdersPage() {
  const { store } = useAdminStore();
  const [status, setStatus] = useState<(typeof filters)[number]["id"]>("open");
  const [search, setSearch] = useState("");
  const { data: orders } = useRepoQuery(
    () => repo.listOrders({ storeSlug: store, status: status === "all" ? undefined : status, search }),
    [store, status, search],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="display text-4xl text-purple-deep">Orders</h1>
          <p className="text-sm text-muted">{getStore(store).name}</p>
        </div>
        <label className="relative w-full sm:w-72">
          <span className="sr-only">Search orders</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Order no., name or mobile"
            className="w-full rounded-lg border border-lilac bg-white py-2.5 pr-3 pl-9 focus:border-purple focus:outline-none"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Status">
        {filters.map((f) => (
          <button
            key={f.id}
            role="radio"
            aria-checked={status === f.id}
            onClick={() => setStatus(f.id)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 ${
              status === f.id ? "bg-purple text-white ring-purple" : "bg-white text-purple ring-lilac"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-lilac/70">
        {orders === undefined ? (
          <p className="px-4 py-8 text-center text-sm text-muted">Loading…</p>
        ) : (
          <OrderList orders={orders} empty={search ? `No orders match “${search}”.` : "No orders here yet."} />
        )}
      </section>
    </div>
  );
}
