"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { formatPhone, inr, telHref, waHref } from "@/data/site";
import { repo } from "@/admin/data";
import { useRepoQuery } from "@/admin/hooks";
import { OrderList } from "@/admin/components/OrderRow";
import { fmtDate } from "@/admin/lib/calc";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const { data: customers } = useRepoQuery(() => repo.listCustomers(search), [search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="display text-4xl text-purple-deep">Customers</h1>
          <p className="text-sm text-muted">Both stores</p>
        </div>
        <label className="relative w-full sm:w-72">
          <span className="sr-only">Search customers</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name or mobile"
            className="w-full rounded-lg border border-lilac bg-white py-2.5 pr-3 pl-9 focus:border-purple focus:outline-none"
          />
        </label>
      </div>

      <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-lilac/70">
        {customers === undefined && <p className="px-4 py-8 text-center text-sm text-muted">Loading…</p>}
        {customers?.length === 0 && (
          <p className="px-4 py-8 text-center text-sm text-muted">
            {search ? `No customer matches “${search}”.` : "Customers appear here after their first order."}
          </p>
        )}
        <ul className="divide-y divide-lilac/50">
          {customers?.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => setOpenId(openId === c.id ? null : c.id)}
                aria-expanded={openId === c.id}
                className="grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-4 py-3 text-left hover:bg-lavender/50 sm:grid-cols-[minmax(0,1fr)_120px_120px_120px]"
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{c.name}</span>
                  <span className="block text-sm text-muted">{formatPhone(c.phone)}</span>
                </span>
                <span className="text-sm text-muted">
                  {c.orders} {c.orders === 1 ? "order" : "orders"}
                  {c.lastOrderAt && <span className="block text-xs">Last {fmtDate(c.lastOrderAt)}</span>}
                </span>
                <span className="text-sm font-semibold">{inr(c.spent)}</span>
                <span className={`text-sm font-semibold sm:text-right ${c.due > 0 ? "text-red-600" : "text-eco"}`}>
                  {c.due > 0 ? `${inr(c.due)} due` : "No dues"}
                </span>
              </button>
              {openId === c.id && <CustomerOrders id={c.id} phone={c.phone} address={c.address} />}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function CustomerOrders({ id, phone, address }: { id: string; phone: string; address: string }) {
  const { data: orders } = useRepoQuery(() => repo.listOrders({ customerId: id }), [id]);
  return (
    <div className="border-t border-lilac/50 bg-lavender/30">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
        {address && <span className="text-muted">{address}</span>}
        <a href={telHref(phone)} className="font-semibold text-purple underline">
          Call
        </a>
        <a href={waHref(phone)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-eco">
          <WhatsAppIcon className="size-4" /> WhatsApp
        </a>
      </div>
      {orders && <OrderList orders={orders} empty="No orders." />}
    </div>
  );
}
