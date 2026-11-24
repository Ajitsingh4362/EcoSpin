"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { LogOut, Plus } from "lucide-react";
import { stores } from "@/data/site";
import { AdminStoreProvider, useAdminStore } from "../hooks";

const nav = [
  { href: "/admin", label: "Today" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
];

const noop = () => () => {};

export function AdminShell({ children }: { children: React.ReactNode }) {
  // The panel reads this device's data and today's date, so it only renders in the browser.
  const inBrowser = useSyncExternalStore(noop, () => true, () => false);
  return (
    <AdminStoreProvider>
      <Bar />
      <main className="admin-main mx-auto w-full max-w-7xl flex-1 px-4 pt-5 pb-28 sm:px-6">
        {inBrowser ? children : <p className="py-20 text-center text-muted">Loading…</p>}
      </main>
    </AdminStoreProvider>
  );
}

function Bar() {
  const path = usePathname();
  const { store, setStore } = useAdminStore();
  return (
    <header className="no-print sticky top-0 z-30 bg-purple-deep text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/admin" className="display text-2xl leading-none">
          EcoSpin <span className="font-sans text-sm font-semibold not-italic text-lilac">Counter</span>
        </Link>

        <nav className="order-3 -mx-1 flex w-full gap-1 overflow-x-auto sm:order-none sm:w-auto">
          {nav.map((n) => {
            const active = n.href === "/admin" ? path === "/admin" : path.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap ${
                  active ? "bg-white/15 text-white" : "text-lilac hover:text-white"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div role="radiogroup" aria-label="Store" className="flex rounded-lg bg-white/10 p-0.5">
            {stores.map((s) => (
              <button
                key={s.slug}
                role="radio"
                aria-checked={store === s.slug}
                onClick={() => setStore(s.slug)}
                className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
                  store === s.slug ? "bg-white text-purple-deep" : "text-lilac hover:text-white"
                }`}
              >
                {s.slug === "thane" ? "Thane" : "Kharghar"}
              </button>
            ))}
          </div>
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-eco px-4 py-2 text-sm font-bold text-white hover:brightness-110"
          >
            <Plus className="size-4" strokeWidth={3} /> New order
          </Link>
          <form method="post" action="/api/admin/logout">
            <button aria-label="Log out" title="Log out" className="rounded-lg p-2 text-lilac hover:bg-white/10 hover:text-white">
              <LogOut className="size-5" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
